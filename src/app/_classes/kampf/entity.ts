import {Vec2} from "./vec2";

export class Entity {
  position: Vec2 = new Vec2(0,0);
  width: number = 0;
  image: HTMLImageElement | null = null;
  color: string = '';

  laufradius: number = 0;
  dLaufradius: boolean = false;

  constructor(posX: number, posY: number, width: number, image: HTMLImageElement | null, color: string) {
    this.position = new Vec2(posX, posY);
    this.width = width;

    if (image != null) {
      this.image = image;
    }

    if (color != '') {
      this.color = color;
    }
  }

  public near(x: number, y: number, scale: number): boolean {
    let near = true;
    console.log('x ',this.position.x, ' - ', this.position.x + this.width * scale)
    console.log('y ',this.position.y, ' - ', this.position.y + this.width * scale)
    if (x < this.position.x || x > this.position.x + this.width) {
      near = false;
    }
    if (y < this.position.y || y > this.position.y + this.width) {
      near = false;
    }
    return near;
  }
}
