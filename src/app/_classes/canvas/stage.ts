import {Vec2} from "../kampf/vec2";
import {Entity} from "../kampf/entity";
import {RadMenu} from "../kampf/rad-menu";

export class Stage {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ratio: number;

  zoomfactor = 1.0;
  mX = 0; // canvas width center
  mY = 0; // canvas height center
  tX = 0; // overall translation x
  tY = 0; // overall translation y
  canvasPos: Vec2 = new Vec2(0, 0);

  objects: Entity[] = [];

  /** Canvas Menus */
  radMenu: RadMenu = new RadMenu();


  public initialize(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    this.canvas = canvas;
    this.ctx = ctx;
    this.ratio = this.canvas.width / this.canvas.height;
    // this.initiateObjects();
    console.log(this.objects);
    this.sortEntities();
    console.log(this.objects);
    this.refreshCanvas();
  }

  public initiateObjects(): void {
    /*
    const tkn_fianna: HTMLImageElement = document.getElementById('token_fianna') as HTMLImageElement;
    const ptrt_fianna: HTMLImageElement = document.getElementById('portrait_fianna') as HTMLImageElement;
    tkn_fianna.width = 50;
    tkn_fianna.height = 50;
    this.objects.push(new Entity(100, 200, 50, '', tkn_fianna, ptrt_fianna, 'Fianna', 16, 12));

    const tkn_balrog: HTMLImageElement = document.getElementById('token_balrog') as HTMLImageElement;
    const ptrt_balrog: HTMLImageElement = document.getElementById('portrait_balrog') as HTMLImageElement;
    tkn_balrog.width = 50;
    tkn_balrog.height = 50;
    this.objects.push(new Entity(800, 400, 50, '', tkn_balrog, ptrt_balrog, 'Balrog', 14, 9));

    const tkn_adrian: HTMLImageElement = document.getElementById('token_adrian') as HTMLImageElement;
    const ptrt_adrian: HTMLImageElement = document.getElementById('portrait_adrian') as HTMLImageElement;
    tkn_adrian.width = 50;
    tkn_adrian.height = 50;
    this.objects.push(new Entity(750, 50, 50, '', tkn_adrian, ptrt_adrian, 'Adrian', 14, 12));

    let loaded = 0;
    this.objects.forEach(obj => {
      obj.token.onload = () => {
        loaded++;
        if (loaded === this.objects.length) {
          this.refreshCanvas();
        }
      };
    });
    */
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
    if (this.radMenu.open) {
      this.drawRadMenu();
    }
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

  private drawRadMenu(): void {
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = this.radMenu.lineColor;
    // inner circle
    this.ctx.beginPath();
    this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius / 3, 0, 2 * Math.PI);
    this.ctx.stroke();
    const segmentRad = 2 * Math.PI / this.radMenu.segments;
    if (this.radMenu.selectedSegment > 0) {
      const startAngle = Math.PI * 1.5 - segmentRad / 2 + (segmentRad * this.radMenu.selectedSegment);
      const endAngle = startAngle + (segmentRad * (this.radMenu.segments - 1));
      // unselected cirle
      this.ctx.beginPath();
      this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius,
        startAngle,
        endAngle);
      this.ctx.stroke();

      // selected circle
      this.ctx.beginPath();
      this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius * 1.25,
        endAngle,
        endAngle + segmentRad);
      this.ctx.stroke();

      // fill unselected area
      this.ctx.beginPath();
      this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius / 3,
        startAngle,
        endAngle);
      this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius,
        endAngle,
        startAngle,
        true);
      this.ctx.fillStyle = this.radMenu.fillColor; // Farbe für den Kreisring
      this.ctx.fill();

      // fill selected area
      this.ctx.beginPath();
      this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius / 3,
        endAngle,
        startAngle);
      this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius * 1.25,
        startAngle,
        endAngle,
        true);
      this.ctx.fillStyle = this.radMenu.fillColor; // Farbe für den Kreisring
      this.ctx.fill();
      this.ctx.drawImage(this.radMenu.cancelImage,
        this.radMenu.pos.x - (this.radMenu.cancelImage.width) / 2,
        this.radMenu.pos.y - (this.radMenu.cancelImage.height) / 2,
        this.radMenu.cancelImage.width,
        this.radMenu.cancelImage.height);
    } else {
      this.ctx.beginPath();
      this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius, 0, 2 * Math.PI);
      this.ctx.stroke();

      // fill
      this.ctx.beginPath();
      this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius / 3, 0, 2 * Math.PI);
      this.ctx.arc(this.radMenu.pos.x, this.radMenu.pos.y, this.radMenu.radius,0, 2 * Math.PI, true);
      this.ctx.fillStyle = this.radMenu.fillColor; // Farbe für den Kreisring
      this.ctx.fill();
      this.ctx.drawImage(this.radMenu.cancelImage,
        this.radMenu.pos.x - (this.radMenu.cancelImage.width * 1.25) / 2,
        this.radMenu.pos.y - (this.radMenu.cancelImage.height * 1.25) / 2,
        this.radMenu.cancelImage.width * 1.25,
        this.radMenu.cancelImage.height * 1.25);
    }

    // draw straight lines
    let i: number = 0;
    this.radMenu.segmentBorderVectors.forEach(vec => {
      let mult = 1;
      if (i === this.radMenu.selectedSegment
          || i + 1 === this.radMenu.selectedSegment
          || (i === 0 && this.radMenu.selectedSegment === this.radMenu.segments)) {
        mult = 1.25;
      }
      if (this.radMenu.selectedSegment === 0) {
        mult = 1;
      }
      this.ctx.beginPath(); // Start a new path
      this.ctx.moveTo(
        this.radMenu.pos.x + vec.x * this.radMenu.radius / 3,
        this.radMenu.pos.y + vec.y * this.radMenu.radius / 3);
      i++;
      this.ctx.lineTo(
        this.radMenu.pos.x + vec.x * this.radMenu.radius * mult,
        this.radMenu.pos.y + vec.y * this.radMenu.radius * mult); // Draw a line to (150, 100)
      this.ctx.stroke(); // Render the path
    });

    i = 0;
    // draw icons
    this.radMenu.segmentMiddleVectors.forEach(vec => {
      let mult = 1;
      if (this.radMenu.selectedSegment - 1 === i) {
        mult = 1.25;
      }

      /*
        this.radMenu.pos.x - (this.radMenu.cancelImage.width * 1.25) / 2,
        this.radMenu.pos.y - (this.radMenu.cancelImage.height * 1.25) / 2,
       */
      const scaledVec: Vec2 = vec.multiply(this.radMenu.radius * (2/3) * mult);
      const position: Vec2 = this.radMenu.pos.add(scaledVec);
      this.ctx.drawImage(this.radMenu.segmentIcons[i],
        position.x - this.radMenu.segmentIcons[i].width * mult / 2,
        position.y - this.radMenu.segmentIcons[i].height * mult / 2,
        this.radMenu.segmentIcons[i].width * mult,
        this.radMenu.segmentIcons[i].height * mult);
      i++;
    });
  }

  public closeRadMenu(): void {
    this.radMenu.close();
  }

  public zoomMouse(deltaY: number) {
    this.zoom(deltaY);
    this.refreshCanvas();
  }

  public shiftMouse(delta: Vec2) {
    this.shift(delta);
    this.refreshCanvas();
  }

  public touchZoomAndShift(delta: Vec2, ratio: number): void {
    this.tX += (delta.x / this.zoomfactor);
    this.tY += (delta.y / this.zoomfactor);

    this.zoomfactor += (ratio * this.zoomfactor);
    if (this.zoomfactor < 0.25) {
      this.zoomfactor = 0.25;
    }
    if (this.zoomfactor > 4) {
      this.zoomfactor = 4;
    }
    this.refreshCanvas();
  }

  private zoom(deltaY: number): void {
    this.zoomfactor -= (deltaY / 1000) * this.zoomfactor;
    if (this.zoomfactor < 0.25) {
      this.zoomfactor = 0.25;
    }
    if (this.zoomfactor > 4) {
      this.zoomfactor = 4;
    }
  }

  private shift(delta: Vec2): void {
    this.tX += (delta.x / this.zoomfactor);
    this.tY += (delta.y / this.zoomfactor);
  }

  public positionRadMenu(touchPos: Vec2): void {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const posOnCanvas = touchPos.substract(cPos);
    this.radMenu.pos = posOnCanvas;
    this.radMenu.startTimer();
    this.refreshCanvas();
  }



  public moveTouch(touchPos: Vec2): void {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const cPos = new Vec2(rect.x, rect.y);
    const posOnCanvas = touchPos.substract(cPos);
    this.radMenu.selectSegment(posOnCanvas);
    this.radMenu.openIfLongEnough();
    this.refreshCanvas();
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
}
