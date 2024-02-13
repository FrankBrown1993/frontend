import {Vec2} from "../kampf/vec2";
import {Entity} from "../kampf/entity";
import {Stage} from "./stage";

export class Control {
  stage: Stage;

  touchCount = 0;
  kindOfTouch = 0;
  pos: Vec2 = new Vec2(0,0);
  initialLength: number = 0;

  mousePos: Vec2 = new Vec2(0, 0);
  leftPressed = false;
  middlePressed = false;



  private then: number;
  private startTime: number;
  public apsInterval: number = 1000 / 90; // 60 APS

  constructor() {
    this.then = Date.now();
    this.startTime = this.then;
  }

  private actionAllowed(): boolean {
    let allowed = false;
    const now = Date.now();
    const elapsed = now - this.then;

    if (elapsed > this.apsInterval) {
      this.then = now - (elapsed % this.apsInterval);
      allowed = true;
    }
    return allowed;
  }

  onTouchMove(event: TouchEvent) {
    if (this.actionAllowed()) {
      this.touchCount = event.touches.length;
      if (this.touchCount == 1 && this.kindOfTouch == 1) {
        this.moveOneFingerTouch(event);
      } else if (this.touchCount == 2) {
        this.moveTwoFingerTouch(event);
      }
    }
  }

  onTouchEnd(event: TouchEvent) {
    this.touchCount = 0;
    this.kindOfTouch = 0;
    this.stage.closeRadMenu();
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    if (this.actionAllowed()) {
      this.stage.closeRadMenu();
      console.log(event.deltaY);
      this.stage.zoomMouse(event);
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.actionAllowed()) {
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
  }

  onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      this.stage.closeRadMenu();
      this.leftPressed = false;
      // this.stage.refreshCanvas();
    }
    if (event.button === 1) {
      this.middlePressed = false;
    }
  }

  private moveOneFingerTouch(event: TouchEvent): void {
    const touch: Touch = event.touches[0];
    const touchPos: Vec2 = new Vec2(touch.clientX, touch.clientY);
    this.stage.moveTouch(touchPos);
  }

  public startTwoFingerTouch(event: TouchEvent): void {
    const [avg, fingers] = this.getTouchesAvagePosition(event.touches);
    this.pos = avg;
    this.initialLength = fingers[0].substract(fingers[1]).length();
    // this.stage.refreshCanvas();
  }

  private moveTwoFingerTouch(event: TouchEvent): void {
    this.stage.closeRadMenu();
    const [avg, fingers] = this.getTouchesAvagePosition(event.touches);
    const delta: Vec2 = avg.substract(this.pos);
    this.pos = avg;
    const fingerDist: number = fingers[0].substract(fingers[1]).length();
    const ratio = 1 - (this.initialLength / fingerDist);
    this.initialLength = fingerDist;
    this.stage.touchZoomAndShift(delta, ratio, avg);
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
}
