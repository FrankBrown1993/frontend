/** frame length of empty message: <= 75 */
export class Message {
  type: string
  returnType: string;
  modifier: string;
  code: number;
  charId: number;
  seq: number;
  body: string;

  /**
   *
   * @param type eg. 'titelbereich'
   * @param code eg. a modification
   * @param charId id of character
   * @param body eg. the name of the value to modify
   */
  constructor(type: string, returnType: string, modifier: string, code: number, charId: number, body: string) {
    this.type = type;
    this.returnType = returnType;
    this.modifier = modifier;
    this.code = code;
    this.charId = charId;
    this.body = body;
    this.seq = -1;
  }

  getFrameSize(): number {
    let count = this.type.length;
    count += (this.returnType + "").length;
    count += (this.modifier + "").length;
    count += (this.code + "").length;
    count += (this.charId + "").length;
    count += this.body.length;
    count += (this.seq + "").length;
    count += 75;
    return count;
  }

  getFrameSizeWithoutBody(): number {
    let count = this.type.length;
    count += (this.returnType + "").length;
    count += (this.modifier + "").length;
    count += (this.code + "").length;
    count += (this.charId + "").length;
    count += (this.seq + "").length;
    count += 75;
    return count;
  }
}
