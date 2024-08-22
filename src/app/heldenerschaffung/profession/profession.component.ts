import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "../../_services/websocket.service";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";

@Component({
  selector: 'app-profession',
  templateUrl: './profession.component.html',
  styleUrls: ['./profession.component.sass']
})
export class ProfessionComponent implements OnInit {
  destroyed = new Subject();
  id: string;
  msgprefix = "profession_";

  list: string[][] = [];
  classes: string[][] = [];
  infos: any;
  professionMap: any;
  chosenKeys: string[] = [];
  typischeProfessionen = 0;


  romanLetters: string[] = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"];

  constructor(private websocket: WebsocketService) {}

  ngOnInit(): void {
    console.log()
    this.id = sessionStorage.getItem('user_id')!;

    const websocket = this.websocket.connect(this.id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.body != null && message.body.length > 0) {
        if (message.type.startsWith(this.msgprefix)) {
          const msg_type = message.type.substring(this.msgprefix.length);
          console.log("[HELDENERSCHAFFUNG][PROFESSION]", msg_type);
          if (msg_type === 'list') {
            console.log("[HELDENERSCHAFFUNG][PROFESSION]", JSON.parse(message.body));
            this.professionMap = JSON.parse(message.body);
            this.getKeys(0);

          } else if (msg_type === 'get') {
            console.log("[HELDENERSCHAFFUNG][PROFESSION]", JSON.parse(message.body));
            const saved = JSON.parse(message.body).name;
            let index = 0;

            const lastIndex = saved.length - 1;
            saved.forEach(u => {
              console.log("[HELDENERSCHAFFUNG][PROFESSION]", "wähle " + u)
              this.chosenKeys[index] = u;
              this.getKeys(index+1, (index) === lastIndex);
              index++;
            });


          } else if (msg_type === 'info') {
            console.log("[HELDENERSCHAFFUNG][PROFESSION]", JSON.parse(message.body));
            this.infos = JSON.parse(message.body);
          }
        }
      } else {
        console.error("MESSAGE BODY IS NULL");
      }
    });
    this.getList();
    this.get();
  }

  public getList(): void {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'list', '',
      this.typischeProfessionen, -1, this.msgprefix + 'get_all');
    this.websocket.sendMessage(message)
  }

  public get() {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'get', '',
      0, -1, this.msgprefix + 'get');
    this.websocket.sendMessage(message)
  }

  public set(profession: string): void {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + '-', '',
      0, -1, this.msgprefix + 'set_' + profession);
    this.websocket.sendMessage(message)
    this.getInfos();
  }

  public getInfos() {
    console.log("[HELDENERSCHAFFUNG][PROFESSION]","getInfos()")
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'info', '',
      0, -1, this.msgprefix + 'info');
    this.websocket.sendMessage(message)
    console.log("[HELDENERSCHAFFUNG][PROFESSION]","getInfos()",message)
  }

  public getKeys(index: number, allowedToFetch: boolean = true) {
    let tempList: string[][] = [];
    let tempClasses: string[][] = [];
    let tempChosenKeys: string[] = [];
    for (let i = 0; i < index; i++) {
      tempList[i] = this.list[i];
      tempClasses[i] = this.classes[i];
      tempChosenKeys[i] = this.chosenKeys[i];
    }

    this.list = tempList;
    this.classes = tempClasses;
    this.chosenKeys = tempChosenKeys;
    this.chosenKeys[index] = "";

    for (let i = 0; i < this.chosenKeys.length; i++) {
      this.list[i] = [];
      this.classes[i] = [];
      let map = this.professionMap;
      for (let j = 0; j < i; j++) {
        map = map[this.chosenKeys[j]]
      }
      Object.keys(map).forEach(k => {
        if (k !== 'name') {
          this.list[i].push(k);
          if (map[k].hasOwnProperty("name")) {
            this.classes[i].push('beruf');
          } else {
            this.classes[i].push('kategorie');
          }
        }
      });
      if (this.list[i].length === 0) {
        tempList = [];
        tempClasses = [];
        tempChosenKeys = [];
        for (let j = 0; j < i; j++) {
          tempList[j] = this.list[j];
          tempClasses[j] = this.classes[j];
          tempChosenKeys[j] = this.chosenKeys[j];
        }
        this.list = tempList;
        this.classes = tempClasses;
        this.chosenKeys = tempChosenKeys;
      }
    }
    let profession = null;
    if (index > 0) {
      profession = this.chosenKeys[index - 1];
      const listIndex = this.list[index - 1].indexOf(profession);
      const art = this.classes[index - 1][listIndex];
      if (art === 'beruf' && allowedToFetch) {
        console.log("[HELDENERSCHAFFUNG][PROFESSION]","neuer Beruf:", profession);
        this.set(profession);
        sessionStorage.removeItem('werte');
      }
    }

  }

  public removeChoice(index: number): void {
    let tempList: string[][] = [];
    let tempClasses: string[][] = [];
    let tempChosenKeys: string[] = [];
    for (let i = 0; i < index; i++) {
      tempList[i] = this.list[i];
      tempClasses[i] = this.classes[i];
      tempChosenKeys[i] = this.chosenKeys[i];
    }
    this.list = tempList;
    this.classes = tempClasses;
    this.chosenKeys = tempChosenKeys;
    this.chosenKeys[index] = "";

    this.getKeys(index);
  }
}
