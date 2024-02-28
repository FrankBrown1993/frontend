import {Injectable, OnDestroy} from '@angular/core';
import {Observable} from "rxjs";
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {IpService} from "./ip.service";
import {Message} from "../_classes/comm/message";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  connection: WebSocketSubject<any>;
  firstConnection: WebSocketSubject<any>;
  constructor(private ipService: IpService) {}

  id: string;

  connect(id: string): Observable<any> {
    this.id = id;
    if (this.connection == null) {
      console.info('[WebsocketService] Connection not yet established. Connect to Websocket.');
      const ip: string = this.ipService.getIp();
      this.connection = webSocket({
        url: 'ws://' + ip + ':8080/ws/' + this.id,
        deserializer: ({data}) => data,
      });
    } else {
      console.info('[WebsocketService] Connection already established.');
    }
    return this.connection;
  }

  connectFirst(id: string): Observable<any> {
    this.id = id;
    if (this.firstConnection == null) {
      console.info('[WebsocketService] Connection not yet established. Connect to Websocket.');
      const ip: string = this.ipService.getIp();
      this.firstConnection = webSocket({
        url: 'ws://' + ip + ':8080/ws/' + this.id,
        deserializer: ({data}) => data,
      });
    } else {
      console.info('[WebsocketService] Connection already established.');
    }
    return this.firstConnection;
  }

  sendMessage(message: Message): void {
    console.log('[WEBSOCKET] sendMessage', message);
    const maxFrameLimit: number = 65536;
    // const maxFrameLimit: number = 50;
    if (this.connection) {
      let msgFrameSize = message.getFrameSize();
      console.log(msgFrameSize);
      if (msgFrameSize >= maxFrameLimit) {
        let seq: number = 0;
        let remainingBody = message.body;
        // let remainingBody = message.body.substr(maxFrameLimit - message.getFrameSizeWithoutBody());
        while (remainingBody.length > 0) {
          let body: string = remainingBody;
          if (remainingBody.length >= maxFrameLimit - message.getFrameSizeWithoutBody()) {
            body = remainingBody.substr(0, maxFrameLimit - message.getFrameSizeWithoutBody());
          } else {
            remainingBody = '';
          }
          const splitMsg: Message = new Message(message.type, message.returnType, message.modifier, message.code, message.charId, body);
          splitMsg.seq = seq;
          if (remainingBody.length >= maxFrameLimit - message.getFrameSizeWithoutBody()) {
            remainingBody = remainingBody.substr(maxFrameLimit - message.getFrameSizeWithoutBody());
          }
          this.connection.next(splitMsg);
          seq++;
        }
        const endMessage: Message = new Message(message.type, message.returnType, message.modifier, message.code, message.charId, '~END~');
        endMessage.seq = seq;
        this.connection.next(endMessage);
      } else {
        this.connection.next(message);
      }

    } else {
      console.error('[WebsocketService] Did not send data, unable to open connection');
    }
  }

  sendMessageFirstConnetion(message: Message): void {
    console.log('[WEBSOCKET] sendMessage', message);
    const maxFrameLimit: number = 65536;
    // const maxFrameLimit: number = 50;
    if (this.firstConnection) {
      let msgFrameSize = message.getFrameSize();
      console.log(msgFrameSize);
      if (msgFrameSize >= maxFrameLimit) {
        let seq: number = 0;
        let remainingBody = message.body;
        // let remainingBody = message.body.substr(maxFrameLimit - message.getFrameSizeWithoutBody());
        while (remainingBody.length > 0) {
          let body: string = remainingBody;
          if (remainingBody.length >= maxFrameLimit - message.getFrameSizeWithoutBody()) {
            body = remainingBody.substr(0, maxFrameLimit - message.getFrameSizeWithoutBody());
          } else {
            remainingBody = '';
          }
          const splitMsg: Message = new Message(message.type, message.returnType, message.modifier, message.code, message.charId, body);
          splitMsg.seq = seq;
          if (remainingBody.length >= maxFrameLimit - message.getFrameSizeWithoutBody()) {
            remainingBody = remainingBody.substr(maxFrameLimit - message.getFrameSizeWithoutBody());
          }
          this.firstConnection.next(splitMsg);
          seq++;
        }
        const endMessage: Message = new Message(message.type, message.returnType, message.modifier, message.code, message.charId, '~END~');
        endMessage.seq = seq;
        this.firstConnection.next(endMessage);
      } else {
        this.firstConnection.next(message);
      }

    } else {
      console.error('[WebsocketService] Did not send data, unable to open firstConnection');
    }
  }

  closeConnection(): void {
    if (this.connection) {
      this.connection.complete();
    }
  }

  closeFirstConnection(): void {
    if (this.firstConnection) {
      this.firstConnection.complete();
    }
  }

  ngOnDestroy(): void {
    this.closeConnection();
  }
}
