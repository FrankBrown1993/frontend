import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketService} from "../_services/websocket.service";
import {fromEvent, Observable, Subject, Subscription} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {BooleanEvent} from "../_interfaces/events/boolean-event";
import {Message} from "../_classes/comm/message";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit, OnDestroy {
  /** Websocket */
  destroyed = new Subject();


  id = 'id_test';

  /** other */
  nav = 1;
  userDevice: string = '';
  viewport: string = '';
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  constructor(private websocket: WebsocketService,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const websocket = this.websocket.connect(this.id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      console.log(message);
    });

    const userAgent: string = navigator.userAgent || navigator.vendor;
    const isMobileDevice = (): boolean => {
      const regexs = [/(Android)(.+)(Mobile)/i, /BlackBerry/i, /iPhone|iPod/i, /Opera Mini/i, /IEMobile/i]
      return regexs.some((b) => userAgent.match(b))
    }
    const isTabletDevice = (): boolean => {
      const regex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/
      return regex.test(userAgent.toLowerCase())
    }
    const isDesktopDevice = (): boolean => !isMobileDevice() && !isTabletDevice()
    if (isMobileDevice()) {
      this.userDevice = 'mobile';
    } else if (isTabletDevice()) {
      this.userDevice = 'tablet';
    } else if (isDesktopDevice()){
      this.userDevice = 'desktop';
    }
    if (window.outerHeight  >= window.outerWidth) {
      this.viewport = 'portrait';
    } else {
      this.viewport = 'landscape';
    }

    /*
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      this.resizeWindow();
    })
    */
  }

  ngOnDestroy() {
    this.destroyed.next(1);
    this.resizeSubscription$.unsubscribe();
  }

  /*resizeWindow(): void {
    const height = window.innerHeight;
    const width = height * 564/752;
    // document.getElementById('background')!.style.height = height + 'px';
    // document.getElementById('background')!.style.width = width + 'px';
  }*/

  changeNav(newNav: number): void {
    this.nav = newNav;
  }

  public login(event: BooleanEvent): void {
    if (event.value) {
      // alert('logged in!')

    } else {
      this.nav = 0;
    }
  }

  onFileChanged(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.getBase64(file).then((data: string) => {
        const message: Message = new Message('file', 'file', '', 0, -1, data);
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
