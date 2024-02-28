import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
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
  /** ToDo: change this to dynamic */
  id = 'id_test';
  charId = 5;

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
  public titel: string = 'Steckbrief';

  public activeOverlay: string = '';


  constructor(private websocket: WebsocketService) { }

  ngOnInit(): void {
    this.id = sessionStorage.getItem('user_id')!;
    console.log(sessionStorage);

    const websocket = this.websocket.connect(this.id).pipe(
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
