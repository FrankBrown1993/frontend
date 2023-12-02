export class ModifiableValue {
  modified: string;
  modifier: string;
  modValue: string;

  copy(other: ModifiableValue): void {
    this.modified = other.modified;
    this.modifier = other.modifier;
    this.modValue = other.modValue;
  }
}
