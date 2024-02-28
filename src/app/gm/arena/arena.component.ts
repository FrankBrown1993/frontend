import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Vec2} from "../../_classes/kampf/vec2";
import {Entity} from "../../_classes/kampf/entity";
import {Subject} from "rxjs";
import {Stage} from "../../_classes/canvas/stage";
import {WebsocketService} from "../../_services/websocket.service";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";
import {Fighter} from "../../_classes/comm/payload/fighter";
import {Control} from "../../_classes/canvas/control";
import {RadMenu} from "../../_classes/kampf/rad-menu";

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.sass']
})
export class ArenaComponent implements OnInit, OnDestroy {
  /** Websocket */
  destroyed = new Subject();

  /** Canvas */
  stage: Stage = new Stage();
  control: Control = new Control();

  fighters: Fighter[] = [];

  // selectedEntity: Entity | null = null;

  /* 0: standard
  *  1: move entity
  *  2: rotate entity
  */
  mode: number = 0;

  constructor(private websocket: WebsocketService) {
    this.stage.control = this.control;
    this.control.stage = this.stage;
  }

  ngOnDestroy(): void {
    this.destroyed.next(0);
  }

  ngOnInit(): void {

    const id: string = sessionStorage.getItem('user_id')!;
    console.log('get id from session', id);
    console.log(sessionStorage);

    const websocket = this.websocket.connect(id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.type === 'arena_player_characters' && message.body.length > 0) {
        this.fighters = [];
        const raw: Fighter[] = JSON.parse(message.body);
        console.log(raw);
        raw.forEach(f => {
          const fighter: Fighter = new Fighter();
          fighter.copy(f);
          this.fighters.push(fighter);
        });
        console.log(this.fighters);
      } else if (message.type === 'arena_fighters' && message.body.length > 0) {
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
    const posRadMenu = this.createPositionRadMenu();
    const otherRadMenu = this.createOtherRadMenu();
    const initiateMsg: Message = new Message("fight", "arena_player_characters", "", 0 ,5,"");
    this.sendMessage(initiateMsg);
    const getFightersMsg: Message = new Message("fight", "arena_fighters", "", 2 ,5,"");
    this.sendMessage(getFightersMsg);
    posRadMenu.eventEmitter.subscribe(data => {
      if (data === 1) {
        // translate
        this.mode = 1;
        if (this.stage.entityOfRadMenu != null) {
          this.stage.entityOfRadMenu.mode = 1;
          this.stage.entityToManipuilate = this.stage.entityOfRadMenu;
        }
        this.stage.mode = 1;
      } else if (data === 2) {
        // rotate
        this.mode = 2;
        if (this.stage.entityOfRadMenu != null) {
          this.stage.entityOfRadMenu.mode = 2;
          this.stage.entityToManipuilate = this.stage.entityOfRadMenu;
        }
        this.stage.mode = 2;
      } else if (data === 3) {
        const id = this.stage.entityOfRadMenu?.fighter.id;
        const removeCharMsg: Message = new Message("fight", "arena_fighters", "", 3 ,5,id + '');
        this.sendMessage(removeCharMsg);
        const getAvailableCharsMsg: Message = new Message("fight", "arena_player_characters", "", 0 ,5,"");
        this.sendMessage(getAvailableCharsMsg);
      }
    });
    otherRadMenu.eventEmitter.subscribe(data => {

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

  public onTouch(event: TouchEvent): void {
    this.stage.touchEventBuffer.push(event);
  }

  public onTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.stage.control.touchCount = event.touches.length;
    this.stage.control.kindOfTouch = this.stage.control.touchCount;
    this.stage.touchIds = [];
    for (let i = 0; i < event.touches.length; i++) {
      this.stage.touchIds.push(event.touches.item(i)!.identifier);
    }
    if (this.stage.control.touchCount == 1) {
      this.startOneFingerTouch(event);
    } else if (this.stage.control.touchCount == 2) {
      this.stage.control.startTwoFingerTouch(event);
    }
  }

  private startOneFingerTouch(event: TouchEvent): void {
    this.stage.eventType = 1;
    const touch: Touch = event.touches[0];
    const touchPos: Vec2 = new Vec2(touch.clientX, touch.clientY);
    this.stage.mousePos = touchPos;

    this.stage.entityOfRadMenu = this.stage.getNearestObjectWithinReach(30, touchPos);

    if (this.stage.entityOfRadMenu != null) {
      const position = this.stage.convertRealToCanvas(this.stage.getCenterOfObject(this.stage.entityOfRadMenu));
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
    event.preventDefault();
    this.stage.touchIds = [];
    // this.stage.eventType = -1;
    this.stage.eventType = 0;
    this.control.onTouchEnd(event);
    this.endEvent();
  }

  //@HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
    this.stage.wheelEventBuffer.push(event);
    /*this.stage.testFunction(this.testFunc, this.stage);
    this.control.onWheel(event);*/

  }

  onMouse(event: MouseEvent): void {
    event.preventDefault();
    // keine Maus-Events ohne Drücken einer Taste
    if (event.buttons > 0 || event.type === 'mouseup' ) {
      this.stage.mouseEventBuffer.push(event);
    }
  }

  onMouseDown(event: MouseEvent) {
    console.log('onMouseDown')
    event.preventDefault();
    this.stage.mousePos = new Vec2(event.x, event.y);
    this.stage.mouseButton = event.button;
    // console.log(event);
    if (event.button === 0) { // left mouse click
      this.stage.eventType = 1;
      this.stage.control.leftPressed = true;
      const touchPos: Vec2 = new Vec2(event.x, event.y);
      this.stage.entityOfRadMenu = this.stage.getNearestObjectWithinReach(30, touchPos);
      console.log(this.stage.entityOfRadMenu);
      if (this.stage.entityOfRadMenu != null) {
        const position = this.stage.convertRealToCanvas(this.stage.getCenterOfObject(this.stage.entityOfRadMenu));
        this.stage.radIndex = 0;
        // this.stage.mode = 0;
        this.stage.positionRadMenu(position);
      } else {
        this.stage.radIndex = 1;
        this.stage.positionRadMenu(touchPos);
      }

    } else if (event.button === 1) { // middle mouse click
      this.stage.eventType = 0;
      this.stage.closeRadMenu();
      this.stage.control.middlePressed = true;
      this.stage.control.mousePos = new Vec2(event.x, event.y);
    }
  }

  onMouseMove(event: MouseEvent) {
    this.control.onMouseMove(event);
  }

  onMouseUp(event: MouseEvent) {
    this.control.onMouseUp(event);
    // this.stage.eventType = -1;
    this.stage.eventType = 0;
    this.stage.mouseButton = -1;
    this.stage.mouseEventBuffer = [];
    this.endEvent();
  }

  endEvent() {
    const obj: Entity | null = this.stage.entityToManipuilate;
    if (obj != null && obj.manipulation !== 0) {
      if (obj.manipulation === 1) {
        const translate: Vec2 = obj.ref.substract(obj.drawPosition);
        translate.divideBy(this.stage.zoomfactor);
        obj.position.addOtherToSelf(translate);
      }
      obj.mode = 0;
      obj.ref = new Vec2(0, 0);
      obj.manipulation = 0;
      this.stage.entityToManipuilate = null;
      this.stage.mode = 0;
    }
  }

  draggedFighter: Fighter | null;
  onDragStart(event: DragEvent, fighter: Fighter) {
    this.draggedFighter = fighter;
    console.log(event);
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    if (this.draggedFighter != null) {
      event.preventDefault();
      const touchPos: Vec2 = new Vec2(event.x, event.y);
      const rect: DOMRect = this.stage.canvas.getBoundingClientRect();
      const cPos = new Vec2(rect.x, rect.y);
      const posOnCanvas = touchPos.substract(cPos);
      console.log(event);
      const tkn_fighter: HTMLImageElement = new Image(50,50);
      tkn_fighter.src = this.draggedFighter.token;
      tkn_fighter.width = 50;
      tkn_fighter.height = 50;

      const widthScaled: number = (tkn_fighter.width * this.stage.zoomfactor) / 2;

      const pos: Vec2 = new Vec2(posOnCanvas.x - widthScaled,posOnCanvas.y - widthScaled);
      const canvasCenter: Vec2 = new Vec2(this.stage.mX, this.stage.mY);
      const translate: Vec2 = new Vec2(this.stage.tX, this.stage.tY);

      const centerToPos: Vec2 = pos.substract(canvasCenter)
      centerToPos.divideBy(this.stage.zoomfactor);
      const centerToPosTranslated: Vec2 = centerToPos.substract(translate);

      const newPos: Vec2 = canvasCenter.add(centerToPosTranslated);

      const entity: Entity = new Entity(
        Math.round(newPos.x),
        Math.round(newPos.y),
        50, '',
        this.draggedFighter, 16, 12, tkn_fighter);
      this.stage.initiateObject(entity);
      const message: Message = new Message("fight", "arena_fighters" ,"" ,1 ,0,
        this.draggedFighter.id + "#" + newPos.x + "#" + newPos.y + "#" + 0);
      this.sendMessage(message);
      this.draggedFighter = null;
      const initiateMsg: Message = new Message("fight", "arena_player_characters", "", 0 ,5,"");
      this.sendMessage(initiateMsg);
    }
  }

  public createPositionRadMenu(): RadMenu {
    const cancelImage: HTMLImageElement = document.getElementById('icon_x') as HTMLImageElement;
    const rotate: HTMLImageElement = document.getElementById('icon_rotate') as HTMLImageElement;
    const translate: HTMLImageElement = document.getElementById('icon_translate') as HTMLImageElement;
    const cross: HTMLImageElement = document.getElementById('icon_cross') as HTMLImageElement;
    const images: HTMLImageElement[] = [];
    images.push(translate);
    images.push(rotate);
    images.push(cross);
    const names = ['bewegen', 'rotieren', 'entfernen'];
    const radMenu: RadMenu = new RadMenu();
    radMenu.initializeNew(images, cancelImage, names);
    this.stage.radMenus.push(radMenu);
    return radMenu;
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
