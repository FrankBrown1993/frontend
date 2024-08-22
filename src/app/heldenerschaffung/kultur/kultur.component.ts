import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "../../_services/websocket.service";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";

@Component({
  selector: 'app-kultur',
  templateUrl: './kultur.component.html',
  styleUrls: ['./kultur.component.sass']
})
export class KulturComponent implements OnInit {
  destroyed = new Subject();
  id: string;
  msgprefix = "kultur_";

  kulturen: Map<string, string> = new Map();
  name = "";
  infos: any;

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
          console.log("[HELDENERSCHAFFUNG][KULTUR]", msg_type);
          if (msg_type === 'list') {
            console.log("[HELDENERSCHAFFUNG][KULTUR]", JSON.parse(message.body));
            this.name = "";
            JSON.parse(message.body).uebliche_kulturen.forEach((k: string) => {
              if (this.name === "") {
                this.name = k;
              }
              this.kulturen.set(k, "kulturen0");
            });
            JSON.parse(message.body).restliche_kulturen.forEach((k: string) => {
              this.kulturen.set(k, "kulturen1");
            });
            JSON.parse(message.body).unuebliche_kulturen.forEach((k: string) => {
              this.kulturen.set(k, "kulturen2");
            });
            this.kulturen = new Map([...this.kulturen].sort((a, b) => String(a[0]).localeCompare(b[0])));
          } else if (msg_type === 'get') {
            this.name = JSON.parse(message.body).name ?? this.name;
            this.set();
          } else if (msg_type === 'info') {
            console.log("[HELDENERSCHAFFUNG][KULTUR]", JSON.parse(message.body));
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
      0, -1, this.msgprefix + 'get_all');
    this.websocket.sendMessage(message)
  }

  public get() {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'get', '',
      0, -1, this.msgprefix + 'get');
    this.websocket.sendMessage(message)
    // this.getInfos();
  }

  public set(): void {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + '-', '',
      0, -1, this.msgprefix + 'set_' + this.name);
    this.websocket.sendMessage(message)
    this.getInfos();
    sessionStorage.removeItem('werte');
  }

  public getInfos() {
    console.log("[HELDENERSCHAFFUNG][KULTUR]","getInfos()")
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'info', '',
      0, -1, this.msgprefix + 'info');
    this.websocket.sendMessage(message)
    console.log("[HELDENERSCHAFFUNG][KULTUR]","getInfos()",message)
  }
}
