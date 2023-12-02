import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../../_services/websocket.service";
import {DomSanitizer} from "@angular/platform-browser";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";
import {Subject} from "rxjs";

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.sass']
})
export class ConnectionComponent implements OnInit, OnDestroy {
  /** Websocket */
  destroyed = new Subject();

  image: string = '';


  constructor(private websocket: WebsocketService,
              private sanitizer: DomSanitizer) {}

  ngOnDestroy(): void {
    this.destroyed.next(1);
  }

  ngOnInit(): void {
    const websocket = this.websocket.connect('id').pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      console.log(message);
      if (message.type === 'testfile') {
        this.image = message.body;
      }
    });
  }

  onFileChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.getBase64(file).then((data: string) => {
        const message: Message = new Message('testfile', 'id', '', 0, -1, data);
        this.websocket.sendMessage(message);
      });
    }
  }

  getBase64(file: File): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


}
