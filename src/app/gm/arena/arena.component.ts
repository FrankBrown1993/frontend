import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Vec2} from "../../_classes/kampf/vec2";
import {Entity} from "../../_classes/kampf/entity";
import {Subject} from "rxjs";
import {Stage} from "../../_classes/canvas/stage";
import {WebsocketService} from "../../_services/websocket.service";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";
import {Fighter} from "../../_classes/comm/payload/fighter";

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.sass']
})
export class ArenaComponent implements OnInit, OnDestroy {
  id = 'id_test';

  /** Websocket */
  destroyed = new Subject();

  /** Canvas */
  stage: Stage = new Stage();

  fighters: Fighter[] = [];

  constructor(private websocket: WebsocketService) {
  }

  ngOnDestroy(): void {
    this.destroyed.next(0);
  }

  ngOnInit(): void {
    const websocket = this.websocket.connect(this.id).pipe(
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
          const entity = new Entity(f.posX, f.posY, 50, '', fighter, 0, 0);
          this.stage.objects.push(entity);
        });
        this.stage.refreshCanvas();
      }
      console.log(message);
    });

    addEventListener("resize", (event) => {
      this.stage.sizeCanvas(window.innerWidth);
      this.stage.refreshCanvas();
    });
    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    this.initiateCanvas();
    const initiateMsg: Message = new Message("fight", "arena_player_characters", "", 0 ,5,"");
    this.sendMessage(initiateMsg);
    const getFightersMsg: Message = new Message("fight", "arena_fighters", "", 2 ,5,"");
    this.sendMessage(getFightersMsg);
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
        const closeImage: HTMLImageElement = document.getElementById('icon_x') as HTMLImageElement;
        // this.stage.radMenu.setCancelImage(closeImage);
        this.createNewRadMenu();
        this.stage.refreshCanvas();
      }
    }
  }

  touchCount = 0;
  pos: Vec2 = new Vec2(0,0);
  initialLength: number = 0;

  public onTouchStart(event: TouchEvent) {
    this.touchCount = event.touches.length;
    event.preventDefault();
    if (this.touchCount == 1) {
      this.startOneFingerTouch(event);
    } else if (this.touchCount == 2) {
      this.startTwoFingerTouch(event);
    }
  }

  onTouchMove(event: TouchEvent) {
    this.touchCount = event.touches.length;
    if (this.touchCount == 1) {
      this.moveOneFingerTouch(event);
    } else if (this.touchCount == 2) {
      this.moveTwoFingerTouch(event);
    }
  }

  onTouchEnd(event: TouchEvent) {
    this.touchCount = 0;
    this.stage.closeRadMenu();
    this.stage.refreshCanvas();
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    this.stage.closeRadMenu();
    event.preventDefault();
    console.log(event.deltaY);
    this.stage.zoomMouse(event.deltaY);
  }

  mousePos: Vec2 = new Vec2(0, 0);
  leftPressed = false;
  middlePressed = false;
  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    console.log(event);
    if (event.button === 0) { // left mouse click
      this.leftPressed = true;
      const touchPos: Vec2 = new Vec2(event.x, event.y);
      const obj: Entity | null = this.stage.getNearestObjectWithinReach(30, touchPos);
      if (obj != null) {
        const position = this.stage.convertObjectPositionToCanvasPosition(this.stage.getCenterOfObject(obj));
        this.stage.positionRadMenu(position);
      } else {
        this.stage.positionRadMenu(touchPos);
      }

    } else if (event.button === 1) { // middle mouse click
      this.stage.closeRadMenu();
      this.middlePressed = true;
      this.mousePos = new Vec2(event.x, event.y);
    }
  }

  onMouseMove(event: MouseEvent) {
    // console.log(event);
    if (this.middlePressed) {
      this.stage.closeRadMenu();
      const newPos: Vec2 = new Vec2(event.x, event.y);
      const delta: Vec2 = newPos.substract(this.mousePos);
      this.mousePos = newPos;
      this.stage.shiftMouse(delta);
    } else if (this.leftPressed){ // left mouse click
      const touchPos: Vec2 = new Vec2(event.x, event.y);
      this.stage.moveTouch(touchPos);
    }
  }

  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.stage.closeRadMenu();
      this.leftPressed = false;
      this.stage.refreshCanvas();
    }
    if (event.button === 1) {
      this.middlePressed = false;
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
      const ptrt_fighter: HTMLImageElement = new Image(50,50);
      ptrt_fighter.src = this.draggedFighter.portrait;
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

      this.stage.objects.push(new Entity(
        newPos.x,
        newPos.y,
        50, '',
        this.draggedFighter, 16, 12));
      this.stage.refreshCanvas();
      const message: Message = new Message("fight", "arena_fighters" ,"" ,1 ,0,
        this.draggedFighter.id + "#" + newPos.x + "#" + newPos.y + "#" + 0);
      this.sendMessage(message);
      this.draggedFighter = null;
      const initiateMsg: Message = new Message("fight", "arena_player_characters", "", 0 ,5,"");
      this.sendMessage(initiateMsg);
    }
  }


  private startOneFingerTouch(event: TouchEvent): void {
    const touch: Touch = event.touches[0];
    const touchPos: Vec2 = new Vec2(touch.clientX, touch.clientY);
    const obj: Entity | null = this.stage.getNearestObjectWithinReach(30, touchPos);
    if (obj != null) {
      const position = this.stage.convertObjectPositionToCanvasPosition(this.stage.getCenterOfObject(obj));
      this.stage.positionRadMenu(position);
    } else {
      this.stage.positionRadMenu(touchPos);
    }
  }

  private moveOneFingerTouch(event: TouchEvent): void {
    const touch: Touch = event.touches[0];
    const touchPos: Vec2 = new Vec2(touch.clientX, touch.clientY);
    this.stage.moveTouch(touchPos);
  }

  private startTwoFingerTouch(event: TouchEvent): void {
    const [avg, fingers] = this.getTouchesAvagePosition(event.touches);
    this.pos = avg;
    this.initialLength = fingers[0].substract(fingers[1]).length();
    this.stage.refreshCanvas();
  }

  private moveTwoFingerTouch(event: TouchEvent): void {
    this.stage.closeRadMenu();
    const [avg, fingers] = this.getTouchesAvagePosition(event.touches);
    const delta: Vec2 = avg.substract(this.pos);
    this.pos = avg;
    const fingerDist: number = fingers[0].substract(fingers[1]).length();
    const ratio = 1 - (this.initialLength / fingerDist);
    this.initialLength = fingerDist;
    this.stage.touchZoomAndShift(delta, ratio);
  }

  private getTouchesAvagePosition(touches: TouchList): [Vec2, Vec2[]] {
    const fingers: Vec2[] = [];
    for (let i = 0; i < touches.length; i++) {
      const item: Touch | null = touches.item(i);
      if (item != null) {
        fingers.push(new Vec2(item.screenX, item.screenY));
      }
    }
    const avg: Vec2 = new Vec2(0, 0);
    fingers.forEach(f => {
      avg.addOtherToSelf(f);
    });
    avg.divideBy(fingers.length);
    return [avg, fingers];
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
    this.stage.radMenu.initializeNew(3, images, cancelImage);
  }
}