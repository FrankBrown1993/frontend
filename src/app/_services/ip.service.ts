import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  constructor() { }

  public getIp(): string {
    return '192.168.178.44';
  }
}
