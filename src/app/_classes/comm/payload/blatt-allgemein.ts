export class BlattAllgemein {
  name: string;
  rasse: string;
  kultur: string;
  profession: string;
  groesse: number;
  gewicht: number;
  augenfarbe: string;
  haarfarbe: string;
  geschlecht: string;
  alter: number;
  sozialer_stand: number;
  titel: string;

  copy(other: BlattAllgemein): void {
    this.name = other.name ?? this.name;
    this.rasse = other.rasse ?? this.rasse;
    this.kultur = other.kultur ?? this.kultur;
    this.profession = other.profession ?? this.profession;
    this.groesse = other.groesse ?? this.groesse;
    this.gewicht = other.gewicht ?? this.gewicht;
    this.augenfarbe = other.augenfarbe ?? this.augenfarbe;
    this.haarfarbe = other.haarfarbe ?? this.haarfarbe;
    this.geschlecht = other.geschlecht ?? this.geschlecht;
    this.alter = other.alter ?? this.alter;
    this.sozialer_stand = other.sozialer_stand ?? this.sozialer_stand;
    this.titel = other.titel ?? this.titel;
  }

  dummyValues(): void {
    this.name = 'Alrik';
    this.rasse = 'Mensch';
    this.kultur = 'Mittelreicher';
    this.profession = 'Bauer';
    this.groesse = 186;
    this.gewicht = 80;
    this.augenfarbe = 'grün';
    this.haarfarbe = 'blond';
    this.geschlecht = 'männlich';
    this.alter = 18;
    this.sozialer_stand = 1;
    this.titel = '';
  }
}
