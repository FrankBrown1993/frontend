import {Vec2} from "./vec2";
import {Kampfdaten} from "./entity/kampfdaten";
import {Fighter} from "../comm/payload/fighter";

export class Entity {
  position: Vec2 = new Vec2(0,0);
  drawPosition: Vec2 = new Vec2(0, 0);
  width: number = 0;
  color: string = '';
  rotation: number = 0; // from -Math.PI to Math.PI

  tokenImage: HTMLImageElement;

  ini: number;
  iniBasis: number;

  fighter: Fighter;

  // debug
  ref: Vec2 = new Vec2(0, 0);
  rotated: boolean = false;
  /*
  * 0: normal
  * 1: rotation
  */
  mode: number = 0;

  constructor(posX: number, posY: number, width: number, color: string, fighter: Fighter, ini: number, iniBasis: number,
              tokenAsImage: HTMLImageElement) {
    this.position = new Vec2(posX, posY);
    this.width = width;
    if (color != '') {
      this.color = color;
    }
    this.fighter = new Fighter();
    this.fighter.copy(fighter);
    this.ini = ini;
    this.iniBasis = iniBasis;
    this.tokenImage = tokenAsImage;
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

  public getCenterRaw(): Vec2 {
    const width = this.width;
    const posX = this.position.x + width / 2;
    const posY = this.position.y + width / 2;
    return new Vec2(posX, posY);
  }

  public getCenter(scale: number, canvasCenter: Vec2, translation: Vec2): Vec2 {
    const width = this.width;
    const posX = this.position.x + width / 2 - canvasCenter.x + translation.x;
    const posY = this.position.y + width / 2 - canvasCenter.y + translation.y;
    const posXScaled = posX * scale;
    const posYScaled = posY * scale;

    const posXNew = posXScaled + canvasCenter.x;
    const posYNew = posYScaled + canvasCenter.y;
    return new Vec2(posXNew, posYNew);
  }

  public rotate(ref: Vec2): void {
    this.ref = ref;
    this.rotated = true;
    let forward: Vec2 = new Vec2(0, 1);
    const newForward: Vec2 = ref.substract(this.drawPosition);
    newForward.normalize();
    let angle: number = forward.directedAngleToVector(newForward);
    if (angle < 0) {
      angle = Math.PI * 2 + angle;
    }
    this.rotation = angle;


  }
}
