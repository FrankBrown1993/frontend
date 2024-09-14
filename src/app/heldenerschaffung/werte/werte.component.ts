import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {WebsocketService} from "../../_services/websocket.service";
import {takeUntil} from "rxjs/operators";
import {Message} from "../../_classes/comm/message";
import {bootstrapApplication} from "@angular/platform-browser";


@Component({
  selector: 'app-werte',
  templateUrl: './werte.component.html',
  styleUrls: ['./werte.component.sass']
})
export class WerteComponent implements OnInit{
  @Output() zurueck: EventEmitter<any> = new EventEmitter<any>();
  @Output() weiter: EventEmitter<any> = new EventEmitter<any>();

  destroyed = new Subject();
  id: string;
  msgprefix = "werte_";

  public werte: any = {
    nav: 0,
    attributes: [],
    modChoices: [],
    chosenMod: '',
    ap_werte: 0,
    ap_kampftechniken: 0,
    vun: [],
    sf: [],
    traditionsartefakte: [],
    vun_of_spezies: false,
    ortskenntnis_added: false,
    kultur_extracted: false,
    sf_of_profession: false,
    infos_extracted: false,
    pAsP: 0,
    pAsPBack: 0,
    kdv: 0,
    sprachen_sf: undefined,
    sprachen: [],
    schriften: [],
    prof_sf_without_spez: [],
    talente_koerper: [],
    talente_gesellschaft: [],
    talente_natur: [],
    talente_wissen: [],
    talente_handwerk: [],
    zauber: [],
    liturgien: [],
    kampftechniken: [],
    ktMods: [],
  };

  kosten_A_bis_D: number[] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  kostenMultiplikator: Map<string, number> = new Map();
  kosten_E: number[] = [0, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

  eigModString = '';
  eigPunkte = 0;
  modAuto: any[] = [];

  vorteilIndex = 0;
  vorteil_to_add: any = {
    name: '',
    stufe: 1,
    kategorie: '',
    spezifikation: '',
    kosten: 0,
    hatstufen: false,
  };

  vorteilKatKosten = 0;
  romanLetters: string[] = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"];

  vunNames: Map<string, string> = new Map();

  sf_types: string[] = [];

  sf_map: string[][] = [];
  sf_chosenKeys: string[] = [];
  sf_list: string[] = [];
  sf_index = 0;
  sf: any = null;
  sf_spezialisierungen: any[] = [''];
  sf_spez_index = 0;
  sf_to_add: any = {
    name: '',
    stufe: 1,
    kategorie: '',
    spezifikation: '',
    kosten: 0,
    hatstufen: false,
    pAsP: 0,
    kdv: 0,
    volumen: 0,
    artefakt: '',
  };

  ortskenntnis_to_add: any = {
    name: 'Ortskenntnis',
    stufe: 1,
    kategorie: '',
    spezifikation: '',
    kosten: 2,
    hatstufen: false,
    pAsP: 0,
    kdv: 0,
    volumen: 0,
    artefakt: '',
  };

  zauber_to_add = {
    name: '',
    art: '',
    fw: 0,
    max: 0,
    min: 0,
    steigerung: '',
    attr_1: '',
    attr_2: '',
    attr_3: '',
    mod: '',
    beschreibung: '',
    wirkung: '',
    wirkung_qs: [],
    kosten: '',
    kosten_erhaltung: '',
    aktions_dauer: '',
    reichweite: '',
    wirkungsdauer: '',
    zielkategorie: '',
    merkmal: '',
    verbreitungen: [],
    erweiterungen: [],
  };

  zauber_index = 0;
  zauber_keys: string[] = [];

  goetter_kulte: string[] = ['Gott: Praios', 'Göttin: Rondra', 'Gott: Efferd', 'Göttin: Travia', 'Gott: Boron', 'Göttin: Hesinde', 'Gott: Firun', 'Göttin: Tsa', 'Gott: Phex', 'Göttin: Peraine', 'Gott: Ingerimm', 'Göttin: Rahja', 'Der Namenlose', 'Die Himmelswölfe', 'Kamaluq', 'Rastullah', 'Rur und Gror', 'elfisch: Nurti', 'elfisch: Zerzal', 'zwergisch: Angrosch', 'orkisch: Brazoragh', 'orkisch: Tairach', 'goblinisch: Mailam Rekdai', 'trollisch: Raschtul', 'echsisch: H’Szint', 'echsisch: Z’sahh', 'echsisch: K’r’tonchh', 'echsisch: Ssad’Navv', 'Borbarad', 'Erzdämon: Blakharaz', 'Erzdämon: Belhalhar', 'Erzdämonin: Charyptoroth', 'Erzdämonin: Lolgramoth', 'Erzdämonin: Thargunitoth', 'Erzdämon: Amazeroth', 'Erzdämon: Belshirash', 'Erzdämonin: Asfaloth', 'Erzdämon: Tasfarelel', 'Erzdämonin: Belzhorash', 'Erzdämon: Agrimoth', 'Erzdämonin: Belkelel', 'Halbgott: Aves', 'Halbgöttin: Ifirn', 'Halbgott: Kor', 'Halbgott: Levthan', 'Halbgöttin: Mada', 'Halbgöttin: Marbo', 'Halbgöttin: Mokoscha', 'Halbgott: Nandus', 'Halbgöttin: Satuaria', 'Halbgott: Satinav', 'Halbgott: Simia', 'Halbgöttin: Sumu', 'Halbgott: Swafnir', 'Halbgott: Ucuri'];
  einzenlneRegionen: string[] = ['Albernia', 'Almada', 'Garetien', 'Kosch', 'Nordmarken', 'Rommilyser Mark', 'Tobrien', 'Weiden', 'Windhag', 'AlʼAnfanisches Imperium', 'Andergast', 'Aranien', 'Bergkönigreiche der Zwerge', 'Bornland', 'Gjalskerland', 'Hoher Norden', 'Horasreich', 'Kalifat', 'Maraskan', 'Nostria', 'Orkland', 'Salamandersteine & umliegende Gebiete der Elfen', 'Schattenlande', 'Südmeer & Waldinseln', 'Svellttal', 'Thorwal', 'Tiefer Süden', 'Tulamidenlande', 'Zyklopeninseln'];
  merkmale: string[] = ['Antimagie', 'Dämonisch', 'Einfluss', 'Elementar', 'Heilung', 'Hellsicht', 'Illusion', 'Sphären', 'Objekt', 'Telekinese', 'Verwandlung'];
  fertigkeitsspezialisierungen: string[] = [];
  fert_spez_index: number = 0;

  sprachen_ap = 0;

  infos: any;

  constructor(private websocket: WebsocketService) {
    this.kostenMultiplikator.set("A", 1);
    this.kostenMultiplikator.set("B", 2);
    this.kostenMultiplikator.set("C", 3);
    this.kostenMultiplikator.set("D", 4);

  }

  ngOnInit(): void {
    this.id = sessionStorage.getItem('user_id')!;

    const websocket = this.websocket.connect(this.id).pipe(
      takeUntil(this.destroyed),
    );

    websocket.subscribe((raw: string) => {
      const message: Message = JSON.parse(raw);
      if (message.body != null && message.body.length > 0) {
        if (message.type.startsWith(this.msgprefix)) {
          const msg_type = message.type.substring(this.msgprefix.length);
          console.log("[HELDENERSCHAFFUNG][WERTE]", msg_type);
          if (msg_type === 'get') {
            console.log("[HELDENERSCHAFFUNG][WERTE]", JSON.parse(message.body));
            this.infos = JSON.parse(message.body);
            let temp = sessionStorage.getItem('werte');
            if (temp != null) {
              this.werte = JSON.parse(temp);
              console.log("this.werte", this.werte);
            } else {
              this.werte.attributes = [{name:"MU",wert:8},{name:"KL",wert:8},{name:"IN",wert:8},{name:"CH",wert: 8},
                {name:"FF",wert: 8},{name:"GE",wert: 8},{name:"KO",wert: 8},{name:"KK",wert: 8}];
            }
            this.extractInfos();
            this.extractEigMods();
            this.vorteilChange();
            this.getVuNEmpfehlungen();
            this.extractVuNOfSpezies();
            this.extractSfOfProfession();
            this.extractKultur();
            this.getKeys(0);
            this.getSchriftenUndSprachenAp();
            this.changeZauber();
          }
        }
      } else {
        console.error("MESSAGE BODY IS NULL");
      }
    });


    this.get();

  }


  public get() {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'get', '',
      0, -1, this.msgprefix + 'get');
    this.websocket.sendMessage(message)
    // this.getInfos();
  }

  public extractEigMods() {
    this.modAuto = [];
    this.infos.spezies.eigenschaftsaenderungen.forEach(eMods => {
      if (eMods.length == 1) {
        this.modAuto.push({
          name: eMods[0].name,
          wert: eMods[0].wert,
        });
        /*
        this.werte.attributes.forEach(a => {
          if (a.name === eMods[0].name) {
            a.wert += eMods[0].wert;
          }
        });*/
      } else {
        this.eigModString = 'Wähle einen aus folgenden Attributen ' + eMods[0].wert + ": ";
        this.werte.modChoices = [];
        let index = 0;
        eMods.forEach(mod => {
          if (index === 0 && this.werte.chosenMod === '') {
            this.werte.chosenMod = mod.name;
            /*
            this.werte.attributes.forEach(a => {
              if (a.name === mod.name) {
                a.wert += mod.wert;
              }
            });
            */
          }
          this.eigModString += mod.name;
          if (index < eMods.length - 2) {
            this.eigModString += ", ";
          } else if (index < eMods.length - 1) {
            this.eigModString += " oder ";
          }
          this.werte.modChoices.push(mod);
          index ++;
        });
      }

    });
    this.getEigenschaftsWarnungen();
  }

  public isInMods(name: string): number {
    let contains = 0;
    this.werte.modChoices.forEach(m => {
      if (m.name === name) {
        contains = m.wert;
      }
    });
    return contains;
  }

  public chooseMod(attr: any) {
    let value = 0;
    this.werte.modChoices.forEach(m => {
      if (this.werte.chosenMod != null && this.werte.chosenMod === m.name) {
        value = m.wert;
      }
    });
    this.werte.chosenMod = attr['name'];
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
    this.getEigenschaftsWarnungen();
  }

  public getFwMaxClass(attr: any): string {
    let className = 'badmax';
    let mod = this.getEigMod(attr);
    let max = this.infos.erfahrung.max_wert_eigenschaft + mod;
    if (attr['wert'] <= max) {
      className = 'max';
    }
    return className;
  }

  public getEigMod(attr): number {
    let mod = 0;
    this.modAuto.forEach(m => {
      if (m['name'] === attr['name']) {
        mod = m['wert'];
      }
    });
    if (attr['name'] === this.werte['chosenMod']) {
      mod = this.isInMods(attr['name']);
    }
    return mod;
  }

  public getEigMax(attr: any): number {
    let mod = this.getEigMod(attr);
    let max = this.infos.erfahrung.max_wert_eigenschaft + mod;
    return max;
  }

  public getEigenschaftsWarnungen(): void {
    this.eigPunkte = 0;
    this.werte.attributes.forEach(a => {
      this.eigPunkte += Number(a.wert);
    });
    this.maxKtWerte();
    this.maxFertWerte();
  }

  public increaseEigWert(attr: any): void {
    const neuerWert = attr.wert + 1;
    const kosten = this.kosten_E[neuerWert];
    attr.wert = neuerWert;
    this.werte.ap_werte += Number(kosten);
    this.getEigenschaftsWarnungen();
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
  }
  public decreaseEigWert(attr: any): void {
    const kosten = this.kosten_E[attr.wert];
    attr.wert -= 1;
    this.werte.ap_werte -= kosten;
    this.getEigenschaftsWarnungen();
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
  }

  public vorteilChange(): void {
    const vorteil = this.infos.vun[this.vorteilIndex];
    this.vorteil_to_add.name = vorteil.name;
    // console.log(vorteil);
    if (vorteil.kategorie_kosten.length > 0) {
      if (vorteil.kategorie_kosten[0]['kategorie'] === 'Fertigkeit') {
        const fertigkeit = this.infos.talente_koerper[0];
        this.vorteil_to_add['kategorie'] = fertigkeit['name'];
        let index = 0;
        let i = 0;
        vorteil.kategorie_kosten.forEach(k => {
          if (k['stufe'] === fertigkeit['steigerung']) {
            index = i;
          }
          i ++;
        });
        this.vorteilKatKosten = vorteil.kategorie_kosten[index]['kosten'];
      } else if (vorteil.kategorie_kosten[0]['kategorie'] === 'Kampftechnik') {
        const fertigkeit = this.infos.kampftechniken[0];
        this.vorteil_to_add['kategorie'] = fertigkeit['name'];
        let index = 0;
        let i = 0;
        vorteil.kategorie_kosten.forEach(k => {
          if (k['stufe'] === fertigkeit['steigerung']) {
            index = i;
          }
          i ++;
        });
        this.vorteilKatKosten = vorteil.kategorie_kosten[index]['kosten'];
      } else {
        this.vorteil_to_add['kategorie'] = vorteil.kategorie_kosten[0]['stufe'];
        this.vorteilKatKosten = vorteil.kategorie_kosten[0]['kosten'];
      }
    } else {
      this.vorteil_to_add['kategorie'] = '';
      this.vorteilKatKosten = 0;
    }
  }

  public vorteilKatChange(): void {
    const vorteil = this.infos.vun[this.vorteilIndex];
    if (vorteil.kategorie_kosten[0]['kategorie'] === 'Fertigkeit') {
      let fertigkeit;
      this.infos.talente_koerper.concat(this.infos.talente_gesellschaft)
        .concat(this.infos.talente_natur).concat(this.infos.talente_wissen).concat(this.infos.talente_handwerk)
        .concat(this.infos.magie).concat(this.infos.geweiht).forEach(f => {
        if (f['name'] === this.vorteil_to_add['kategorie']) {
          fertigkeit = f;
        }
      });
      let index = 0;
      let i = 0;
      vorteil.kategorie_kosten.forEach(k => {
        if (k['stufe'] === fertigkeit['steigerung']) {
          index = i;
        }
        i ++;
      });
      this.vorteilKatKosten = vorteil.kategorie_kosten[index]['kosten'];

    } else if (vorteil.kategorie_kosten[0]['kategorie'] === 'Kampftechnik') {
      let fertigkeit;
      this.infos.kampftechniken.forEach(f => {
        if (f['name'] === this.vorteil_to_add['kategorie']) {
          fertigkeit = f;
        }
      });
      let index = 0;
      let i = 0;
      vorteil.kategorie_kosten.forEach(k => {
        if (k['stufe'] === fertigkeit['steigerung']) {
          index = i;
        }
        i ++;
      });
      this.vorteilKatKosten = vorteil.kategorie_kosten[index]['kosten'];
    } else {
      vorteil.kategorie_kosten.forEach(k => {
        if (k['stufe'] === this.vorteil_to_add['kategorie']) {
          this.vorteilKatKosten = k['kosten'];
        }
      });
    }
  }

  public addVuN() {
    let kosten = 0;
    if (this.infos.vun[this.vorteilIndex].kategorie_kosten.length === 0) {
      kosten = this.infos.vun[this.vorteilIndex].kosten * this.vorteil_to_add['stufe'];
    } else {
      kosten = this.vorteilKatKosten;
    }
    if (this.infos.vun[this.vorteilIndex]['stufen'] > 1) {
      this.vorteil_to_add['hatstufen'] = true;
    }
    this.vorteil_to_add['kosten'] = kosten;
    this.werte.ap_werte += Number(kosten);
    this.werte.vun.push(this.vorteil_to_add);
    this.vorteil_to_add = {
      name: '',
      stufe: 1,
      kategorie: '',
      spezifikation: '',
      kosten: 0,
      hatstufen: false,
    };
    this.vorteilIndex = 0;
    this.vorteilKatKosten = 0;
    this.vorteilChange();
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
    console.log(this.werte);
  }

  private getVuNEmpfehlungen(): void {
    this.vunNames = new Map();
    this.infos.spezies['typischevorteile'].concat(this.infos.kultur['typischevorteile'])
      .concat(this.infos.profession['typischevorteile']).concat(this.infos.spezies['typischenachteile'])
      .concat(this.infos.kultur['typischenachteile']).concat(this.infos.profession['typischenachteile']).forEach(v => {
        this.vunNames.set(v['name'], 'typisch');
    });
    this.infos.spezies['untypischevorteile'].concat(this.infos.kultur['untypischevorteile'])
      .concat(this.infos.profession['untypischevorteile']).concat(this.infos.spezies['untypischenachteile'])
      .concat(this.infos.kultur['untypischenachteile']).concat(this.infos.profession['untypischenachteile']).forEach(v => {
      this.vunNames.set(v['name'], 'untypisch');
    });
    // console.log(this.vunNames);
  }

  private steigerungOfFertigkeit(name: string): string {
    console.log('suche steigerung von',name);
    let steigerung = '';
    this.infos.talente_koerper.concat(this.infos.talente_gesellschaft)
      .concat(this.infos.talente_natur).concat(this.infos.talente_wissen).concat(this.infos.talente_handwerk)
      .concat(this.infos.magie).concat(this.infos.geweiht).concat(this.infos.kampftechniken).forEach(f => {
       if (f['name'] === name) {
         console.log('passende fertigkeit:', f);
         steigerung = f['steigerung'];
       }
    });
    return steigerung;
  }

  private apOfVun(vun: any): number {
    console.log('apOfVun', vun);
    let ap = 0;
    const v = this.getVuN(vun['name']);
    if (v != null) {
      console.log('vun aus katalog:', v);
      if (v['kategorie_kosten'].length === 0) {
        console.log(v['name'], 'hat normale kosten');
        if (vun['stufen'].length > 0) {
          ap = v.kosten * vun['stufen'][0];
        } else {
          ap = v.kosten;
        }
      } else {
        console.log(v['name'], 'hat',v['kategorie_kosten'].length,'kategorien');
        if (v.kategorie_kosten[0]['kategorie'] === 'Fertigkeit' || v.kategorie_kosten[0]['kategorie'] === 'Kampftechnik') {
          console.log('die kategorien sind der art Fertigkeit oder Kampftechnik');
          const steigerung = this.steigerungOfFertigkeit(vun['spezialisierungen'][0]);
          console.log('steigerung ist', steigerung);
          v.kategorie_kosten.forEach(k => {
            if (k['stufe'] === steigerung) {
              console.log('passende kategorie:',k);
              ap = k['kosten'];
            }
          });
        } else {
          console.log('die kategorien sind NICHT der art Fertigkeit oder Kampftechnik');
          console.log(vun);
          v.kategorie_kosten.forEach(k => {
            if (k['stufe'] === vun['spezialisierungen'][0]) {
              console.log('gefundene kategorie:',k);
              ap = k['kosten'];
            }
          });
        }
      }

    } else {
      console.error(vun['name'], 'hat keinen VuN aus katalog!')
    }
    return ap;
  }

  private extractVuNOfSpezies() {
    if (!this.werte.vun_of_spezies) {
      const spezies = this.infos['spezies'];
      console.log('extractVuNOfSpezies', spezies);
      console.log('automatische vorteile');
      spezies['automatischevorteile'].forEach(v => {
        let stufe = 1;
        let hatstufen = false;
        if (v['stufen'].length > 0) {
          stufe = v['stufen'][0];
          hatstufen = true;
        }
        const vun = {
          name: v.name,
          stufe: stufe,
          kategorie: '',
          spezifikation: '',
          kosten: 0,
          hatstufen: hatstufen,
        };
        this.werte.vun.push(vun);
      });

      console.log('dringende empfohlene vor- und nachteile');
      spezies['dringendempfohlenevorteile'].concat(spezies['dringendempfohlenenachteile']).forEach(v => {
        if (v['spezialisierungen'].length > 1) {
          console.log(v['name'],' hat mehrere spezialisierungen');
          console.log('convertiere aus ', v);
          v['spezialisierungen'].forEach(spez => {
            const v_s = {
              name: v['name'],
              spezialisierungen: [spez],
              stufen: v['stufen'],
            };
            console.log('->', v_s);
            let stufe = 1;
            let hatstufen = false;
            if (v_s['stufen'].length > 0) {
              stufe = v_s['stufen'][0];
              hatstufen = true;
            }
            const kosten = this.apOfVun(v_s);
            console.log('kosten sind',kosten);
            let [kategorie, spezifikation] = this.getSpezielisierungUndKategorie(v_s);
            const vun = {
              name: v_s.name,
              stufe: stufe,
              kategorie: kategorie,
              spezifikation: spezifikation,
              kosten: kosten,
              hatstufen: hatstufen,
            };
            this.werte.vun.push(vun);
            this.werte.ap_werte += Number(kosten);
          });
        } else {
          console.log(v['name'],'hat nur eine spezialisierung');
          let stufe = 1;
          let hatstufen = false;
          if (v['stufen'].length > 0) {
            stufe = v['stufen'][0];
            hatstufen = true;
          }
          const kosten = this.apOfVun(v);
          console.log('kosten sind',kosten);
          let [kategorie, spezifikation] = this.getSpezielisierungUndKategorie(v);
          const vun = {
            name: v.name,
            stufe: stufe,
            kategorie: kategorie,
            spezifikation: spezifikation,
            kosten: kosten,
            hatstufen: hatstufen,
          };
          this.werte.vun.push(vun);
          this.werte.ap_werte += Number(kosten);
        }
      });
      this.werte.vun_of_spezies = true;
      sessionStorage.setItem('werte', JSON.stringify(this.werte));
    }
    console.log(this.werte);
  }

  private getVuN(name: string): any {
    let vun = null;
    this.infos.vun.forEach(v => {
      if (v['name'] === name) {
        vun = v;
      }
    });
    return vun;
  }

  quickVorteil(name: string) {
    let i = 0;
    this.infos.vun.forEach(v => {
      if (v['name'] === name) {
        this.vorteilIndex = i;
      }
      i++;
    });
    this.vorteilChange();
  }

  getSpezielisierungUndKategorie(vun): [string, string] {
    const katalog_vun = this.getVuN(vun.name);
    let spezifikation = '';
    let kategorie = '';
    if (katalog_vun['spezifizierung']) {
      spezifikation = vun['spezialisierungen'][0];
    } else {
      kategorie = vun['spezialisierungen'][0];
    }
    return [kategorie, spezifikation];
  }

  removeVuN(vun) {
    const temp = [];

    this.werte['vun'].forEach(v => {
      if (v['name'] !== vun['name'] ||
        v['stufe'] !== vun['stufe'] ||
        v['kategorie'] !== vun['kategorie'] ||
        v['spezifikation'] !== vun['spezifikation']) {
        temp.push(v);
      }
    });
    this.werte.ap_werte -= vun['kosten'];
    this.werte['vun'] = temp;
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
    console.log(this.werte);
  }

  public getKeys(index: number) {
    let tempList: string[][] = [];
    let tempChosenKeys: string[] = [];
    for (let i = 0; i < index; i++) {
      tempList[i] = this.sf_map[i];
      tempChosenKeys[i] = this.sf_chosenKeys[i];
    }
    this.sf_map = tempList;
    this.sf_chosenKeys = tempChosenKeys;

    let map = this.infos.sonderfertigkeiten;
    this.sf_chosenKeys.forEach(key => {
      map = map[key];
    });

    if (Object.keys(map).includes('list')) { // vorletzer Eintrag
      this.sf_list = [];
      map['list'].forEach(sf => {
        this.sf_list.push(sf['name']);
      });
      // this.sf_spezialisierungen.sort((a, b) => (this.replaceUmlaute(a['name']) < this.replaceUmlaute(b['name']) ? -1 : 1));
      /*
      this.sf_list.sort((a, b) => {
        if (a.startsWith('Weg')) {
          let a_name = a;
          let b_name = b;
          a_name = a_name.substring(a_name.indexOf(' ') + 1);
          a_name = a_name.substring(a_name.indexOf(' ') + 1);
          b_name = b_name.substring(b_name.indexOf(' ') + 1);
          b_name = b_name.substring(b_name.indexOf(' ') + 1);
          return (this.replaceUmlaute(a_name) < this.replaceUmlaute(b_name) ? -1 : 1);
        } else {
          return (this.replaceUmlaute(a) < this.replaceUmlaute(b) ? -1 : 1);
        }
      });
      */
      this.sf_index = 0;
      this.getSF();
    } else {
      this.sf_map[index] = [];
      Object.keys(map).forEach(k => {
        this.sf_map[index].push(k);
      });
      this.sf_chosenKeys[index] = this.sf_map[index][0];
      this.getKeys(index + 1);
    }
  }

  public getSF() {
    this.sf_to_add['kategorie'] = '';
    this.sf_to_add['spezifikation'] = '';
    let map = this.infos.sonderfertigkeiten;
    this.sf_chosenKeys.forEach(key => {
      map = map[key];
    });
    const list = map['list'];
    /*
    console.log(map['list']);
    list.sort((a, b) => {
      if (a['name'].startsWith('Weg')) {
        let a_name = a['name'];
        let b_name = b['name'];
        a_name = a_name.substring(a_name.indexOf(' ') + 1);
        a_name = a_name.substring(a_name.indexOf(' ') + 1);
        b_name = b_name.substring(b_name.indexOf(' ') + 1);
        b_name = b_name.substring(b_name.indexOf(' ') + 1);
        return (this.replaceUmlaute(a_name) < this.replaceUmlaute(b_name) ? -1 : 1);
      } else {
        return (this.replaceUmlaute(a['name']) < this.replaceUmlaute(b['name']) ? -1 : 1);
      }
    });
    */
    this.sf = list[this.sf_index];

    console.log(this.sf);

    if (this.sf['stufen'] > 0) {
      this.sf_to_add.stufe = 1;
    } else {
      this.sf_to_add.stufe = 0;
    }

    this.sf_types = Object.keys(this.sf);
    this.getSfSpezialisierungen();
  }

  /*
  Talent
  Gesellschaftstalent
  Handwerkstalent
  Körpertalent
  Naturtalent
  Wissenstalent
  Liturgie
  Zauber
  */

  public getSfSpezialisierungen(): void {
    let t = ['Talent','Gesellschaftstalent','Handwerkstalent','Körpertalent','Naturtalent','Wissenstalent','Liturgie','Zauber'];
    this.sf_spezialisierungen = [];
    this.sf_spez_index = 0;
    if (this.sf['spezifikation'] != null && this.sf['spezifikation'].length > 0) {
      if (this.sf['spezifikation'] === 'Talent') {
        this.infos.talente_koerper.concat(this.infos.talente_gesellschaft)
          .concat(this.infos.talente_natur).concat(this.infos.talente_wissen).concat(this.infos.talente_handwerk)
          .forEach(fertigkeit => {
            this.sf_spezialisierungen.push(fertigkeit);
        });
        this.sf_spezialisierungen.sort((a, b) => (this.replaceUmlaute(a['name']) < this.replaceUmlaute(b['name']) ? -1 : 1));
      } else if (this.sf['spezifikation'] === 'Gesellschaftstalent') {
        this.infos.talente_gesellschaft.forEach(fertigkeit => {
            this.sf_spezialisierungen.push(fertigkeit);
          });
      } else if (this.sf['spezifikation'] === 'Handwerkstalent') {
        this.infos.talente_handwerk.forEach(fertigkeit => {
          this.sf_spezialisierungen.push(fertigkeit);
        });
      } else if (this.sf['spezifikation'] === 'Körpertalent') {
        this.infos.talente_koerper.forEach(fertigkeit => {
          this.sf_spezialisierungen.push(fertigkeit);
        });
      } else if (this.sf['spezifikation'] === 'Naturtalent') {
        this.infos.talente_natur.forEach(fertigkeit => {
          this.sf_spezialisierungen.push(fertigkeit);
        });
      } else if (this.sf['spezifikation'] === 'Wissenstalent') {
        this.infos.talente_wissen.forEach(fertigkeit => {
          this.sf_spezialisierungen.push(fertigkeit);
        });
      } else if (this.sf['spezifikation'] === 'Liturgie') {
        this.infos.geweiht.forEach(fertigkeit => {
          if (fertigkeit['art'] === 'Liturgie') {
            this.sf_spezialisierungen.push(fertigkeit);
          }
        });
      } else if (this.sf['spezifikation'] === 'Zauber') {
        this.infos.magie.forEach(fertigkeit => {
          if (fertigkeit['art'] === 'Zauber' || fertigkeit['art'] === 'Ritual') {
            this.sf_spezialisierungen.push(fertigkeit);
          }
        });
      } else if (this.sf['spezifikation'] === 'Merkmal') {
        this.sf_to_add['spezifikation'] = this.merkmale[0];
      }
    }
    console.log(this.sf_spezialisierungen);
    this.getFertigkeitsspezialisierungen();
  }

  public getSfKosten() {
    if (this.sf['kreis'] != null) {
      if (this.sf['kreis'].includes('/')) {
        const split: number[] = this.sf['kreis'].split('/');
        this.sf_to_add['kdv'] = split[this.sf_to_add['stufe'] - 1];
      } else {
        this.sf_to_add['kdv'] = this.sf['kreis'];
      }
    } else {
      this.sf_to_add['kdv'] = 0;
    }

    let kosten = 0;
    if (this.sf['stufen'] === 0) {
      this.sf_to_add['hatstufen'] = false;
      if (this.sf['ap-wert'].includes('/')) {
        const steigerung_list: string[] = ['A', 'B', 'C', 'D'];
        const sf_kosten_list: number[] = this.sf['ap-wert'].split('/');
        const steigerung = this.sf_spezialisierungen[this.sf_spez_index]['steigerung'];
        const index: number = steigerung_list.indexOf(steigerung);
        kosten = sf_kosten_list[index];
      } else {
        kosten = this.sf['ap-wert'];
      }
    } else {
      this.sf_to_add['hatstufen'] = true;
      if (this.sf['ap-wert'].includes('|')) {
        const stufen_kosten: number[] = this.sf['ap-wert'].split('|');
        kosten = stufen_kosten[this.sf_to_add['stufe'] - 1];
      } else if (this.sf['ap-wert'].includes('/')) {
        const steigerung_list: string[] = ['A', 'B', 'C', 'D'];
        const sf_kosten_list: number[] = this.sf['ap-wert'].split('/');
        const steigerung = this.sf_spezialisierungen[this.sf_spez_index]['steigerung'];
        const index: number = steigerung_list.indexOf(steigerung);
        kosten = this.sf_to_add['stufe'] * sf_kosten_list[index];
      } else {
        kosten = this.sf_to_add['stufe'] * this.sf['ap-wert'];
      }
    }

    if (this.sf['bindungskosten'] != null) {
      if (this.sf['stufen'] === 0) {
        this.sf_to_add['pAsP'] = this.sf['bindungskosten'];
      } else {
        this.sf_to_add['pAsP'] = this.sf['bindungskosten'] * this.sf_to_add['stufe'];
      }
    } else {
      this.sf_to_add['pAsP'] = 0;
    }

    this.sf_to_add.kosten = kosten;
  }

  public getFertigkeitsspezialisierungen() {
    this.fertigkeitsspezialisierungen = [];
    if (this.sf['name'].startsWith("Fertigkeitsspezialisierung")) {
      const talent = this.sf_spezialisierungen[this.sf_spez_index];
      console.log(talent);
      talent['anwendungen'].forEach(anw => {
        if (anw['anwendung'].toLowerCase() === 'einzelne regionen') {
          this.einzenlneRegionen.forEach(r => {
            this.fertigkeitsspezialisierungen.push('Region: ' + r);
          });
        } else if (anw['anwendung'].toLowerCase() === 'einzelne götter') {
          this.goetter_kulte.forEach(g => {
            this.fertigkeitsspezialisierungen.push(g);
          });
        } else if (anw['anwendung'].toLowerCase() === 'Merkmal') {
          this.merkmale.forEach(g => {
            this.fertigkeitsspezialisierungen.push(g);
          });
        } else {
          this.fertigkeitsspezialisierungen.push(anw['anwendung']);
        }
        // this.fertigkeitsspezialisierungen.push(anw);
      });
    }
    this.setSFName();
    this.getSfKosten();
  }

  public set() {
    const message: Message = new Message('heldenerschaffung', this.msgprefix + 'set_', '',
      0, -1, this.msgprefix + 'set_' + JSON.stringify(this.werte));
    this.websocket.sendMessage(message)
    // this.getInfos();
  }

  public setSFName(): void {
    let name = this.sf['name'];
    if (name.includes('Fertigkeitsspezialisierung')) {
      name = 'Fertigkeitsspezialisierung';
    }
    if (this.sf['unterteilung'].includes('Berufsgeheimnis')) {
      name = 'Berufsgeheimnis';
      this.sf_to_add['spezifikation'] = this.sf['name'];
    } else {
      if (this.sf_spezialisierungen.length > 0) {
        this.sf_to_add['kategorie'] = this.sf_spezialisierungen[this.sf_spez_index]['name'];
        // name += ' ' + this.sf_spezialisierungen[this.sf_spez_index]['name'];
      }
      if (this.fertigkeitsspezialisierungen.length > 0) {
        this.sf_to_add['spezifikation'] = this.fertigkeitsspezialisierungen[this.fert_spez_index];
        // name += ' (' + this.fertigkeitsspezialisierungen[this.fert_spez_index]['anwendung']+ ')';
      }
    }

    /*
    if (this.sf['unterteilung'].includes('Berufsgeheimnis')) {
      name = this.sf['unterteilung'][1] + ': ' + this.sf['name'];
    }
    */
    this.sf_to_add['name'] = name;
    console.log(this.sf_to_add);
  }

  public addSF() {
    console.log(this.sf_to_add);
    let pAsP = this.sf_to_add['pAsP'];
    this.werte['pAsP'] += Number(pAsP);
    this.werte['kdv'] = Math.max(this.werte['kdv'], this.sf_to_add['kdv']);
    console.log(this.sf_to_add);

    this.werte.ap_werte += Number(this.sf_to_add['kosten']);
    this.werte.sf.push(this.sf_to_add);

    if (this.sf['unterteilung'].includes('Traditionsartefakt-Sonderfertigkeiten') && this.sf['volumen'] != null) {
      console.log(this.sf);
      this.sf_to_add['artefakt'] = this.sf['traditionsartefakt'];
      let artefakt;
      this.werte['traditionsartefakte'].forEach(a => {
        if (a['name'] === this.sf['traditionsartefakt']) {
          artefakt = a;
        }
      });
      let stufe = 1;
      if (this.sf_to_add['stufe'] > 1) {
        stufe = this.sf_to_add['stufe'];
      }
      if (artefakt == null) {
        artefakt = {
          name: this.sf['traditionsartefakt'], // volumen
          volumen: this.sf['volumen'] * stufe * -1,
        };
        this.werte['traditionsartefakte'].push(artefakt);
      } else {
        artefakt['volumen'] += this.sf['volumen'] * stufe * -1;
      }
      this.sf_to_add['volumen'] = this.sf['volumen'] * stufe * -1;
    }
    if (this.sf_to_add['name'] === 'Fertigkeitsspezialisierung') {
      this.addedFertigkeitsspezialisierung(this.sf_to_add['kategorie'], this.sf_to_add['spezifikation']);
    }

    this.sf_to_add = {
      name: this.sf_to_add.name,
      stufe: this.sf_to_add.stufe,
      kategorie: this.sf_to_add.kategorie,
      spezifikation: this.sf_to_add.spezifikation,
      kosten: this.sf_to_add.kosten,
      hatstufen: this.sf_to_add.hatstufen,
      pAsP: this.sf_to_add.pAsP,
      kdv: this.sf_to_add.kdv,
      volumen: this.sf_to_add.volumen,
      artefakt: this.sf_to_add.artefakt,
    };
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
    console.log(this.werte);
    this.maxFertWerte();
  }

  public addZauber() {
    let found = false;
    this.werte.zauber.forEach(z => {
      if (z['name'] === this.zauber_to_add['name'] && z['art'] === this.zauber_to_add['art']) {
        const erweiterungen = [];
        this.zauber_to_add['erweiterungen'].forEach(e => {
          const erweiterung = {
            name: e['erweiterung'],
            beschreibung: e['beschreibung'],
            fw_voraussetzung: e['fw_voraussetzung'],
            ap_kosten: e['ap_kosten'],
            gekauft: false,
          };
          erweiterungen.push(erweiterung);
        });
        z['erweiterungen'] = erweiterungen;
        found = true;
      }
    });
    if (!found) {
      this.werte.zauber.push(this.zauber_to_add);
    }
    this.werte.zauber.sort((a, b) => (a['name'] < b['name'] ? -1 : 1));
    let kosten: number = 0;
    const mult = this.kostenMultiplikator.get(this.zauber_to_add['steigerung']);
    kosten += mult;
    const erweiterungen = [];
    this.zauber_to_add['erweiterungen'].forEach(e => {
      if (e['gekauft']) {
        kosten += Number(e['ap_kosten']);
      }
      const erweiterung = {
        name: e['erweiterung'],
        beschreibung: e['beschreibung'],
        fw_voraussetzung: e['fw_voraussetzung'],
        ap_kosten: e['ap_kosten'],
        gekauft: false,
      };
      erweiterungen.push(erweiterung);
    });
    this.zauber_to_add = {
      name: this.zauber_to_add['name'],
      art: this.zauber_to_add['art'],
      fw: this.zauber_to_add['fw'],
      max: this.zauber_to_add['max'],
      min: this.zauber_to_add['min'],
      steigerung: this.zauber_to_add['steigerung'],
      attr_1: this.zauber_to_add['attr_1'],
      attr_2: this.zauber_to_add['attr_2'],
      attr_3: this.zauber_to_add['attr_3'],
      mod: this.zauber_to_add['mod'],
      beschreibung: this.zauber_to_add['beschreibung'],
      wirkung: this.zauber_to_add['wirkung'],
      wirkung_qs: this.zauber_to_add['wirkung_qs'],
      kosten: this.zauber_to_add['kosten'],
      kosten_erhaltung: this.zauber_to_add['kosten_erhaltung'],
      aktions_dauer: this.zauber_to_add['aktions_dauer'],
      reichweite: this.zauber_to_add['reichweite'],
      wirkungsdauer: this.zauber_to_add['wirkungsdauer'],
      zielkategorie: this.zauber_to_add['zielkategorie'],
      merkmal: this.zauber_to_add['merkmal'],
      verbreitungen: this.zauber_to_add['verbreitungen'],
      erweiterungen: erweiterungen,
    };
    this.werte.ap_werte += kosten;
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
    this.changeZauber();
  }

  public addOrtskenntnis() {
    this.werte.sf.push(this.ortskenntnis_to_add);
    this.werte.ortskenntnis_added = true;
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
    console.log(this.werte);
  }

  public addProfSfWithoutSpez(sf_prof: any) {
    const toAdd = {
      name: sf_prof.name,
      stufe: sf_prof.stufe,
      kategorie: sf_prof.kategorie,
      spezifikation: sf_prof.spezifikation,
      kosten: sf_prof.kosten,
      hatstufen: sf_prof.hatstufen,
      pAsP: sf_prof.pAsP,
      kdv: sf_prof.kdv,
      volumen: sf_prof.volumen,
      artefakt: sf_prof.artefakt,
    };
    const temp: any[] = [];
    this.werte.prof_sf_without_spez.forEach(p => {
      if (p['name'] !== sf_prof['name'] ||
        p['stufe'] !== sf_prof['stufe'] ||
        p['kategorie'] !== sf_prof['kategorie'] ||
        p['spezifikation'] !== sf_prof['spezifikation']) {
        temp.push(p);
      }
    });
    this.werte.prof_sf_without_spez = temp;
    if (toAdd['name'] === 'Fertigkeitsspezialisierung') {
      this.addedFertigkeitsspezialisierung(toAdd['kategorie'], toAdd['spezifikation']);
    }
    console.log(toAdd);
    this.werte.sf.push(toAdd);
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
    console.log(this.werte);
  }

  addedFertigkeitsspezialisierung(talent: string, anwendung: string): void {
    let standart_anwendungen: string[] = [];
    this.infos.talente_koerper.concat(this.infos.talente_gesellschaft)
      .concat(this.infos.talente_natur).concat(this.infos.talente_wissen).concat(this.infos.talente_handwerk)
      .forEach(fertigkeit => {
        fertigkeit['anwendungen'].forEach(anw => {
          standart_anwendungen.push(anw['anwendung']);
        });
    });

    this.werte.talente_koerper.concat(this.werte.talente_gesellschaft)
      .concat(this.werte.talente_natur).concat(this.werte.talente_wissen).concat(this.werte.talente_handwerk)
      .forEach(fertigkeit => {
        if (fertigkeit['name'] === talent) {
          if (!fertigkeit['anwendungen'].includes(anwendung)) {
            fertigkeit['anwendungen'].push(anwendung);
          }
        }
    });
  }

  removecFertigkeitsspezialisierung(talent: string, anwendung: string): void {
    let standart_anwendungen: string[] = [];
    this.infos.talente_koerper.concat(this.infos.talente_gesellschaft)
      .concat(this.infos.talente_natur).concat(this.infos.talente_wissen).concat(this.infos.talente_handwerk)
      .forEach(fertigkeit => {
        fertigkeit['anwendungen'].forEach(anw => {
          standart_anwendungen.push(anw['anwendung']);
        });
      });

    this.werte.talente_koerper.concat(this.werte.talente_gesellschaft)
      .concat(this.werte.talente_natur).concat(this.werte.talente_wissen).concat(this.werte.talente_handwerk)
      .forEach(fertigkeit => {
        if (fertigkeit['name'] === talent) {
          if (!standart_anwendungen.includes(anwendung)) {
            const temp: string[] = [];
            fertigkeit['anwendungen'].forEach(anw => {
              if (anw !== anwendung) {
                temp.push(anw);
              }
            });
            fertigkeit['anwendungen'] = temp;
          }
        }
      });
  }

  removeSF(sf) {
    let pAsP = this.sf_to_add['pAsP'];
    this.werte['pAsP'] -= pAsP;
    let kdv = 0;
    const temp = [];
    this.werte['sf'].forEach(s => {
      if (s['name'] !== sf['name'] ||
        s['stufe'] !== sf['stufe'] ||
        s['kategorie'] !== sf['kategorie'] ||
        s['spezifikation'] !== sf['spezifikation']) {
        temp.push(s);
        kdv = Math.max(s['kdv'], this.werte['kdv']);
      }
    });
    this.werte['kdv'] = kdv;

    this.werte.ap_werte -= sf['kosten'];
    this.werte['sf'] = temp;

    const artefaktList: string[] = [];
    this.werte['sf'].forEach(s => {
      if (!artefaktList.includes(s['artefakt'])) {
        artefaktList.push(s['artefakt']);
      }
    });

    const tempArtefakte: any[] = [];
    this.werte['traditionsartefakte'].forEach(a => {
      if (a['name'] === sf['artefakt']) {
        a['volumen'] -= sf['volumen'];
      }
      if (artefaktList.includes(a['name'])) {
        tempArtefakte.push(a);
      }
    });
    this.werte['traditionsartefakte'] = tempArtefakte;

    if (sf['name'] === 'Fertigkeitsspezialisierung') {
      this.removecFertigkeitsspezialisierung(sf['kategorie'], sf['spezifikation']);
    }

    sessionStorage.setItem('werte', JSON.stringify(this.werte));
    console.log(this.werte);
  }

  private extractKultur(): void {
    if (!this.werte.kultur_extracted) {
      this.werte.sprachen = [];
      this.werte.schriften = [];

      this.infos['sprachen'].forEach(sprache => {
        let stufe = 0;
        let mutterspache = false;
        if (this.infos['kultur']['sprachen'].includes(sprache['name'])) {
          stufe = sprache['max_stufe'];
          mutterspache = true;
        }
        const s = {
          name: sprache['name'],
          max_stufe: sprache['max_stufe'],
          beschreibung: sprache['beschreibung'],
          anmerkung: sprache['anmerkung'],
          stufe: stufe,
          muttersprache: mutterspache,
        }
        this.werte.sprachen.push(s);
      });

      this.infos['schriften'].forEach(schrift => {
        let kulturschrift = false;
        this.infos['kultur']['schriften'].forEach(s => {
          if (s['name'] === schrift['name']) {
            kulturschrift = true;
          }
        });
        const s = {
          name: schrift['name'],
          steigerungskosten: schrift['steigerungskosten'],
          alphabet: schrift['alphabet'],
          sprachen: schrift['sprachen'],
          stufe: 0,
          kulturschrift: kulturschrift,
        }
        this.werte.schriften.push(s);
      });

      this.infos.profession['sonderfertigkeiten'].forEach(prof_sf => {
        if (prof_sf['name'].startsWith('Sprachen')) {
          this.werte.sprachen_sf = prof_sf;
        }
      });
      this.infos.kultur['talent_modifikationen'].forEach(mod => {
        this.werte.talente_koerper.concat(this.werte.talente_gesellschaft)
          .concat(this.werte.talente_natur).concat(this.werte.talente_wissen).concat(this.werte.talente_handwerk)
          .forEach(fertigkeit => {
            if (fertigkeit['name'] === mod['name']) {
              fertigkeit['fw'] += mod['wert'];
            }
          });
      });

    }

  }

  private extractSfOfProfession() {
    if (!this.werte.sf_of_profession) {
      this.infos.profession['sonderfertigkeiten'].forEach(prof_sf => {
        if (prof_sf['name'] === 'Fertigkeitsspezialisierung') {
          prof_sf['spezialisierungen'].forEach((talent_name: string) => {
            let talent;
            let anwendungen: string[] = [];
            this.infos.talente_koerper.concat(this.infos.talente_gesellschaft)
              .concat(this.infos.talente_natur).concat(this.infos.talente_wissen).concat(this.infos.talente_handwerk)
              .forEach(fertigkeit => {
                if (fertigkeit['name'] === talent_name) {
                  talent = fertigkeit;
                }
              });
            talent.anwendungen.forEach(anw => {
              if (anw['anwendung'].toLowerCase() === 'einzelne regionen') {
                this.einzenlneRegionen.forEach(r => {
                  anwendungen.push('Region: ' + r);
                });
              } else if (anw['anwendung'].toLowerCase() === 'einzelne götter') {
                this.goetter_kulte.forEach(g => {
                  anwendungen.push(g);
                });
              } else if (anw['anwendung'].toLowerCase() === 'Merkmal') {
                this.merkmale.forEach(g => {
                  anwendungen.push(g);
                });
              } else {
                anwendungen.push(anw['anwendung']);
              }
            });
            const steigerung = talent['steigerung'];
            const steigerung_list: string[] = ['A', 'B', 'C', 'D'];
            const sf_kosten_list: number[] = [1, 2, 3, 4];
            const index: number = steigerung_list.indexOf(steigerung);
            const kosten = sf_kosten_list[index];
            const prof_sf_to_add: any = {
              name: 'Fertigkeitsspezialisierung',
              stufe: 1,
              kategorie: talent_name,
              spezifikation: anwendungen[0],
              kosten: kosten,
              hatstufen: false,
              pAsP: 0,
              kdv: 0,
              volumen: 0,
              artefakt: '',
              anwendungen: anwendungen,
            };
            this.werte.prof_sf_without_spez.push(prof_sf_to_add);
          });
        } else if (!prof_sf['name'].startsWith('Sprachen')) {
          let kosten_string ='';
          let info_sf;
          this.infos.all_sonderfertigkeiten.forEach(s => {
            if (s['name'] === prof_sf.name) {
              kosten_string = s['ap-wert'];
              info_sf = s;
            }
          });
          if (info_sf != null) {
            let kosten = 0;
            let kosten_list = [];
            if (kosten_string.includes('|')) {
              kosten_list = kosten_string.split('|');
            } else {
              kosten = Number(kosten_string);
            }
            let hatStufen = false;

            if (prof_sf['stufe'] > 0) {
              hatStufen = true;
              if (kosten_list.length === 0) {
                kosten *= prof_sf['stufe'];
              } else {
                kosten = kosten_list[prof_sf['stufe'] - 1];
              }
            }
            let spezifikation = '';
            if (prof_sf['spezialisierungen'].length > 0) {
              spezifikation = prof_sf['spezialisierungen'][0];
            }
            let artefakt_to_add = '';
            let volumen = 0;
            console.log(info_sf);
            if (info_sf['unterteilung'].includes('Traditionsartefakt-Sonderfertigkeiten') && info_sf['volumen'] != null) {
              artefakt_to_add = info_sf['traditionsartefakt'];

              let artefakt;
              this.werte['traditionsartefakte'].forEach(a => {
                if (a['name'] === info_sf['traditionsartefakt']) {
                  artefakt = a;
                }
              });
              let stufe = 1;
              if (prof_sf['stufe'] > 1) {
                stufe = prof_sf['stufe'];
              }
              if (artefakt == null) {
                artefakt = {
                  name: info_sf['traditionsartefakt'], // volumen
                  volumen: info_sf['volumen'] * stufe * -1,
                };
                this.werte['traditionsartefakte'].push(artefakt);
              } else {
                artefakt['volumen'] += info_sf['volumen'] * stufe * -1;
              }
              volumen = info_sf['volumen'] * stufe * -1;

            }

            const toAdd = {
              name: prof_sf.name,
              stufe: prof_sf.stufe,
              kategorie: '',
              spezifikation: spezifikation,
              kosten: kosten,
              hatstufen: hatStufen,
              pAsP: '',
              kdv: '',
              volumen: volumen,
              artefakt: artefakt_to_add,
            };
            this.werte.sf.push(toAdd);
          }

        }
      });
      const talentarten: string[] = ['gesellschaft', 'natur', 'handwerk', 'wissen', 'koerper'];
      talentarten.forEach(art => {
        this.infos.profession['talente_' + art].forEach(mod => {
          this.werte['talente_' + art].forEach(fertigkeit => {
            if (fertigkeit['name'] === mod['name']) {
              fertigkeit['fw'] += mod['wert'];
              fertigkeit['min'] = fertigkeit['fw'];
            }
          });
        });
      });

      this.infos.profession['kampftechniken'].forEach(kampftechnik => {
        if (kampftechnik['talente'].length === 1) {
          const name: string = kampftechnik['talente'][0];
          const wert: number = kampftechnik['werte'][0];
          this.werte['kampftechniken'].forEach(fertigkeit => {
            if (fertigkeit['name'] === name) {
              fertigkeit['fw'] = wert;
              fertigkeit['min'] = fertigkeit['fw'];
              fertigkeit['standard'] = fertigkeit['fw'];
            }
          });
        } else {
          let id = 0;
          kampftechnik['werte'].forEach(fw => {
            const kt_mod = {
              id: id,
              mod: fw,
              kt: [],
              choice: '',
            };
            kampftechnik['talente'].forEach(kt => {
              kt_mod['kt'].push(kt);
            });
            this.initialKtChoice(kt_mod, id);
            this.werte.ktMods.push(kt_mod);
            id ++;
          });
        }
      });
      console.log(this.werte.ktMods);

      console.log()

      const max_talent: number = this.infos['erfahrung']['max_wert_fertigkeit'];

      const zauber_list = this.infos['profession']['zauber'];
      console.log(zauber_list);
      zauber_list.forEach(z => {
        const name = z['fertigkeiten'][0]['name'];
        const zauber_info = this.getMagischeFertigkeit(name);
        console.log(zauber_info);
        const erweiterungen = [];
        zauber_info['erweiterungen'].forEach(e => {
          const erweiterung = {
            name: e['erweiterung'],
            beschreibung: e['beschreibung'],
            fw_voraussetzung: e['fw_voraussetzung'],
            ap_kosten: e['ap_kosten'],
            gekauft: false,
          };
          erweiterungen.push(erweiterung);
        });
        let max_fw = Math.min(max_talent, 14);
        const zauber = {
          name: name,
          art: zauber_info['art'],
          fw: z['werte'][0],
          max: max_fw,
          min: z['werte'][0],
          steigerung: zauber_info['steigerung'],
          attr_1: zauber_info['attr_1'],
          attr_2: zauber_info['attr_2'],
          attr_3: zauber_info['attr_3'],
          mod: zauber_info['mod'],
          beschreibung: zauber_info['beschreibung'],
          wirkung: zauber_info['wirkung'],
          wirkung_qs: zauber_info['wirkung_qs'],
          kosten: zauber_info['kosten'],
          kosten_erhaltung: zauber_info['kosten_erhaltung'],
          aktions_dauer: zauber_info['aktions_dauer'],
          reichweite: zauber_info['reichweite'],
          wirkungsdauer: zauber_info['wirkungsdauer'],
          zielkategorie: zauber_info['zielkategorie'],
          merkmal: zauber_info['merkmal'],
          verbreitungen: zauber_info['verbreitungen'],
          erweiterungen: erweiterungen,
        };
        this.werte['zauber'].push(zauber);
      });
      console.log(this.werte['zauber']);


      this.werte.sf_of_profession = true;
      sessionStorage.setItem('werte', JSON.stringify(this.werte));
    }


  }

  private getMagischeFertigkeit(name: string): any {
    let wanted: any;
    this.infos['magie'].forEach(data => {
      if (data['name'] === name) {
        wanted = data;
      }
    });
    return wanted;
  }
  private getZaubertrick(name: string): any {
    let wanted: any;
    this.infos['zaubertricks'].forEach(data => {
      if (data['name'] === name) {
        wanted = data;
      }
    });
    return wanted;
  }
  private getGeweihteFertigkeit(name: string): any {
    let wanted: any;
    this.infos['geweiht'].forEach(data => {
      if (data['name'] === name) {
        wanted = data;
      }
    });
    return wanted;
  }
  private getSegen(name: string): any {
    let wanted: any;
    this.infos['segen'].forEach(data => {
      if (data['name'] === name) {
        wanted = data;
      }
    });
    return wanted;
  }


  public replaceUmlaute(str: string): string {
    let umlaute: string[] = ['Ä', 'Ö', 'Ü', 'ä', 'ö', 'ü', 'ß'];
    let replacement: string[] = ['Ae', 'Oe', 'Ue', 'ae', 'oe', 'ue', 'ss'];
    for (let i = 0; i < umlaute.length; i++) {
      while (str.includes(umlaute[i])) {
        str = str.replace(umlaute[i], replacement[i]);
      }
    }
    return str;
  }

  public buyPAsPBack() {
    if (this.werte['pAsP'] > 0 && this.werte['pAsPBack'] < this.werte['pAsP']) {
      this.werte['pAsPBack']++;
      this.werte['ap_werte'] += Number(2);
    }
  }

  public buyPAsPBackRevert() {
    if (this.werte['pAsPBack'] > 0) {
      this.werte['pAsPBack']--;
      this.werte['ap_werte'] -= Number(2);
    }
  }

  public getSchriftenUndSprachenAp() {
    if (this.sprachen_ap > 0) {
      this.werte['ap_werte'] -= this.sprachen_ap;
    }
    let kosten: number = -this.werte.sprachen_sf['stufe'];
    this.werte.sprachen.forEach(sprache => {
      let stufe: number = sprache['stufe'];
      if (sprache['muttersprache']) {
        stufe = sprache['stufe'] - sprache['max_stufe'];
      }
      kosten += stufe * 2;
    });
    this.werte.schriften.forEach(schrift => {
      let stufe: number = schrift['stufe'];
      kosten += stufe * Math.round((schrift['steigerungskosten'] / 2));
    });
    this.sprachen_ap = kosten;
    if (this.sprachen_ap > 0) {
      this.werte['ap_werte'] += this.sprachen_ap;
    }
  }

  private extractInfos() {
    if (!this.werte.infos_extracted) {
      const max_talent: number = this.infos['erfahrung']['max_wert_fertigkeit'];
      const max_kt: number  = this.infos['erfahrung']['max_wert_kampftechnik'];
      const talentarten: string[] = ['gesellschaft', 'natur', 'handwerk', 'wissen', 'koerper']; // kampftechniken
      talentarten.forEach(art => {
        this.infos['talente_' + art].forEach(t => {
          const anw_list: string[] = [];
          t['anwendungen'].forEach(anw => {
            if (anw['ap_kosten'] === 0) {
              anw_list.push(anw['anwendung']);
            }
          });
          const talent = {
            name: t['name'],
            be: t['be'],
            attr_1: t['attr_1'],
            attr_2: t['attr_2'],
            attr_3: t['attr_3'],
            steigerung: t['steigerung'],
            beschreibung: t['beschreibung'],
            anwendungen: anw_list,
            fw: 0,
            max: max_talent,
            min: 0,
          };
          this.werte['talente_' + art].push(talent);
        });
      });
      this.infos['kampftechniken'].forEach(k => {
        const le_split = k['le'].split('/');
        const leiteig: string[] = [];
        le_split.forEach(le => {
          leiteig.push(le);
        });
        let le_alt = '';
        if (le_split.length > 1) {
          le_alt = le_split[1];
        }
        const kampftechnik = {
          name: k['name'],
          le: leiteig,
          nk: k['nk'],
          bruchfaktor: k['bruchfaktor'],
          steigerung: k['steigerung'],
          beschreibung: k['beschreibung'],
          besonderheiten: k['besonderheiten'],
          fw: 6,
          max: max_kt,
          min: 6,
          standard: 6,
        };
        this.werte['kampftechniken'].push(kampftechnik);
      });
    }
    this.werte.infos_extracted = true;
  }

  modificateFertigkeit(fertigkeit, mod: number) {
    console.log('modificateFertigkeit(',fertigkeit['name'], ')',mod);
    console.log(fertigkeit);
    const mult = this.kostenMultiplikator.get(fertigkeit['steigerung']);
    let wert: number = fertigkeit['fw'];
    if (mod > 0) {
      wert++;
    }
    if (wert > 0 && wert < this.kosten_A_bis_D.length) {
      const kosten = this.kosten_A_bis_D[wert] * mod * mult;
      console.log(kosten);
      this.werte.ap_werte += kosten;
      fertigkeit['fw'] += mod;
    }
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
  }

  modificateKampftechnik(fertigkeit, mod: number) {
    console.log('modificateFertigkeit(',fertigkeit['name'], ')',mod);
    console.log(fertigkeit);
    const mult = this.kostenMultiplikator.get(fertigkeit['steigerung']);
    let wert: number = fertigkeit['fw'];
    if (mod > 0) {
      wert++;
    }
    if (wert > 0 && wert < this.kosten_A_bis_D.length) {
      const kosten = this.kosten_A_bis_D[wert] * mod * mult;
      console.log(kosten);
      this.werte.ap_kampftechniken += kosten;
      fertigkeit['fw'] += mod;
    }
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
  }

  public navZurueck(): void {
    this.werte.nav --;
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
  }
  public navWeiter(): void {
    this.werte.nav ++;
    sessionStorage.setItem('werte', JSON.stringify(this.werte));
  }

  public parentZurueck() {
    this.zurueck.emit();
  }
  public parentWeiter() {
    this.set();
    // this.weiter.emit();
  }

  private initialKtChoice(kt_mod, id: number) {
    kt_mod['choice'] = kt_mod['kt'][id];
    this.werte.kampftechniken.forEach(kt => {
      if (kt['name'] === kt_mod['choice']) {
        kt['fw'] = kt_mod['mod'];
      }
    });

  }

  public getAttrWert(name: string): number {
    let wert = 0;
    this.werte.attributes.forEach(a => {
      if (a['name'] === name) {
        wert = Number(a['wert']);
      }
    });
    return wert;
  }

  public maxKtWerte() {
    this.werte['kampftechniken'].forEach(kt => {
      let le_wert = this.getAttrWert(kt['le'][0]);
      if (kt['le'].length > 1) {
        le_wert = Math.max(le_wert, this.getAttrWert(kt['le'][1]));
      }
      kt['max'] = Math.min((le_wert + 2), this.infos['erfahrung']['max_wert_kampftechnik']);
    });
  }

  public maxFertWerte() {
    /*
    talente_koerper: [],
    talente_gesellschaft: [],
    talente_natur: [],
    talente_wissen: [],
    talente_handwerk: [],
    zauber: [],
    liturgien: [],
    */
    const max_fw_erfahrung = this.infos['erfahrung']['max_wert_fertigkeit'];
    this.werte.talente_koerper.concat(this.werte.talente_gesellschaft)
        .concat(this.werte.talente_natur).concat(this.werte.talente_wissen).concat(this.werte.talente_handwerk)
        .concat(this.werte.liturgien).forEach(f => {
      let max_attr_wert = 100;
      for (let i = 1; i <= 3; i++) {
        const attr = f['attr_' + i];
        max_attr_wert = Math.max(this.getAttrWert(attr), max_attr_wert);
      }
      f['max'] = Math.min(max_attr_wert + 2, max_fw_erfahrung);
    });
    this.werte.zauber.forEach(f => {
      let max_attr_wert = 14;
      const merkmale: string[] = [];
      this.werte.sf.forEach(sf => {
        if (sf['name'].startsWith('Merkmalskenntnis')) {
          merkmale.push(sf['spezifikation']);
        }
      });
      if (merkmale.includes(f['merkmal'])) {
        max_attr_wert = 100;
      }

      for (let i = 1; i <= 3; i++) {
        const attr = f['attr_' + i];
        max_attr_wert = Math.max(this.getAttrWert(attr), max_attr_wert);
      }
      f['max'] = Math.min(max_attr_wert + 2, max_fw_erfahrung);
    });
  }

  public kampftechnikChoice(kt_mod) {
    this.werte.ap_kampftechniken = 0;
    console.log(kt_mod);
    const free: Set<string> = new Set<string>();
    kt_mod['kt'].forEach(name => {
      free.add(name);
    });
    this.werte['ktMods'].forEach(werte_kt_mod => {
      free.delete(werte_kt_mod['choice']);
    });
    const iterator = free.values();
    const first = iterator.next();
    this.werte['ktMods'].forEach(werte_kt_mod => {
      if (werte_kt_mod['id'] !== kt_mod['id']) {
        if (werte_kt_mod['choice'] === kt_mod['choice']) {
          werte_kt_mod['choice'] = first.value;
        }
      }
    });
    this.werte.kampftechniken.forEach(kt => {
      kt['fw'] = kt['standard'];
      kt['min'] = kt['standard'];
    });
    this.werte.kampftechniken.forEach(kt => {
      this.werte['ktMods'].forEach(werte_kt_mod => {
        console.log(werte_kt_mod);
        if (kt['name'] === werte_kt_mod['choice']) {
          kt['fw'] = werte_kt_mod['mod'];
          kt['min'] = werte_kt_mod['mod'];
        }
      });
    });
  }

  public getAtWert(fw: number, attr: string): number {
    const attr_wert: number = Math.max(0, this.getAttrWert(attr) - 8);
    const attr_zusatz = Math.floor(attr_wert / 3);
    return fw + attr_zusatz;
  }

  public getPaWert(fw: number, attr: string): number {
    const le_wert: number = Math.ceil(fw / 2.0);
    const attr_wert: number = Math.max(0, this.getAttrWert(attr) - 8);
    const attr_zusatz = Math.floor(attr_wert / 3);
    return le_wert + attr_zusatz;
  }


  public changeZauber() {
    const max_talent: number = this.infos['erfahrung']['max_wert_fertigkeit'];
    const zauber = this.infos.magie[this.zauber_index];
    const erweiterungen = [];
    zauber['erweiterungen'].forEach(e => {
      const erweiterung = {
        name: e['erweiterung'],
        beschreibung: e['beschreibung'],
        fw_voraussetzung: e['fw_voraussetzung'],
        ap_kosten: e['ap_kosten'],
        gekauft: false,
      };
      erweiterungen.push(erweiterung);
    });
    let max_fw = Math.min(max_talent, 14);
    this.zauber_to_add = {
      name: zauber['name'],
      art: zauber['art'],
      fw: 0,
      max: max_fw,
      min: 0,
      steigerung: zauber['steigerung'],
      attr_1: zauber['attr_1'],
      attr_2: zauber['attr_2'],
      attr_3: zauber['attr_3'],
      mod: zauber['mod'],
      beschreibung: zauber['beschreibung'],
      wirkung: zauber['wirkung'],
      wirkung_qs: zauber['wirkung_qs'],
      kosten: zauber['kosten'],
      kosten_erhaltung: zauber['kosten_erhaltung'],
      aktions_dauer: zauber['aktions_dauer'],
      reichweite: zauber['reichweite'],
      wirkungsdauer: zauber['wirkungsdauer'],
      zielkategorie: zauber['zielkategorie'],
      merkmal: zauber['merkmal'],
      verbreitungen: zauber['verbreitungen'],
      erweiterungen: erweiterungen,
    };
  }
}
