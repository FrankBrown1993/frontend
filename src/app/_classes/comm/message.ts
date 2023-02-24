/** frame length of empty message: 36 */
export class Message {
  type: string;
  code: number;
  seq: number;
  body: string;

  constructor(type: string, code: number, seq: number, body: string) {
    this.type = type;
    this.code = code;
    this.body = body;
    this.seq = seq;
  }

  getFrameSize(): number {
    let count = this.type.length;
    count += (this.code + "").length;
    count += this.body.length;
    count += (this.seq + "").length;
    count += 36;
    return count;
  }

  getFrameSizeWithoutBody(): number {
    let count = this.type.length;
    count += (this.code + "").length;
    count += (this.seq + "").length;
    count += 36;
    return count;
  }
}
