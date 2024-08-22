import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../../_services/websocket.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";

@Component({
  selector: 'app-erfahrung',
  templateUrl: './erfahrung.component.html',
  styleUrls: ['./erfahrung.component.sass']
})
export class ErfahrungComponent implements OnInit {
  destroyed = new Subject();
  id: string;
  msgprefix = "erfahrung_";

  erfahrungsstufen: string[];
  erfahrung = "Unerfahren";
  erfInfos: any;

  constructor(private websocket: WebsocketService) {}

  ngOnInit(): void {
    console.log("[HELDENERSCHAFFUNG][ERFAHRUNG] ONINIT");
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
          console.log("[HELDENERSCHAFFUNG][ERFAHRUNG]", msg_type);
          if (msg_type === 'stufen') {
            this.erfahrungsstufen = JSON.parse(message.body);
          } else if (msg_type === 'infos') {
            this.erfInfos = JSON.parse(message.body);
            console.log("[HELDENERSCHAFFUNG][ERFAHRUNG]", JSON.parse(message.body));
          } else if (msg_type === 'get') {
            this.erfahrung = JSON.parse(message.body).erfahrung;
            this.getInfos();
          }
        }
      } else {
        console.error("MESSAGE BODY IS NULL");
      }
    });
    this.getErfahrungsStufen();
    this.get();
  }

  public getErfahrungsStufen(): void {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'stufen', '',
      0, -1, this.msgprefix + 'get_all');
    this.websocket.sendMessage(message)
  }

  public get() {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'get', '',
      0, -1, this.msgprefix + 'get');
    this.websocket.sendMessage(message)
    this.getInfos();
  }

  public setErfahrung() {
    console.log("set erfahrung", this.erfahrung);
    const message: Message = new Message('heldenerschaffung', this.msgprefix + '-', '',
      0, -1, this.msgprefix + 'set_' + this.erfahrung);
    this.websocket.sendMessage(message);
    this.getInfos();
  }

  public getInfos() {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'infos', '',
      0, -1, this.msgprefix + 'get_infos');
    this.websocket.sendMessage(message)
  }
}
