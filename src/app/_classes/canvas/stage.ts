import {Vec2} from "../kampf/vec2";
import {Entity} from "../kampf/entity";
import {RadMenu} from "../kampf/rad-menu";
import {Control} from "./control";

export class Stage {
  control: Control;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ratio: number;

  fps: number = -1;

  private fpsInterval: number = 1000 / 60; // 60 FPS
  private then: number;
  private startTime: number;


  zoomfactor = 1.0;
  mX = 0; // canvas width center
  mY = 0; // canvas height center
  tX = 0; // overall translation x
  tY = 0; // overall translation y
  canvasPos: Vec2 = new Vec2(0, 0);

  objects: Entity[] = [];

  /** Canvas Menus */
  radMenus: RadMenu[] = [];
  radIndex = 0;


  startAnimation() {
    this.then = Date.now();
    this.startTime = this.then;
    this.animate();
  }

  animate() {
    requestAnimationFrame(() => {
      this.animate();
    });
    const now = Date.now();
    const elapsed = now - this.then;
    this.fps = 1000 / elapsed;
    this.then = now;
    this.draw();
  }

  draw() {
    this.refreshCanvas();
  }

  public initialize(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ratio = this.canvas.width / this.canvas.height;
    // this.initiateObjects();
    console.log(this.objects);
    this.sortEntities();
    console.log(this.objects);
    this.startAnimation();
    // this.refreshCanvas();
  }

  public initiateObject(entity: Entity): void {
    this.objects.push(entity);
    entity.tokenImage.onload = () => {
      // this.refreshCanvas();
    };
  }

  private sortEntities(): void {
    this.objects.sort((a: Entity, b: Entity) => {
      let val = 0;
      if (a.ini > b.ini) {
        val = -1;
      } else if (a.ini < b.ini) {
        val = 1;
      } else {
        if (a.iniBasis > b.iniBasis) {
          val = -1;
        } else if(a.iniBasis < b.iniBasis) {
          val = 1;
        } else {
          val = 0;
        }
      }
      return val;
    });
  }

  public sizeCanvas(innerWidth: number): void {
    console.log("resize canvas", innerWidth);
    if (innerWidth <= 1024) {
      this.canvas.width = Math.round((innerWidth) / 2) * 2;
      this.canvas.height = Math.round((innerWidth * 0.5) / 2) * 2;
      this.mX = this.canvas.width / 2;
      this.mY = this.canvas.height / 2;
    } else {
      this.canvas.width = Math.round((1024) / 2) * 2;
      this.canvas.height = Math.round((1024 * 0.5) / 2) * 2;
      this.mX = this.canvas.width / 2;
      this.mY = this.canvas.height / 2;
    }
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    this.canvasPos = new Vec2(rect.x, rect.y);
  }

  public clearCanvas(): void {
    if (this.ctx != null && this.canvas != null) {
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(0, 0, this.canvas.width , this.canvas.height);
    }
  }

  public refreshCanvas(): void {
    this.clearCanvas();

    this.objects.forEach(o => {
      this.drawObject(o);
    });
    this.radMenus.forEach(radMenu => {
      if (radMenu.open) {
        this.drawRadMenu(radMenu);
      }
    });

  }

  private drawObject(o: Entity): void {
    if (this.canvas != null && this.ctx != null) {

      const [widthScaled, posXNew, posYNew] = this.getObjectCoordinates(o);

      if (o.fighter != null) {
        const tokenImage: HTMLImageElement = new Image(o.width, o.width);
        tokenImage.src = o.fighter.token;
        this.ctx.drawImage(tokenImage, posXNew - widthScaled / 2, posYNew - widthScaled / 2, widthScaled, widthScaled)
      } else {
        this.ctx.fillStyle = o.color;
        this.ctx.fillRect(posXNew - widthScaled / 2, posYNew - widthScaled / 2, widthScaled, widthScaled);
      }

      this.ctx.font = "16px \"Aladin\", cursive"
      let txtWidth = this.ctx.measureText(o.fighter.name).width;
      this.ctx.textBaseline = "hanging";
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(o.fighter.name,posXNew  - txtWidth / 2, posYNew + widthScaled / 2);
    }
  }

  private getObjectCoordinates(o: Entity): [number, number, number] {
    const width = o.width;
    const posX = o.position.x + width / 2 - this.mX + this.tX;
    const posY = o.position.y + width / 2 - this.mY + this.tY;

    const widthScaled = width * this.zoomfactor;
    const posXScaled = posX * this.zoomfactor;
    const posYScaled = posY * this.zoomfactor;

    const posXNew = posXScaled + this.mX;
    const posYNew = posYScaled + this.mY;
    return [
      widthScaled,
      posXNew,
      posYNew
    ]
  }

  private drawRadMenu(radMenu: RadMenu): void {
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = radMenu.lineColor;
    // inner circle
    this.ctx.beginPath();
    this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius / 3, 0, 2 * Math.PI);
    this.ctx.stroke();
    const segmentRad = 2 * Math.PI / radMenu.segments;
    if (radMenu.selectedSegment > 0) {
      const startAngle = Math.PI * 1.5 - segmentRad / 2 + (segmentRad * radMenu.selectedSegment);
      const endAngle = startAngle + (segmentRad * (radMenu.segments - 1));
      // unselected cirle
      this.ctx.beginPath();
      this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius,
        startAngle,
        endAngle);
      this.ctx.stroke();

      // selected circle
      this.ctx.beginPath();
      this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius * 1.25,
        endAngle,
        endAngle + segmentRad);
      this.ctx.stroke();

      // fill unselected area
      this.ctx.beginPath();
      this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius / 3,
        startAngle,
        endAngle);
      this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius,
        endAngle,
        startAngle,
        true);
      this.ctx.fillStyle = radMenu.fillColor; // Farbe für den Kreisring
      this.ctx.fill();

      // fill selected area
      this.ctx.beginPath();
      this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius / 3,
        endAngle,
        startAngle);
      this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius * 1.25,
        startAngle,
        endAngle,
        true);
      this.ctx.fillStyle = radMenu.fillColor; // Farbe für den Kreisring
      this.ctx.fill();
      this.ctx.drawImage(radMenu.cancelImage,
        radMenu.pos.x - (radMenu.cancelImage.width) / 2,
        radMenu.pos.y - (radMenu.cancelImage.height) / 2,
        radMenu.cancelImage.width,
        radMenu.cancelImage.height);
    } else {
      this.ctx.beginPath();
      this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius, 0, 2 * Math.PI);
      this.ctx.stroke();

      // fill
      this.ctx.beginPath();
      this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius / 3, 0, 2 * Math.PI);
      this.ctx.arc(radMenu.pos.x, radMenu.pos.y, radMenu.radius,0, 2 * Math.PI, true);
      this.ctx.fillStyle = radMenu.fillColor; // Farbe für den Kreisring
      this.ctx.fill();
      this.ctx.drawImage(radMenu.cancelImage,
        radMenu.pos.x - (radMenu.cancelImage.width * 1.25) / 2,
        radMenu.pos.y - (radMenu.cancelImage.height * 1.25) / 2,
        radMenu.cancelImage.width * 1.25,
        radMenu.cancelImage.height * 1.25);
    }

    // draw straight lines
    let i: number = 0;
    radMenu.segmentBorderVectors.forEach(vec => {
      let mult = 1;
      if (i === radMenu.selectedSegment
          || i + 1 === radMenu.selectedSegment
          || (i === 0 && radMenu.selectedSegment === radMenu.segments)) {
        mult = 1.25;
      }
      if (radMenu.selectedSegment === 0) {
        mult = 1;
      }
      this.ctx.beginPath(); // Start a new path
      this.ctx.moveTo(
        radMenu.pos.x + vec.x * radMenu.radius / 3,
        radMenu.pos.y + vec.y * radMenu.radius / 3);
      i++;
      this.ctx.lineTo(
        radMenu.pos.x + vec.x * radMenu.radius * mult,
        radMenu.pos.y + vec.y * radMenu.radius * mult); // Draw a line to (150, 100)
      this.ctx.stroke(); // Render the path
    });

    i = 0;
    // draw icons
    radMenu.segmentMiddleVectors.forEach(vec => {
      let mult = 1;
      if (radMenu.selectedSegment - 1 === i) {
        mult = 1.25;
      }

      /*
        this.radMenu.pos.x - (this.radMenu.cancelImage.width * 1.25) / 2,
        this.radMenu.pos.y - (this.radMenu.cancelImage.height * 1.25) / 2,
       */
      const scaledVec: Vec2 = vec.multiply(radMenu.radius * (2/3) * mult);
      const position: Vec2 = radMenu.pos.add(scaledVec);
      this.ctx.drawImage(radMenu.segmentIcons[i],
        position.x - radMenu.segmentIcons[i].width * mult / 2,
        position.y - radMenu.segmentIcons[i].height * mult / 2,
        radMenu.segmentIcons[i].width * mult,
        radMenu.segmentIcons[i].height * mult);
      i++;
    });
    if (radMenu.selectedSegment > 0) {
      const text: string = radMenu.segmentNames[radMenu.selectedSegment - 1];
      if (text != null) {
        this.ctx.font = "16px \"Aladin\", cursive"
        let txtWidth = this.ctx.measureText(text).width;
        this.ctx.textBaseline = "hanging";
        this.ctx.fillStyle = 'black';
        const vec: Vec2 = new Vec2(0, 0);
        vec.copy(radMenu.segmentMiddleVectors[radMenu.selectedSegment - 1]);
        const scaledVec = vec.multiply(radMenu.radius * 1.5);

        const position: Vec2 = radMenu.pos.add(scaledVec);
        this.ctx.fillText(text,position.x - txtWidth / 2, position.y);
      }
    }
  }

  public closeRadMenu(): void {
    this.radMenus[this.radIndex];
    this.radMenus[this.radIndex].close();
    this.radIndex = 0;
  }

  public zoomMouse(event: WheelEvent) {
    const touchPos: Vec2 = new Vec2(event.x, event.y);
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const cCenter = new Vec2(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const posOnCanvas = touchPos.substract(cPos);

    const deltaY = event.deltaY;

    let delta  = 0;
    // just zoom
    if (deltaY < 0) {
      delta = (deltaY / 1000) * this.zoomfactor;
    } else {
      delta = (deltaY / 1000) * (this.zoomfactor - (deltaY / 1000)) ;
    }
    console.log('zoomfactor:',this.zoomfactor,'delta:', delta)
    this.zoomfactor -= delta;
    if (this.zoomfactor < 0.25) {
      let diff = 0.25 - this.zoomfactor;
      delta -= diff;
      this.zoomfactor = 0.25;
    }
    if (this.zoomfactor > 4) {
      let diff = this.zoomfactor - 4;
      delta += diff;
      this.zoomfactor = 4;
    }
    if (delta != 0) {
      const posFromCenter: Vec2 = posOnCanvas.substract(cCenter);
      const posFromCenterScaled: Vec2 = posFromCenter.multiply(1 + delta);
      const translate: Vec2 = posFromCenter.substract(posFromCenterScaled);
      this.tX -= translate.x / this.zoomfactor;
      this.tY -= translate.y / this.zoomfactor;
    }
  }

  public shiftMouse(delta: Vec2) {
    this.tX += (delta.x / this.zoomfactor);
    this.tY += (delta.y / this.zoomfactor);
  }

  public touchZoomAndShift(deltaVec: Vec2, ratio: number, pos: Vec2): void {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const cCenter = new Vec2(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const posOnCanvas = pos.substract(cPos);

    this.tX += (deltaVec.x / this.zoomfactor);
    this.tY += (deltaVec.y / this.zoomfactor);


    let delta = (ratio * this.zoomfactor);
    this.zoomfactor += delta;
    if (this.zoomfactor < 0.25) {
      let diff = 0.25 - this.zoomfactor;
      delta -= diff;
      this.zoomfactor = 0.25;
    }
    if (this.zoomfactor > 4) {
      let diff = this.zoomfactor - 4;
      delta += diff;
      this.zoomfactor = 4;
    }
    // TodO
    /*if (delta != 0) {
      const posFromCenter: Vec2 = posOnCanvas.substract(cCenter);
      const posFromCenterScaled: Vec2 = posFromCenter.multiply(1 + delta);
      const translate: Vec2 = posFromCenter.substract(posFromCenterScaled);
      this.tX += translate.x / this.zoomfactor;
      this.tY += translate.y / this.zoomfactor;
    }*/
  }

  public positionRadMenu(touchPos: Vec2): void {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const posOnCanvas = touchPos.substract(cPos);
    this.radMenus[this.radIndex].pos = posOnCanvas;
    this.radMenus[this.radIndex].startTimer();
    // this.refreshCanvas();
  }



  public moveTouch(touchPos: Vec2): void {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const posOnCanvas = touchPos.substract(cPos);
    this.radMenus[this.radIndex].selectSegment(posOnCanvas);
    this.radMenus[this.radIndex].openIfLongEnough();
    // this.refreshCanvas();
  }

  public getNearestObjectWithinReach(reach: number, posRaw: Vec2): Entity | null {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const position = posRaw.substract(cPos);
    let obj: Entity | null = null;
    let minDist = Number.MAX_VALUE;
    this.objects.forEach(o => {
      const oPos: Vec2 = o.getCenter(this.zoomfactor, new Vec2(this.mX, this.mY), new Vec2(this.tX, this.tY));
      // console.log('compare: ', position.x, ', ',position.y, ' with ',oPos.x, ', ', oPos.y);
      const distVec: Vec2 = oPos.substract(position);
      const distance: number = distVec.length();
      if (distance <= reach && minDist >= distance) {
        minDist = distance;
        obj = o;
      }
    });
    return obj;
  }

  public getCenterOfObject(obj: Entity): Vec2 {
    return obj.getCenter(this.zoomfactor, new Vec2(this.mX, this.mY), new Vec2(this.tX, this.tY));
  }

  public convertObjectPositionToCanvasPosition(oPos: Vec2): Vec2 {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const position = oPos.add(cPos);
    return position;
  }

  public testFunction(func: (stage: Stage) => void, stage: Stage): void {
    func(stage);
  }
}
