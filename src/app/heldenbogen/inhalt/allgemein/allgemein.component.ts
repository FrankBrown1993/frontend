import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Titelbereich} from "../../../_classes/comm/payload/titelbereich";
import {WebsocketService} from "../../../_services/websocket.service";
import {BlattAllgemein} from "../../../_classes/comm/payload/blatt-allgemein";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../../_classes/comm/message";

@Component({
  selector: 'app-allgemein',
  templateUrl: './allgemein.component.html',
  styleUrls: ['./allgemein.component.sass']
})
export class AllgemeinComponent implements OnInit, OnDestroy  {

  id = 'id_test';
  charId = 5;

  /** Charakter-Werte */
  public werte: BlattAllgemein = new BlattAllgemein();

  /** Websocket */
  destroyed = new Subject();


  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    const websocket = this.websocket.connect(this.id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.type === 'blatt_allgemein' && message.body.length > 0) {
        const neueWerte: BlattAllgemein = JSON.parse(message.body);
        this.werte.copy(neueWerte);
        console.log(neueWerte);
        console.log(this.werte);
        this.reload();
      }
      console.log(message);
    });

    /** Dummy Message */
    // this.werte.dummyValues();
    // this.reload();

    const message: Message = new Message('character', 'blatt_allgemein', '', 0, this.charId, 'profil');
    this.sendMessage(message);
  }

  constructor(private websocket: WebsocketService) {}

  reload(): void {
    // Todo
  }

  private sendMessage(message: Message): void {
    this.websocket.sendMessage(message);
  }

}
