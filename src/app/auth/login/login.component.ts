import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "../../_services/websocket.service";
import {takeUntil} from "rxjs/operators";
import {BooleanEvent} from "../../_interfaces/events/boolean-event";
import {Message} from "../../_classes/comm/message";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() ping: EventEmitter<any> = new EventEmitter<any>();
  destroyed = new Subject();

  input: string;
  constructor(private websocket: WebsocketService) { }

  ngOnInit(): void {
    const websocket = this.websocket.connect('id').pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      // ToDo handle login
      console.log(message);
    });
  }

  ngOnDestroy() {
    this.destroyed.next(1);
  }

  login(): void {
    const message: Message = new Message('login', 0, this.input);
    this.websocket.sendMessage(message);

    // ToDo code below should be in incoming messages
    const event: BooleanEvent = {
      value: true
    }
    this.ping.emit(event);
  }
  navigateBack(): void {
    const event: BooleanEvent = {
      value: false
    }
    this.ping.emit(event);
  }

  userInput(): void {
    if (this.input != null && this.input.length > 0) {
      document.getElementById('button')!.style.visibility = 'visible';
    } else {
      document.getElementById('button')!.style.visibility = 'hidden';
    }
  }

}
