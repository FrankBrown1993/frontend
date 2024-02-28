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

  maxZoom: number = 4;
  minZoom: number = 0.25;

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

  /** universal settings */
  entityOfRadMenu: Entity | null = null;
  entityToManipuilate: Entity | null = null;

  modeName: string = 'default';
  /*
   * 1: move
   * 2: rotate
   */
  mode: number = 0;

  public touchEventBuffer: TouchEvent[] = [];
  public wheelEventBuffer: WheelEvent[] = [];
  public zoomPosition: Vec2 = new Vec2(0, 0);
  public zoomTranslate: Vec2 = new Vec2(0, 0);
  public mouseEventBuffer: MouseEvent[] = [];
  public mousePos: Vec2 = new Vec2(0, 0);
  public mouseButton: number = -1;
  public touchIds: number[] = [];

  /*
   * 0: middle mouse / two fingers  -> pan
   * 1: left click / one finger     -> radMenu
   */
  public eventType: number = 0;
  public eventPos: Vec2 = new Vec2(0,0);


  startAnimation() {
    this.then = Date.now();
    this.startTime = this.then;
    this.animate();
  }

  //Guten Tag Mr. Stinkemann heftig
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

  private getWheelEvents(): [Vec2, number] {
    let deltaY: number = 0;
    const count = this.wheelEventBuffer.length;
    let pos: Vec2 = this.zoomPosition.makeCopy();
    if (count > 0) {
      const event: WheelEvent = this.wheelEventBuffer.pop()!;
      this.wheelEventBuffer = [];
      deltaY += event.deltaY;
      const wheelPos: Vec2 = new Vec2(event.x, event.y);
      const center: Vec2 = this.zoomPosition.makeCopy();
      const rect: DOMRect = this.canvas.getBoundingClientRect();
      const cPos = new Vec2(rect.x, rect.y);
      const posOnCanvas = wheelPos.substract(cPos);
      pos = posOnCanvas;
      this.zoomTranslate = wheelPos.substract(center);
    }
    return [pos, deltaY];
  }

  private getMouseEvents(): Vec2 {
    let delta: Vec2 = new Vec2(0, 0);
    if (this.mouseEventBuffer.length > 0) {
      const event: MouseEvent = this.mouseEventBuffer.pop()!;
      console.log('mouse event type:', event.type);
      this.mouseEventBuffer = [];
      if (this.eventType === 0) {
        const posRaw: Vec2 = new Vec2(event.x, event.y);

        const rect: DOMRect = this.canvas.getBoundingClientRect();
        const cPos = new Vec2(rect.x, rect.y);
        const pos = posRaw.substract(cPos);


        delta = pos.substract(this.mousePos);
        this.mousePos = new Vec2(pos.x, pos.y);
      } else if (this.eventType === 1) {

        this.eventPos = new Vec2(event.x, event.y);
      }
    }
    return delta;
  }

  // Wer das liest ist cool
  public getTouchEvents(): [Vec2, number, Vec2] {
    let pos: Vec2 = new Vec2(0, 0);
    let scale: number = 0;
    let translate: Vec2 = new Vec2(0, 0);
    if (this.touchEventBuffer.length > 0) {
      const event: TouchEvent = this.touchEventBuffer.pop()!;
      this.touchEventBuffer = [];
      // check if the touch is still the same (no fingers changed)
      let sameTouch: boolean = true;
      if (event.touches.length != this.touchIds.length) {
        sameTouch = false;
      } else {
        for (let i = 0; i < event.touches.length; i++) {
          if (this.touchIds[i] !== event.touches.item(i)!.identifier) {
            sameTouch = false;
          }
        }
      }
      const [avg, fingers] = this.control.getTouchesAvagePosition(event.touches);
      if (sameTouch) {
        if (this.eventType === 0) { // two fingers
          pos = avg;
          translate = pos.substract(this.mousePos);
          this.mousePos = pos;
          if (fingers.length > 1) {
            const fingerDist: number = fingers[0].substract(fingers[1]).length();
            scale = 1 - (this.control.initialLength / fingerDist);
            this.control.initialLength = fingerDist;
          }
        } else if (this.eventType === 1) { // one finger

          const rect: DOMRect = this.canvas.getBoundingClientRect();
          const cPos = new Vec2(rect.x, rect.y);
          const posOnCanvas = avg.add(cPos);
          this.eventPos = posOnCanvas;
          pos = this.eventPos;
        }
      }
    }
    return [pos,
            scale,
            translate];
  }

 //I love you hehe
  draw() {
    this.clearCanvas();

    let [pos, scale] = this.getWheelEvents();
    let translate: Vec2 = this.getMouseEvents();
    if (this.touchEventBuffer.length > 0) {
      console.log('touch event detected!');
      [pos, scale, translate] = this.getTouchEvents();
      scale *= -1000;
    }
    const oldZoom = this.zoomfactor;
    let delta = 0;

    if (scale < 0) {
      delta = (scale / 1000) * this.zoomfactor;
    } else {
      delta = (scale / 1000) * (this.zoomfactor - (scale / 1000)) ;
    }

    if (this.zoomfactor - delta >= this.minZoom && this.zoomfactor - delta <= this.maxZoom) {
      this.zoomfactor -= delta;
    }

    const oneMinusZoom: number = 1 - oldZoom;
    let zoomPosTranslation: Vec2 = new Vec2(0, 0);
    if (scale != 0) {
      zoomPosTranslation = this.zoomPosition.substract(pos);
      zoomPosTranslation.multiplyBy(oneMinusZoom);
      this.zoomPosition = pos;
      console.log('translate',translate)
      translate.addOtherToSelf(zoomPosTranslation);
      console.log('zoomfactor',this.zoomfactor,'oneMinusZoom', oneMinusZoom);
      console.log('translate with zoomtranslation',translate)
    }

    switch (this.eventType) {
      case 0: // middle mouse click / two fingers

        this.pan(translate, oldZoom);
        break;
      case 1: // left click / one finger
        switch (this.mode) {
          case 0:
            this.openRadMenu();
            break;
          case 1:
            this.translateSelectedEntity();
            break;
          case 2: // rotate
            this.rotateSelectedEntity();
            break;
        }
        break;
      default:
        this.eventType = 0;
    }


    this.drawObjects();
    this.drawScale();
    this.drawMenus();
    this.drawDebug();
  }

  private pan(translate: Vec2, oldZoom: number): void {
    translate.divideBy(oldZoom);
    this.tX += translate.x;
    this.tY += translate.y;
  }

  private openRadMenu(): void {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const posOnCanvas = this.eventPos.substract(cPos);
    this.radMenus[this.radIndex].selectSegment(posOnCanvas);
    this.radMenus[this.radIndex].openIfLongEnough();
  }

  private rotateSelectedEntity(): void {
    console.log(this.entityToManipuilate);
    if (this.entityToManipuilate != null) {
      // const pos = this.convertRealToCanvas(this.eventPos);
      const rect: DOMRect = this.canvas.getBoundingClientRect();
      const cPos = new Vec2(rect.x, rect.y);
      const posOnCanvas = this.eventPos.substract(cPos);
      this.entityToManipuilate.rotate(posOnCanvas);
    }
  }
  private translateSelectedEntity(): void {
    console.log(this.entityToManipuilate);
    if (this.entityToManipuilate != null) {
      // const pos = this.convertRealToCanvas(this.eventPos);
      const rect: DOMRect = this.canvas.getBoundingClientRect();
      const cPos = new Vec2(rect.x, rect.y);
      const posOnCanvas = this.eventPos.substract(cPos);
      this.entityToManipuilate.translate(posOnCanvas);
    }
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
    this.zoomPosition = new Vec2(this.mX, this.mY);
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    this.canvasPos = new Vec2(rect.x, rect.y);
  }

  public clearCanvas(): void {
    if (this.ctx != null && this.canvas != null) {
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(0, 0, this.canvas.width , this.canvas.height);
    }
  }

  public drawObjects(): void {
    this.objects.forEach(o => {
      this.drawObject(o);
    });
  }

  public drawMenus(): void {
    this.radMenus.forEach(radMenu => {
      if (radMenu.open) {
        this.drawRadMenu(radMenu);
      }
    });
  }

  private drawObject(o: Entity): void {
    if (this.canvas != null && this.ctx != null && o.fighter != null) {
      let [widthScaled, posNew] = this.getObjectCoordinates(o);
      o.drawPosition = posNew.makeCopy();

      const tokenImage: HTMLImageElement = new Image(o.width, o.width);
      tokenImage.src = o.fighter.token;
      const posX = posNew.x;
      const posY = posNew.y;

      if (o.mode === 1) { // translation
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.2)'
        this.ctx.fillStyle = 'rgba(0, 153, 255, 0.2)'
        this.ctx.beginPath();
        let mult = 1;
        if (this.zoomfactor > 1) {
          mult = this.zoomfactor;
        }
        const a = 30 * mult;
        const b = 5 * mult;
        const c = 10 * mult;
        const d = 40 * mult;
        this.ctx.moveTo(posNew.x + b, posNew.y - b);
        this.ctx.lineTo(posNew.x + a, posNew.y - b);

        this.ctx.lineTo(posNew.x + a, posNew.y - c);
        this.ctx.lineTo(posNew.x + d, posNew.y);
        this.ctx.lineTo(posNew.x + a, posNew.y + c);
        this.ctx.lineTo(posNew.x + a, posNew.y + b);
        this.ctx.lineTo(posNew.x + b, posNew.y + b);

        this.ctx.lineTo(posNew.x + b, posNew.y + a);
        this.ctx.lineTo(posNew.x + c, posNew.y + a);
        this.ctx.lineTo(posNew.x, posNew.y + d);
        this.ctx.lineTo(posNew.x - c, posNew.y + a);
        this.ctx.lineTo(posNew.x - b, posNew.y + a);
        this.ctx.lineTo(posNew.x - b, posNew.y + b);

        this.ctx.lineTo(posNew.x - a, posNew.y + b);
        this.ctx.lineTo(posNew.x - a, posNew.y + c);
        this.ctx.lineTo(posNew.x - d, posNew.y);
        this.ctx.lineTo(posNew.x - a, posNew.y - c);
        this.ctx.lineTo(posNew.x - a, posNew.y - b);
        this.ctx.lineTo(posNew.x - b, posNew.y - b);

        this.ctx.lineTo(posNew.x - b, posNew.y - a);
        this.ctx.lineTo(posNew.x - c, posNew.y - a);
        this.ctx.lineTo(posNew.x, posNew.y - d);
        this.ctx.lineTo(posNew.x + c, posNew.y - a);
        this.ctx.lineTo(posNew.x + b, posNew.y - a);
        this.ctx.lineTo(posNew.x + b, posNew.y - b);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = 0.5;
      } else if (o.mode === 2) { // rotation
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'rgba(0, 153, 255, 0.2)'
        this.ctx.beginPath();
        const angle = Math.PI / 180 * 60;
        const angleM = o.rotation + Math.PI;
        const angleL = angleM - angle;
        const angleR = angleM + angle;
        const vectorL = new Vec2(Math.sin(angleL), -Math.cos(angleL));
        const vectorM = new Vec2(Math.sin(angleM), -Math.cos(angleM));
        const vectorR = new Vec2(Math.sin(angleR), -Math.cos(angleR));
        const angleA = o.rotation + Math.PI / 2 + angle;
        const angleB = o.rotation + Math.PI / 2 - angle;
        this.ctx.arc(posX, posY, widthScaled * 0.75,
          angleA,
          angleB);
        this.ctx.stroke();
        this.ctx.moveTo(posX, posY);
        const vectorLStart: Vec2 = vectorL.multiply(widthScaled * 0.75);
        vectorLStart.addOtherToSelf(new Vec2(posX, posY));
        const vectorRStart: Vec2 = vectorR.multiply(widthScaled * 0.75);
        vectorRStart.addOtherToSelf(new Vec2(posX, posY));
        vectorL.multiplyBy(5000);
        vectorL.addOtherToSelf(new Vec2(posX, posY));
        vectorM.multiplyBy(5000);
        vectorM.addOtherToSelf(new Vec2(posX, posY));
        vectorR.multiplyBy(5000);
        vectorR.addOtherToSelf(new Vec2(posX, posY));
        this.ctx.moveTo(vectorLStart.x, vectorLStart.y);
        this.ctx.lineTo(vectorL.x, vectorL.y);
        this.ctx.moveTo(vectorRStart.x, vectorRStart.y);
        this.ctx.lineTo(vectorR.x, vectorR.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.setLineDash([5, 10]);
        this.ctx.moveTo(posX, posY);
        this.ctx.lineTo(vectorM.x, vectorM.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.arc(posX, posY, widthScaled * 0.75,
          angleA,
          angleB);
        this.ctx.arc(posX, posY, 2000,
          angleB,
          angleA,
          true);
        this.ctx.fillStyle = 'rgba(0,0,0,0.25)';
        this.ctx.fill();
      }

      // distanzklasse
      if (o.zeigeNkRw && o.mode !== 1) {
        const colors: string[] = ['red', '#ff6600', 'darkgreen'];

        this.ctx.strokeStyle = 'darkgrey';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        let radius = widthScaled / 2;
        radius -= 2 * widthScaled / 10;
        this.ctx.arc(posX, posY, radius,
          0,
          Math.PI * 2);
        this.ctx.stroke();
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeStyle = 'black';

        this.ctx.strokeStyle = colors[o.nkRw];
        this.ctx.beginPath();
        radius = widthScaled / 2;
        radius += o.nkRw * widthScaled / 10;
        this.ctx.arc(posX, posY, radius,
          0,
          Math.PI * 2);
        this.ctx.stroke();
        this.ctx.strokeStyle = 'black';

      }

      // save current context situation
      this.ctx.save();
      if (o.manipulation === 1) {
        this.ctx.globalAlpha = 0.5;
      }
      this.ctx.translate(posX, posY);
      this.ctx.rotate(o.rotation);
      this.ctx.drawImage(tokenImage,0 - widthScaled / 2, 0 - widthScaled / 2, widthScaled, widthScaled)
      // restore saved context
      this.ctx.restore();

      if (this.zoomfactor >= 0.75) {
        // name
        this.ctx.font = "16px \"Aladin\", cursive"
        let txtWidth = this.ctx.measureText(o.fighter.name).width;
        this.ctx.textBaseline = "hanging";
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(o.fighter.name,posNew.x  - txtWidth / 2, posNew.y + widthScaled / 2);
      }

      if (o.manipulation === 1) {
        this.ctx.save();
        this.ctx.translate(o.ref.x, o.ref.y);
        this.ctx.rotate(o.rotation);
        this.ctx.drawImage(tokenImage,0 - widthScaled / 2, 0 - widthScaled / 2, widthScaled, widthScaled)
        // restore saved context
        this.ctx.restore();
        this.ctx.strokeStyle = 'purple'
        this.ctx.beginPath();
        this.ctx.moveTo(posNew.x, posNew.y);
        this.ctx.lineTo(o.ref.x, o.ref.y);
        this.ctx.stroke();
        this.ctx.strokeStyle = 'black'

        if (o.zeigeNkRw) {
          const colors: string[] = ['red', '#ff6600', 'darkgreen'];

          this.ctx.strokeStyle = '#660000';
          this.ctx.beginPath();
          let radius = widthScaled / 2;
          radius -= 2 * widthScaled / 10;
          this.ctx.arc(o.ref.x, o.ref.y, radius,
            0,
            Math.PI * 2);
          this.ctx.stroke();
          this.ctx.strokeStyle = 'black';

          this.ctx.strokeStyle = colors[o.nkRw];
          this.ctx.beginPath();
          radius = widthScaled / 2;
          radius += o.nkRw * widthScaled / 10;
          this.ctx.arc(o.ref.x, o.ref.y, radius,
            0,
            Math.PI * 2);
          this.ctx.stroke();
          this.ctx.strokeStyle = 'black';

        }
        /*
        this.ctx.strokeStyle = 'red'
        this.ctx.beginPath();
        this.ctx.moveTo(o.ref.x - 10, o.ref.y - 10);
        this.ctx.lineTo(o.ref.x + 10, o.ref.y + 10);
        this.ctx.moveTo(o.ref.x - 10, o.ref.y + 10);
        this.ctx.lineTo(o.ref.x + 10, o.ref.y - 10);
        this.ctx.stroke();
        this.ctx.strokeStyle = 'purple'
        this.ctx.beginPath();
        this.ctx.moveTo(posNew.x, posNew.y);
        this.ctx.lineTo(o.ref.x, o.ref.y);
        this.ctx.stroke();
        this.ctx.strokeStyle = 'black'
        */
      }






    }
  }

  private getObjectCoordinates(o: Entity): [number, Vec2] {
    const posX = Math.round(o.position.x + o.width / 2 - this.zoomPosition.x + this.tX);
    const posY = Math.round(o.position.y + o.width / 2 - this.zoomPosition.y + this.tY);

    const widthScaled = o.width * this.zoomfactor;
    const posXScaled = Math.round(posX * this.zoomfactor);
    const posYScaled = Math.round(posY * this.zoomfactor);

    const posXNew = posXScaled + this.zoomPosition.x;
    const posYNew = posYScaled + this.zoomPosition.y;
    const posNew: Vec2 = new Vec2(posXNew, posYNew);
    return [
      widthScaled,
      posNew
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

  drawScale(): void {
    const schritt = 30;
    let factor = 10;
    let length = (schritt * this.zoomfactor * factor);
    let text = '10 Schritt';
    if (this.zoomfactor >= 2) {
      factor = 1;
      length = (schritt * this.zoomfactor * factor);
      text = '1 Schritt';
    } else if (this.zoomfactor >= 1) {
      factor = 2;
      length = (schritt * this.zoomfactor * factor);
      text = '2 Schritt';
    } else if (this.zoomfactor >= 0.5) {
      factor = 5;
      length = (schritt * this.zoomfactor * factor);
      text = '5 Schritt';
    }
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const vw = rect.width / 100;
    const vh = rect.height / 100;
    const pointXEnd = rect.width - (2 * vw);
    const pointXStart = pointXEnd - length;
    const pointY = rect.height - (8 * vh);
    this.ctx.beginPath();
    this.ctx.moveTo(pointXEnd, pointY);
    this.ctx.lineTo(pointXStart, pointY);
    this.ctx.moveTo(pointXStart, pointY - 5);
    this.ctx.lineTo(pointXStart, pointY + 5);

    for (let i = 1; i < factor; i++) {
      const segment = length / factor;
      this.ctx.moveTo(pointXStart + segment * i, pointY - 2);
      this.ctx.lineTo(pointXStart + segment * i, pointY + 2);
    }

    this.ctx.moveTo(pointXEnd, pointY - 5);
    this.ctx.lineTo(pointXEnd, pointY + 5);
    this.ctx.stroke();

    const startToEnd = pointXEnd - pointXStart;

    this.ctx.font =  3 * vh + "px \"Aladin\", cursive"
    let txtWidth = this.ctx.measureText(text).width;
    this.ctx.textBaseline = "bottom";
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(text,pointXStart + startToEnd / 2 - txtWidth / 2, pointY - 1 * vh);
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
    if (this.zoomfactor < this.minZoom) {
      let diff = this.minZoom - this.zoomfactor;
      delta -= diff;
      this.zoomfactor = this.minZoom;
    }
    if (this.zoomfactor > this.maxZoom) {
      let diff = this.zoomfactor - this.maxZoom;
      delta += diff;
      this.zoomfactor = this.maxZoom;
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
    if (this.zoomfactor < this.minZoom) {
      let diff = this.minZoom - this.zoomfactor;
      delta -= diff;
      this.zoomfactor = this.minZoom;
    }
    if (this.zoomfactor > this.maxZoom) {
      let diff = this.zoomfactor - this.maxZoom;
      delta += diff;
      this.zoomfactor = this.maxZoom;
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
    this.radMenus[this.radIndex].pos = touchPos;
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

  public getNearestObjectWithinReach(reach: number, position: Vec2): Entity | null {
    let obj: Entity | null = null;
    let minDist = Number.MAX_VALUE;
    this.objects.forEach(o => {
      const oPos: Vec2 = o.getCenter(this.zoomfactor, new Vec2(this.zoomPosition.x, this.zoomPosition.y),
        new Vec2(this.tX, this.tY));
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
    return obj.getCenter(this.zoomfactor, new Vec2(this.zoomPosition.x, this.zoomPosition.y), new Vec2(this.tX, this.tY));
  }

  public convertRealToCanvas(realPos: Vec2): Vec2 {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const position = realPos.add(cPos);
    return position;
  }

  public convertCanvasToReal(posRaw: Vec2): Vec2 {

    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const position = posRaw.substract(cPos);

    const canvasCenter: Vec2 = new Vec2(this.zoomPosition.x, this.zoomPosition.y);
    const translation: Vec2 = new Vec2(this.tX, this.tY);

    const pos: Vec2 = posRaw.substract(canvasCenter);
    const posScaled: Vec2 = pos.multiply(this.zoomfactor);

    const o: Entity = this.entityToManipuilate!;
    const width = o.width;// * this.zoomfactor;
    const posX = posScaled.x - width / 2 + canvasCenter.x - translation.x;
    const posY = posScaled.y - width / 2 + canvasCenter.y - translation.y;



    const posNew: Vec2 = new Vec2(posX, posY);
    return posNew;
  }

  drawDebug(): void {
    this.ctx.strokeStyle = 'darkblue';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.zoomPosition.x, this.zoomPosition.y);
    this.ctx.stroke();

    this.ctx.strokeStyle = 'darkred';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
    this.ctx.stroke();
    this.ctx.strokeStyle = 'black';
  }
}
