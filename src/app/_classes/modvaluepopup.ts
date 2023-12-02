import {Input} from "@angular/core";
import {ModifiableValue} from "./comm/payload/modifiable-value";

export class Modvaluepopup {
  public modified: string = '';
  public modifiableValuesPos: ModifiableValue[] = [];
  public modifiableValuesNeg: ModifiableValue[] = [];

  public pointerX: number = 0;
  public pointerY: number = 0;

  public initialized = false;

  copy(other: Modvaluepopup): void {
    this.modified = other.modified;
    this.modifiableValuesPos = other.modifiableValuesPos;
    this.modifiableValuesNeg = other.modifiableValuesNeg;
    this.pointerX = other.pointerX;
    this.pointerY = other.pointerY;
    this.initialized = other.initialized;
  }
}
