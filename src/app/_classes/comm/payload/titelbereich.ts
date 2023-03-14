export class Titelbereich {
  /** Energien */
  aktLeP: number;
  maxLeP: number;
  aktAsP: number;
  maxAsP: number;
  aktKaP: number;
  maxKaP: number;

  /** Grundwerte */
  gs: number;
  aw: number;
  ini: number;
  sk: number;
  zk: number;
  trunkenheit: number;

  /** Attribute */
  mu: number;
  kl: number;
  ch: number;
  in: number;
  ff: number;
  ge: number;
  ko: number;
  kk: number;

  /** Zustandsvisualisierungen */
  rausch: number;
  schnutz: number;



  /** Abenteuer-Informationen */
  hintergrund: string;
  datum: string;
  bewoelkung: string;
  aktTemp: string;
  niederschlag: string;
  mond: number; // 0: neu, 3: kelch, 6: voll, 9: helm
  stunde: number;
  minute: number;

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
    this.trunkenheit = other.trunkenheit || this.trunkenheit;
    this.mu = other.mu || this.mu;
    this.kl = other.kl || this.kl;
    this.ch = other.ch || this.ch;
    this.in = other.in || this.in;
    this.ff = other.ff || this.ff;
    this.ge = other.ge || this.ge;
    this.ko = other.ko || this.ko;
    this.kk = other.kk || this.kk;
    this.hintergrund = other.hintergrund || this.hintergrund;
    this.datum = other.datum || this.datum;
    // this.wetter = other.wetter || this.wetter;
    this.bewoelkung = other.bewoelkung || this.bewoelkung;
    this.aktTemp = other.aktTemp || this.aktTemp;
    this.niederschlag = other.niederschlag || this.niederschlag;
    this.mond = other.mond || this.mond;
    this.stunde = other.stunde || this.stunde;
    this.rausch = other.rausch || this.rausch;
    this.schnutz = other.schnutz || this.schnutz;
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
    this.trunkenheit = 0;
    this.mu = 12;
    this.kl = 14;
    this.ch = 12;
    this.in = 13;
    this.ff = 14;
    this.ge = 10;
    this.ko = 9;
    this.kk = 10;
    this.hintergrund = 'Wald';
    this.datum = '16.1.1000';
    // this.wetter = 'geschlossene Wolkendecke#leichter Wind#kleine schuppenartige Wellen#15#19#19#Nieselregen';
    this.bewoelkung = 'bew4';
    this.aktTemp = 'temp1';
    this.niederschlag = 'rain3';
    this.mond = 2;
    this.stunde = 11;
    this.minute = 27;
    this.rausch = 4;
    this.schnutz = 2;
  }

  getZeitbeschreibung(): string {
    const zeiten: string[] = ['mitternachts', 'mitternachts', 'spät nachts', 'spät nachts', 'Morgengrauen', 'Morgengrauen'
      , 'früh morgens', 'früh morgens', 'morgens', 'morgens', 'vormittags', 'vormittags'
      , 'mittags', 'mittags', 'nachmittags', 'nachmittags', 'spät nachmittags', 'spät nachmittags'
      , 'früh abends', 'früh abends', 'abends', 'abends', 'spät abends', 'spät abends'];
    return zeiten[this.stunde];
  }

  getDatum(art: string): string {
    const tage: number[] = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5];
    const monateZwoelfgoetter: string[] = ['Praios', 'Rondra', 'Efferd', 'Travia',
      'Boron', 'Hesinde', 'Firun', 'Tsa',
      'Phex', 'Peraine', 'Ingerimm', 'Rahja',
      'Namenlose Tage'];
    const monateThrowal: string[] = ['Midsonnmond', 'Kornmond', 'Heimamond', 'Schlachtmond',
      'Sturmmond', 'Frostmond', 'Grimfrostmond', 'Goimond',
      'Friskenmond', 'Eimond', 'Faramond', 'Vinmond',
      'Hranngartage'];
    const monateZwerge: string[] = ['Sommermond', 'Hitzemond', 'Regenmond', 'Weinmond',
      'Nebelmond', 'Dunkelmond', 'Frostmond', 'Neugeburt',
      'Marktmond', 'Saatmond', 'Feuermond', 'Brautmond',
      'Drachentage'];
    let ausgabe = '';
    const splitted: string[] = this.datum.split('.');
    const tag: number = Number(splitted[0]);
    const monat: number = Number(splitted[1]);
    const jahr: number = Number(splitted[2]);
    if (art === 'Zwölfgötter') {
      ausgabe = tag + '. ' + monateZwoelfgoetter[monat - 1] + ' ' + jahr + ' BF';
    } else if (art === 'Thorwal') {
      ausgabe = tag + '. ' + monateThrowal[monat - 1] + ' ' + jahr + ' BF';
    } else if (art === 'Zwerge') {
      ausgabe = tag + '. ' + monateZwerge[monat - 1] + ' ' + jahr + ' BF';
    } else if (art === 'irdisch') {
      ausgabe = this.getIrdischesDatum(tag, monat, jahr);
    } else if (art === 'Jahreszeit') {
      if (monat === 1 || monat === 2 || monat === 12 || monat === 13) {
        ausgabe = 'Sommer';
      } else if (monat === 3 || monat === 4 || monat === 5) {
        ausgabe = 'Herbst';
      } else if (monat === 6 || monat === 7 || monat === 8) {
        ausgabe = 'Winter';
      } else {
        ausgabe = 'Frühling';
      }
    }
    return ausgabe;
  }

  getIrdischesDatum(tag: number, monat: number, jahr: number): string {
    const monateIrdischReihenfolge: string[] = ['Januar', 'Februar',
      'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober',
      'November', 'Dezember'];
    let ausgabe = '';
    let tageGesamt = this.getTagImJahr(tag, monat);
    console.log(tageGesamt);
    const tageIrdisch: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let i = 0; i < tageIrdisch.length; i++) {
      if (tageGesamt - tageIrdisch[i] > 0) {
        tageGesamt = tageGesamt - tageIrdisch[i];
        console.log('tageGesamt - ' + tageIrdisch[i] + ': ' + tageGesamt);
      } else {
        console.log('index dex monats: ' + i);
        ausgabe = tageGesamt + '.' + monateIrdischReihenfolge[i] + '.' + jahr;
        i = tageIrdisch.length;
      }
    }
    return ausgabe;
  }

  getTagImJahr(tag: number, monat: number): number {
    let tageGesamt = 0;
    let monatVorher = monat - 1;
    if (monatVorher === 0) {
      monatVorher = 13;
    }
    if (monatVorher < 7) {
      for (let i = 1; i <= monatVorher; i++) {
        tageGesamt += 30;
      }
      for (let i = 7; i <= 12; i++) {
        tageGesamt += 30;
      }
      tageGesamt += 5;
    } else {
      if (monatVorher === 13) {
        monatVorher = 12;
        tageGesamt += 5;
      }
      for (let i = 7; i <= monatVorher; i++) {
        tageGesamt += 30;
      }
    }
    if (tageGesamt === 365) {
      tageGesamt = 0;
    }
    return tageGesamt + tag;
  }
}
