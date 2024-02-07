import {Vec2} from "./vec2";
import {EventEmitter} from "@angular/core";

export class RadMenu {
  pos: Vec2; // position of center
  open: boolean = false;
  delay = 250;
  startTime = 0;
  radius: number = 100;
  segments: number = 5;
  selectedSegment: number = 0;
  fillColor: string = 'rgba(242, 230, 217, 0.5)';
  lineColor: string = 'rgb(76, 52, 26)';

  cancelImage: HTMLImageElement;

  segmentIcons: HTMLImageElement[] = [];
  segmentBorderVectors: Vec2[] = [];
  segmentMiddleVectors: Vec2[] = [];

  segmentNames: string[] = [];

  eventEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    this.buildSegmentVecotrs();
  }

  public buildSegmentVecotrs(): void {
    this.segmentBorderVectors = [];
    this.segmentMiddleVectors = [];
    if (this.segments > 1) {
      const segmentRad = 2 * Math.PI / this.segments;
      for (let i = 0; i < this.segments; i++) {
        const angleBorder = -segmentRad / 2 + segmentRad * i;
        const angleMiddle = segmentRad * i;
        const vectorBoder = new Vec2(Math.sin(angleBorder), -Math.cos(angleBorder));
        const vectorMiddle = new Vec2(Math.sin(angleMiddle), -Math.cos(angleMiddle));
        this.segmentBorderVectors.push(vectorBoder);
        this.segmentMiddleVectors.push(vectorMiddle);
      }
    } else {
      this.segmentBorderVectors = [];
      this.segmentMiddleVectors.push(new Vec2(0, -1));
    }
  }

  public initializeNew(segmentIcons: HTMLImageElement[],
                       cancelImage: HTMLImageElement,
                       segmentNames?: string[],
                       pos?: Vec2, open?: boolean, delay?: number,
                       startTime?: number, radius?: number, selectedSegment?: number,
                       fillColor?: string, lineColor?: string): void  {
    this.segments = segmentIcons.length;
    this.segmentIcons = segmentIcons;
    this.cancelImage = cancelImage;
    this.segmentNames = segmentNames ?? this.segmentNames;
    this.pos = pos ?? this.pos;
    this.open = open ?? this.open;
    this.delay = delay ?? this.delay;
    this.startTime = startTime ?? this.startTime;
    this.radius = radius ?? this.radius;
    this.selectedSegment = selectedSegment ?? this.selectedSegment;
    this.fillColor = fillColor ?? this.fillColor;
    this.lineColor = lineColor ?? this.lineColor;
    this.buildSegmentVecotrs();
    this.updateImageSize(this.cancelImage);
    this.segmentIcons.forEach(img => {
      this.updateImageSize(img);
    });
  }

  public setCancelImage(cancelImage: HTMLImageElement) {
    this.cancelImage = cancelImage;
    this.updateImageSize(this.cancelImage);
  }

  private updateImageSize(image: HTMLImageElement): void {
    image.width = this.radius / 2;
    image.height = this.radius / 2;
  }

  public selectSegment(other: Vec2): void {
    const vec: Vec2 = other.substract(this.pos);
    if (vec.length() >= this.radius / 3) {
      this.selectedSegment = 1;
      if (this.segments === 1) {
        this.selectedSegment = 1;
      } else {
        const up: Vec2 = new Vec2(0, -1);
        const segment = 2 * Math.PI / this.segments;
        const rotated = new Vec2(Math.sin(-segment / 2), -Math.cos(-segment / 2));
        let angle = rotated.directedAngleToVector(vec);
        if (angle < 0) {
          angle = Math.PI * 2 + angle;
        }
        this.selectedSegment = Math.ceil(angle / segment);
      }
    } else {
      this.selectedSegment = 0;
    }
  }

  public startTimer(): void {
    this.startTime = new Date().getTime();
  }

  public openIfLongEnough(): void {
    if (!this.open) {
      if (new Date().getTime() - this.startTime >= this.delay) {
        this.open = true;
      }
    }

  }

  public close(): void {
    this.eventEmitter.emit(this.selectedSegment);
    this.open = false;
    this.selectedSegment = 0;
    this.startTime = 0;
  }



}
