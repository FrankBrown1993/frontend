import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "../_services/websocket.service";
import {takeUntil} from "rxjs/operators";
import {Message} from "../_classes/comm/message";

@Component({
  selector: 'app-heldenbogen',
  templateUrl: './heldenbogen.component.html',
  styleUrls: ['./heldenbogen.component.sass']
})
export class HeldenbogenComponent implements OnInit, OnDestroy {

  destroyed = new Subject();
  public categories: string[] = ['Allgemein', 'Talente', 'Ausrüstung', 'Kampf', 'Notizen'];

  /** Titelbereich */
  /* Charakter-Werte */
  /*
  aktuelle LeP
  max LeP
  aktuelle AsP
  max AsP
  aktuelle KaP
  max KaP
  GS
  AW
  INI
  SK
  ZK
  MU
  KL
  CH
  IN
  FF
  GE
  KO
  KK
  Trunkenheit
  */
  public titel: string = 'Allgemeine Informationen';


  constructor(private websocket: WebsocketService) { }

  ngOnInit(): void {
    const websocket = this.websocket.connect('id').pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      console.log(message);
    });

    /** Dummy Message */
    const msg = '';
  }

  ngOnDestroy() {
    this.destroyed.next(1);
  }
}
