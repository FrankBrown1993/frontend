import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "../../_services/websocket.service";
import {takeUntil} from "rxjs/operators";
import {BooleanEvent} from "../../_interfaces/events/boolean-event";
import {Message} from "../../_classes/comm/message";
import {Fighter} from "../../_classes/comm/payload/fighter";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Output() ping: EventEmitter<any> = new EventEmitter<any>();
  destroyed = new Subject();

  id = 'login';

  input: string;
  constructor(private websocket: WebsocketService) { }

  ngOnInit(): void {
    const id = sessionStorage.getItem('user_id');
    if (id != null) {
      this.ping.emit(id);
    } else {
      const websocket = this.websocket.connectFirst(this.id).pipe(
        takeUntil(this.destroyed),
      );

      websocket.subscribe((raw: string) => {
        const message: Message = JSON.parse(raw);
        if (message.type === 'login' && message.body.length > 0) {
          if (message.body !== '-1') {
            console.log('put id in session', message.body);
            sessionStorage.setItem('user_id', message.body);
            this.ping.emit(message.body);
          }
        }
        console.log(message);
      });
    }



  }

  ngOnDestroy() {
    this.websocket.closeFirstConnection();
    this.destroyed.next(1);
  }

  login(): void {
    const message: Message = new Message('auth', 'login', '', 0, -1, this.input);
    this.websocket.sendMessageFirstConnetion(message);
  }

  keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.login();
    }
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
