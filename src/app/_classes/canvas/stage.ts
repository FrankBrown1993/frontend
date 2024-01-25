import {Vec2} from "../kampf/vec2";
import {Entity} from "../kampf/entity";
import {RadMenu} from "../kampf/rad-menu";

export class Stage {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  zoomfactor = 1.0;
  mX = 0;
  mY = 0;
  tX = 0;
  tY = 0;
  canvasPos: Vec2 = new Vec2(0, 0);

  objects: Entity[] = [];

  /** Canvas Menus */
  radMenu: RadMenu = new RadMenu();

  public initialize(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    this.canvas = canvas;
    this.ctx = ctx;
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

      if (o.dLaufradius) {
        this.ctx.beginPath();
        this.ctx.arc(posXNew, posYNew, o.laufradius * this.zoomfactor, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = 'rgba(0, 100, 255, 0.25)';
        this.ctx.fill();
      }

      if (o.image != null) {
        this.ctx.drawImage(o.image, posXNew - widthScaled / 2, posYNew - widthScaled / 2, widthScaled, widthScaled)
      } else {
        this.ctx.fillStyle = o.color;
        this.ctx.fillRect(posXNew - widthScaled / 2, posYNew - widthScaled / 2, widthScaled, widthScaled);
      }
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
    if (this.ctx != null) {
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
      }

      for (let i = 0; i < this.radMenu.segments; i++) {
        if (this.radMenu.segments > 1) {
          let mult = 1;
          if (i === this.radMenu.selectedSegment || i + 1 === this.radMenu.selectedSegment
            || (i === 0 && this.radMenu.selectedSegment === this.radMenu.segments)) {
            mult = 1.25;
          }
          if (this.radMenu.selectedSegment === 0) {
            mult = 1;
          }
          const angle = -segmentRad / 2 + segmentRad * i;
          this.ctx.beginPath(); // Start a new path
          const rotated = new Vec2(Math.sin(angle), -Math.cos(angle));

          this.ctx.moveTo(
            this.radMenu.pos.x + rotated.x * this.radMenu.radius / 3,
            this.radMenu.pos.y + rotated.y * this.radMenu.radius / 3);
          this.ctx.lineTo(
            this.radMenu.pos.x + rotated.x * this.radMenu.radius * mult,
            this.radMenu.pos.y + rotated.y * this.radMenu.radius * mult); // Draw a line to (150, 100)
          this.ctx.stroke(); // Render the path
        }
      }
    }
  }

  public closeRadMenu(): void {
    this.radMenu.close();
  }
}
