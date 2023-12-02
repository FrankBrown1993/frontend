import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";
import {WebsocketService} from "../../_services/websocket.service";
import {Titelbereich} from "../../_classes/comm/payload/titelbereich";
import {drunkVision} from "../../_interfaces/animations/drunkVision";
import {doubleVision} from "../../_interfaces/animations/double-vision";
import {ModifiableValue} from "../../_classes/comm/payload/modifiable-value";
import {BooleanEvent} from "../../_interfaces/events/boolean-event";
import {Event} from "@angular/router";
import {ModValuesComponent} from "../mod-values/mod-values.component";
import {Modvaluepopup} from "../../_classes/modvaluepopup";

@Component({
  selector: 'app-titelbereich',
  templateUrl: './titelbereich.component.html',
  styleUrls: ['./titelbereich.component.sass'],
  animations: [
    drunkVision,
    doubleVision
  ],
})
export class TitelbereichComponent implements OnInit, OnDestroy  {
  @Input() titel: string;

  id = 'id_test';
  charId = 5;


  /** Charakter-Werte */
  public werte: Titelbereich = new Titelbereich();
  public eigenschaften: Map<string, number> = new Map<string, number>();

  /** Abenteuer-Informationen */
  public datum: string = '';
  public zeit: string = '';

  /** Websocket */
  destroyed = new Subject();



  constructor(private websocket: WebsocketService,
              private ngZone: NgZone) {
    const namen: string[] = ['1MU', '2KL', '3IN', '4CH', '5FF', '6GE', '7KO', '8KK'];
    namen.forEach(name => {
      this.eigenschaften.set(name, 0);
    });
  }

  public drunkVision = 'done';
  public doubleVision = 'done';

  public modValPopup: Modvaluepopup = new Modvaluepopup();

  public toggleDrunkVision() {
    if (this.drunkVision.startsWith('drunk')) {
      this.drunkVision = 'done';
    } else {
      this.drunkVision = 'drunk' + this.werte.rausch;
    }
  }

  public toggleDoubleVision() {
    if (this.doubleVision.startsWith('drunk')) {
      this.doubleVision = 'done';
    } else {
      this.doubleVision = 'drunk' + this.werte.rausch;
    }
  }

  ngOnInit(): void {
    const websocket = this.websocket.connect(this.id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.body.length > 0) {
        if (message.type === 'titelbereich') {
          const neueWerte: Titelbereich = JSON.parse(message.body);
          this.werte.copy(neueWerte);
          console.log(neueWerte);
          console.log(this.werte);
          this.reload();
        } else if (message.type === 'titelbereich_modifiable') {
          const mods: ModifiableValue[] = JSON.parse(message.body);
          this.distributeMods(mods);

        }
      }
      console.log(message);
    });

    const message: Message = new Message('energy', 'titelbereich', '', 0, this.charId, 'all');
    this.sendMessage(message);

    /** Dummy Message */
    // this.werte.dummyValues();
    // this.reload();
  }

  private distributeMods(mods: ModifiableValue[]): void {
    this.ngZone.run( () => {
      const temp: Modvaluepopup = new Modvaluepopup();
      temp.modified = this.modValPopup.modified;
      temp.pointerX = this.modValPopup.pointerX;
      temp.pointerY = this.modValPopup.pointerY;
      this.modValPopup = new Modvaluepopup();
      this.modValPopup.copy(temp);
      mods.forEach(m => {
        let str: string = m.modValue;
        if (str.startsWith('x')) {
          str = str.substring(1);
          if (parseFloat(str) > 1) {
            this.modValPopup.modifiableValuesPos.push(m);
          } else if (parseFloat(str) < 1) {
            this.modValPopup.modifiableValuesNeg.push(m);
          }
        } else {
          if (parseFloat(str) > 0) {
            this.modValPopup.modifiableValuesPos.push(m);
          } else if (parseFloat(str) < 0) {
            this.modValPopup.modifiableValuesNeg.push(m);
          }
        }
      });
    });

  }

  public closePopup(): void {
    this.modValPopup = new Modvaluepopup();
  }

  ngOnDestroy() {
    this.destroyed.next(1);
  }

  reload(): void {
    this.getEigenschaften();
    this.datum = this.werte.getDatum('Zwölfgötter');
    this.zeit = this.werte.getZeitbeschreibung();
  }

  getEigenschaften(): void {
    this.eigenschaften.set('1MU', this.werte.mu);
    this.eigenschaften.set('2KL', this.werte.kl);
    this.eigenschaften.set('3IN', this.werte.in);
    this.eigenschaften.set('4CH', this.werte.ch);
    this.eigenschaften.set('5FF', this.werte.ff);
    this.eigenschaften.set('6GE', this.werte.ge);
    this.eigenschaften.set('7KO', this.werte.ko);
    this.eigenschaften.set('8KK', this.werte.kk);
  }

  /**
   * Increases or decreases a named value about 1 point
   * @Param modification: incLeP or decLeP
   */
  changeWert(modification: number, name: string): void {
    const message: Message = new Message('energy', 'titelbereich', 'manuell', modification, this.charId, name);
    this.sendMessage(message);
  }

  public getModifierFor($event: any, name: string): void {
    console.log($event);
    this.ngZone.run( () => {
      if (this.modValPopup != null) {
        this.modValPopup.pointerX = $event.clientX;
        this.modValPopup.pointerY = $event.clientY;
        this.modValPopup.modified = name;
      }
    });

    const message: Message = new Message('modValues', 'titelbereich_modifiable', '', 0, this.charId, name);
    this.sendMessage(message);
  }

  private sendMessage(message: Message): void {
    this.websocket.sendMessage(message);
  }



  getShakeAnimationTiming() {
    return {
      duration: 300,
      iterations: 3,
    };
  }

  istOhnmaechtig(): boolean {
    return false;
  }

  test2(): void {

  }


}
