import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Message} from "../_classes/comm/message";
import {BlattAllgemein} from "../_classes/comm/payload/blatt-allgemein";
import {WebsocketService} from "../_services/websocket.service";

@Component({
  selector: 'app-heldenerschaffung',
  templateUrl: './heldenerschaffung.component.html',
  styleUrls: ['./heldenerschaffung.component.sass']
})
export class HeldenerschaffungComponent implements OnInit {
  destroyed = new Subject();
  id: string;
  msgprefix = "erschaffung_";

  step = 0;
  ap: number;
  start_ap: number;

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
          const msg_type = message.type.substring(this.msgprefix.length);
          if (msg_type === 'step') {
            this.step = JSON.parse(message.body).step;
          } else if (msg_type === 'ap') {
            this.ap = JSON.parse(message.body).ap;
            this.start_ap = JSON.parse(message.body).start_ap;
          }
        }
      } else {
        console.error("MESSAGE BODY IS NULL");
      }

    });
    this.getCurrentStep();
  }

  public getCurrentStep() {
    console.log("[HELDENERSCHAFFUNG] erfrage step");
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'step', '', 0,
      -1, this.msgprefix + 'step');
    this.websocket.sendMessage(message)
  }


  public startHeldenerschaffung(): void {
    console.log("[HELDENERSCHAFFUNG] starte neue heldenerschaffung");
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'step', '', 0,
      -1, this.msgprefix + 'start');
    this.websocket.sendMessage(message);
  }

  public resetHeldenerschaffung(): void {
    console.log("[HELDENERSCHAFFUNG] starte neue heldenerschaffung");
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'step', '', 0,
      -1, this.msgprefix + 'reset');
    this.websocket.sendMessage(message);
  }

  public zurueck(): void {
    this.step --;
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'weiter', '', this.step,
      -1, this.msgprefix + 'weiter');
    this.websocket.sendMessage(message);
  }
  public weiter(): void {
    this.step ++;
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'weiter', '', this.step,
      -1, this.msgprefix + 'weiter');
    this.websocket.sendMessage(message);
  }
}
