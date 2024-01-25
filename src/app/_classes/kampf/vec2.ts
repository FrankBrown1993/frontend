export class Vec2 {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  public addOtherToSelf(other: Vec2): void {
    this.x += other.x;
    this.y += other.y;
  }

  public substract(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  public multiply(s: number): Vec2 {
    return new Vec2(this.x * s, this.y * s);
  }

  public multiplyBy(s: number): void {
    this.x = Math.round(this.x * s);
    this.y = Math.round(this.y * s);
  }

  public divide(v: Vec2, s: number): Vec2 {
    return new Vec2(v.x / s, v.y / s);
  }

  public divideBy(s: number): void {
    this.x = Math.round(this.x / s);
    this.y = Math.round(this.y / s);
  }

  public length(): number {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  public toString(): string {
    return '[x: ' + this.x + ', y: ' + this.y + "]";
  }

  public directedAngleToVector(other: Vec2): number {
    const crossProduct = this.x * other.y - this.y * other.x;
    const dotProduct = this.x * other.x + this.y * other.y;
    const angleRadians = Math.atan2(crossProduct, dotProduct);
    return angleRadians;
  }
}
