import {AfterContentInit, AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "../../../_services/websocket.service";
import {Message} from "../../../_classes/comm/message";
import {takeUntil} from "rxjs/operators";
import {BlattAllgemein} from "../../../_classes/comm/payload/blatt-allgemein";
import {Entity} from "../../../_classes/kampf/entity";
import {Vec2} from "../../../_classes/kampf/vec2";
import {RadMenu} from "../../../_classes/kampf/rad-menu";
import {Stage} from "../../../_classes/canvas/stage";
import {Control} from "../../../_classes/canvas/control";
import {Fighter} from "../../../_classes/comm/payload/fighter";

@Component({
  selector: 'app-kampf',
  templateUrl: './kampf.component.html',
  styleUrls: ['./kampf.component.sass']
})
export class KampfComponent implements OnInit, OnDestroy  {
  id = 'id_test';
  charId = 5;

  /** Websocket */
  destroyed = new Subject();

  /** Canvas */
  stage: Stage = new Stage();
  control: Control = new Control();

  fighters: Fighter[] = [];


  constructor(private websocket: WebsocketService) {
    this.stage.control = this.control;
    this.control.stage = this.stage;
  }

  ngOnDestroy(): void {
    this.destroyed.next(0);
  }

  ngOnInit(): void {
    this.id = sessionStorage.getItem('user_id')!;
    console.log(sessionStorage);

    const websocket = this.websocket.connect(this.id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.type === 'arena_fighters' && message.body.length > 0) {
        this.stage.objects = [];
        console.log(JSON.parse(message.body));
        const fighters: any[] = JSON.parse(message.body);
        fighters.forEach(f => {
          const fighter: Fighter = new Fighter();
          fighter.id = f.id;
          fighter.name = f.name;
          fighter.token = f.token;
          fighter.portrait = f.portrait;

          const tkn_fighter: HTMLImageElement = new Image(50,50);
          tkn_fighter.src = fighter.token;
          tkn_fighter.width = 50;
          tkn_fighter.height = 50;

          const entity = new Entity(f.posX, f.posY, 50, '', fighter, 0, 0, tkn_fighter);
          this.stage.initiateObject(entity);
        });
        // this.stage.refreshCanvas();
      }
      console.log(message);
    });

    addEventListener("resize", (event) => {
      this.stage.sizeCanvas(window.innerWidth);
      // this.stage.refreshCanvas();
    });
    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    this.initiateCanvas();

    const otherRadMenu = this.createOtherRadMenu();
    const getFightersMsg: Message = new Message("fight", "arena_fighters", "", 2 ,5,"");
    this.sendMessage(getFightersMsg);
    otherRadMenu.eventEmitter.subscribe(data => {
      console.log('otherRadMenu:',data);
    });
  }

  private sendMessage(message: Message): void {
    this.websocket.sendMessage(message);
  }




  private initiateCanvas(): void {
    console.info('initialize canvas:')
    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    if (canvas != null) {
      console.info('canvas is not null CHECK')
      const ctx = canvas.getContext('2d');
      if (ctx != null) {
        console.info('context is not null CHECK')
        this.stage.initialize(canvas, ctx);
        this.stage.sizeCanvas(window.innerWidth);
      }
    }
  }

  public onTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.stage.control.touchCount = event.touches.length;
    this.stage.control.kindOfTouch = this.stage.control.touchCount;
    if (this.stage.control.touchCount == 1) {
      this.startOneFingerTouch(event);
    } else if (this.stage.control.touchCount == 2) {
      this.stage.control.startTwoFingerTouch(event);
    }
  }

  public onTouch(event: TouchEvent): void {
    this.stage.touchEventBuffer.push(event);
  }

  private startOneFingerTouch(event: TouchEvent): void {
    const touch: Touch = event.touches[0];
    const touchPos: Vec2 = new Vec2(touch.clientX, touch.clientY);
    const obj: Entity | null = this.stage.getNearestObjectWithinReach(30, touchPos);
    if (obj != null) {
      const position = this.stage.convertRealToCanvas(this.stage.getCenterOfObject(obj));
      this.stage.radIndex = 0;
      this.stage.positionRadMenu(position);
    } else {
      this.stage.radIndex = 1;
      this.stage.positionRadMenu(touchPos);
    }
  }

  onTouchMove(event: TouchEvent) {
    this.control.onTouchMove(event);
  }

  onTouchEnd(event: TouchEvent) {
    this.control.onTouchEnd(event);
  }

  // @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    this.control.onWheel(event);
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    console.log(event);
    if (event.button === 0) { // left mouse click
      this.stage.control.leftPressed = true;
      const touchPos: Vec2 = new Vec2(event.x, event.y);
      const obj: Entity | null = this.stage.getNearestObjectWithinReach(30, touchPos);
      if (obj != null) {
        const position = this.stage.convertRealToCanvas(this.stage.getCenterOfObject(obj));
        this.stage.radIndex = 0;
        this.stage.positionRadMenu(position);
      } else {
        this.stage.radIndex = 0;
        this.stage.positionRadMenu(touchPos);
      }

    } else if (event.button === 1) { // middle mouse click
      this.stage.closeRadMenu();
      this.stage.control.middlePressed = true;
      this.stage.control.mousePos = new Vec2(event.x, event.y);
    }
  }

  onMouse(event: MouseEvent): void {
    event.preventDefault();
    // keine Maus-Events ohne Drücken einer Taste
    if (event.buttons > 0 || event.type === 'mouseup' ) {
      this.stage.mouseEventBuffer.push(event);
    }
  }

  onMouseMove(event: MouseEvent) {
    this.control.onMouseMove(event);
  }

  onMouseUp(event: MouseEvent) {
    this.control.onMouseUp(event);
  }

  public createNewRadMenu(): void {
    const cancelImage: HTMLImageElement = document.getElementById('icon_x') as HTMLImageElement;
    const swordImage: HTMLImageElement = document.getElementById('icon_sword') as HTMLImageElement;
    const bowImage: HTMLImageElement = document.getElementById('icon_bow') as HTMLImageElement;
    const mapImage: HTMLImageElement = document.getElementById('icon_map') as HTMLImageElement;
    const images: HTMLImageElement[] = [];
    images.push(swordImage);
    images.push(bowImage);
    images.push(mapImage);
    this.stage.radMenus[0].initializeNew(images, cancelImage);
  }

  public createOtherRadMenu(): RadMenu {
    const cancelImage: HTMLImageElement = document.getElementById('icon_x') as HTMLImageElement;
    const swordImage: HTMLImageElement = document.getElementById('icon_sword') as HTMLImageElement;
    const bowImage: HTMLImageElement = document.getElementById('icon_bow') as HTMLImageElement;
    const mapImage: HTMLImageElement = document.getElementById('icon_map') as HTMLImageElement;
    const images: HTMLImageElement[] = [];
    images.push(swordImage);
    images.push(bowImage);
    images.push(mapImage);
    const radMenu: RadMenu = new RadMenu();
    radMenu.initializeNew(images, cancelImage);
    this.stage.radMenus.push(radMenu);
    return radMenu;
  }
}
