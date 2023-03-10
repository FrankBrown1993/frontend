import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  @Input() titel: string;


  /** Charakter-Werte */
  public werte: Titelbereich = new Titelbereich();
  public eigenschaften: Map<string, number> = new Map<string, number>();

  /** Abenteuer-Informationen */
  public datum: string = '';
  public zeit: string = '';

  /** Websocket */
  destroyed = new Subject();

  constructor(private websocket: WebsocketService) {
    const namen: string[] = ['1MU', '2KL', '3IN', '4CH', '5FF', '6GE', '7KO', '8KK'];
    namen.forEach(name => {
      this.eigenschaften.set(name, 0);
    });
  }

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
        this.reload();
      }
      console.log(message);
    });

    /** Dummy Message */
    this.werte.dummyValues();
    this.reload();

  }

  test(): void {
    const message2: Message = new Message('titelbereich2', 0, -1, '');
    this.websocket.sendMessage(message2);
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

  getShakeAnimationTiming() {
    return {
      duration: 300,
      iterations: 3,
    };
  }

}
