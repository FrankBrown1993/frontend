export class Titelbereich {
  aktLeP: number;
  maxLeP: number;
  aktAsP: number;
  maxAsP: number;
  aktKaP: number;
  maxKaP: number;
  gs: number;
  aw: number;
  ini: number;
  sk: number;
  zk: number;
  /** Attribute */
  mu: number;
  kl: number;
  ch: number;
  in: number;
  ff: number;
  ge: number;
  ko: number;
  kk: number;

  trunkenheit: number;
  hintergrund: string;


  copy(other: Titelbereich): void {
    this.aktLeP = other.aktLeP || this.aktLeP;
    this.maxLeP = other.maxLeP || this.maxLeP;
    this.aktAsP = other.aktAsP || this.aktAsP;
    this.maxAsP = other.maxAsP || this.maxAsP;
    this.aktKaP = other.aktKaP || this.aktKaP;
    this.maxKaP = other.maxKaP || this.maxKaP;
    this.gs = other.gs || this.gs;
    this.aw = other.aw || this.aw;
    this.ini = other.ini || this.ini;
    this.sk = other.sk || this.sk;
    this.zk = other.zk || this.zk;
    this.mu = other.mu || this.mu;
    this.kl = other.kl || this.kl;
    this.ch = other.ch || this.ch;
    this.in = other.in || this.in;
    this.ff = other.ff || this.ff;
    this.ge = other.ge || this.ge;
    this.ko = other.ko || this.ko;
    this.kk = other.kk || this.kk;
    this.trunkenheit = other.trunkenheit || this.trunkenheit;
    this.hintergrund = other.hintergrund || this.hintergrund;
  }

  dummyValues(): void {
    this.aktLeP = 30;
    this.maxLeP = 30;
    this.aktAsP = 24;
    this.maxAsP = 24;
    this.aktKaP = 0;
    this.maxKaP = 0;
    this.gs = 7;
    this.aw = 6;
    this.ini = 10;
    this.sk = 2;
    this.zk = 0;
    this.mu = 12;
    this.kl = 14;
    this.ch = 12;
    this.in = 13;
    this.ff = 14;
    this.ge = 10;
    this.ko = 9;
    this.kk = 10;
    this.trunkenheit = 0;
    this.hintergrund = 'Wald';
  }
}
