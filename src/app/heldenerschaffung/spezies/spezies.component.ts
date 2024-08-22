import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../../_services/websocket.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";

@Component({
  selector: 'app-spezies',
  templateUrl: './spezies.component.html',
  styleUrls: ['./spezies.component.sass']
})
export class SpeziesComponent implements OnInit {
  destroyed = new Subject();
  id: string;
  msgprefix = "spezies_";

  artenMap: Map<string, string[]>;
  oberArt: string;
  unterArten: string[];
  unterArt: string;
  infos: any;

  romanLetters: string[] = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"];

  constructor(private websocket: WebsocketService) {}

  ngOnInit(): void {
    this.id = sessionStorage.getItem('user_id')!;

    const websocket = this.websocket.connect(this.id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.body != null && message.body.length > 0) {
        if (message.type.startsWith(this.msgprefix)) {
          console.log("[HELDENERSCHAFFUNG][SPEZIES]", message.type);
          const msg_type = message.type.substring(this.msgprefix.length);
          if (msg_type === 'get') {
            console.log("[HELDENERSCHAFFUNG][SPEZIES]", JSON.parse(message.body));
            this.oberArt = JSON.parse(message.body).art
            this.createUnterartList();
            this.setUnterart(JSON.parse(message.body).unterart);
            console.log("[HELDENERSCHAFFUNG][SPEZIES]", this.oberArt, this.unterArt);
          } else if (msg_type === 'get_list') {
            console.log("[HELDENERSCHAFFUNG][SPEZIES]", JSON.parse(message.body));
            this.artenMap = new Map<string, string[]>();
            JSON.parse(message.body).forEach((data: any) => {
              let unterArten = this.artenMap.get(data.art);
              if (unterArten == null) {
                unterArten = [];
              }
              unterArten.push(data.unterart);
              this.artenMap.set(data.art, unterArten);
            });
          } else if (msg_type === 'info') {
            console.log("[HELDENERSCHAFFUNG][SPEZIES]", JSON.parse(message.body));
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

  public setUnterart(name: string): void {
    this.unterArt = name;
    const message: Message = new Message('heldenerschaffung', this.msgprefix + '-', '',
      0, -1, this.msgprefix + 'set_' + this.unterArt);
    this.websocket.sendMessage(message)
    this.getInfos();
    sessionStorage.removeItem('werte');
  }


  public createUnterartList(): void {
    this.unterArten = this.artenMap.get(this.oberArt)!;
    this.setUnterart(this.unterArten[0]);
  }

  public get() {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'get', '',
      0, -1, this.msgprefix + 'get');
    this.websocket.sendMessage(message)
    // this.getInfos();
  }

  public getInfos() {
    console.log("[HELDENERSCHAFFUNG][SPEZIES]","getInfos()")
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'info', '',
      0, -1, this.msgprefix + 'info');
    this.websocket.sendMessage(message)
    console.log("[HELDENERSCHAFFUNG][SPEZIES]","getInfos()",message)
  }

  public getList() {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'get_list', '',
      0, -1, this.msgprefix + 'get_list');
    this.websocket.sendMessage(message)
  }
}
