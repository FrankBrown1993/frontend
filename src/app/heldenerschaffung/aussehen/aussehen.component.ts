import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";
import {WebsocketService} from "../../_services/websocket.service";

@Component({
  selector: 'app-aussehen',
  templateUrl: './aussehen.component.html',
  styleUrls: ['./aussehen.component.sass']
})
export class AussehenComponent implements OnInit {
  destroyed = new Subject();
  id: string;
  msgprefix = "aussehen_";
  infos: any;

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
          console.log("[HELDENERSCHAFFUNG][AUSSEHEN]", message.type);
          const msg_type = message.type.substring(this.msgprefix.length);
          if (msg_type === 'info') {
            console.log("[HELDENERSCHAFFUNG][AUSSEHEN]", JSON.parse(message.body));
            this.infos = JSON.parse(message.body);
          }
        }
      } else {
        console.error("MESSAGE BODY IS NULL");
      }
    });
    this.getInfos();
  }

  public getInfos() {
    console.log("[HELDENERSCHAFFUNG][SPEZIES]","getInfos()")
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'info', '',
      0, -1, this.msgprefix + 'info');
    this.websocket.sendMessage(message)
    console.log("[HELDENERSCHAFFUNG][SPEZIES]","getInfos()",message)
  }
}
