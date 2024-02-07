import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor() { }

  public getIp(): string {
    // mac: *.32
    // jan pc: *.44
    // may pc: *.20
    return '192.168.178.44';
  }
}
