import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";
import {WebsocketService} from "../../_services/websocket.service";
import {Titelbereich} from "../../_classes/comm/payload/titelbereich";

@Component({
  selector: 'app-titelbereich',
  templateUrl: './titelbereich.component.html',
  styleUrls: ['./titelbereich.component.sass']
})
export class TitelbereichComponent implements OnInit, OnDestroy  {
  /** Charakter-Werte */
  public werte: Titelbereich = new Titelbereich();
  /*
  aktLeP
  maxLeP
  aktAsP
  maxAsP
  aktKaP
  maxKaP
  gs
  aw
  ini
  sk
  zk
  mu
  kl
  ch
  in
  ff
  ge
  ko
  kk
  trunkenheit
  */

  destroyed = new Subject();
  constructor(private websocket: WebsocketService) { }

  ngOnInit(): void {
    const websocket = this.websocket.connect('id').pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.type === 'titelbereich' && message.body.length > 0) {
        const neueWerte: Titelbereich = JSON.parse(message.body);
        this.werte.copy(neueWerte);
        console.log(neueWerte);
        console.log(this.werte);
      }
      console.log(message);
    });

    /** Dummy Message */
    this.werte.dummyValues();
  }

  test(): void {
    const message2: Message = new Message('titelbereich2', 0, -1, '');
    this.websocket.sendMessage(message2);
  }

  ngOnDestroy() {
    this.destroyed.next(1);
  }
}
