import {Component, OnDestroy, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../../_classes/comm/message";
import {Titelbereich} from "../../../_classes/comm/payload/titelbereich";
import {ModifiableValue} from "../../../_classes/comm/payload/modifiable-value";
import {WebsocketService} from "../../../_services/websocket.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-portrait',
  templateUrl: './portrait.component.html',
  styleUrls: ['./portrait.component.sass']
})
export class PortraitComponent implements OnInit, OnDestroy  {

  /** ToDo: change this to dynamic */
  id = 'id_test';
  charId = 5;

  portrait: SafeResourceUrl;
  edit = false;

  /** Websocket */
  destroyed = new Subject();


  constructor(private sanitizer: DomSanitizer,
              private websocket: WebsocketService) {

  }

  ngOnInit(): void {
    this.id = sessionStorage.getItem('user_id')!;
    console.log(sessionStorage);

    const websocket = this.websocket.connect(this.id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.body.length > 0) {
        if (message.type === 'portrait') {
          const parsed = JSON.parse(message.body);
          this.portrait = this.getSanitizedURL(parsed.portrait);
        }
      }
    });
    const message: Message = new Message('character', 'portrait', '', 0, this.charId, 'portrait');
    this.sendMessage(message);
  }

  private sendMessage(message: Message): void {
    this.websocket.sendMessage(message);
  }

  onFileChanged(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.getBase64(file).then((data: any) => {
        const message: Message = new Message('character', 'portrait', '', 0, this.charId, data);
        this.sendMessage(message);
        this.edit = !this.edit;
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

  getSanitizedURL(raw: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(raw);
  }

  ngOnDestroy() {
    this.destroyed.next(1);
  }
}
