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

  step = 0;

  constructor(private websocket: WebsocketService) {}

  ngOnInit(): void {
    this.id = sessionStorage.getItem('user_id')!;

    const websocket = this.websocket.connect(this.id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.type === 'h_erfahrungen' && message.body.length > 0) {
        const stufen: string[] = JSON.parse(message.body);
        console.log(stufen);
      }
    });
  }

  public startHeldenerschaffung(): void {
    const message: Message = new Message('heldenerschaffung', 'h_erfahrungen', '', 0, -1, 'start');
    this.websocket.sendMessage(message)
    this.step = 1;
  }
}
