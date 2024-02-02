export class Fighter {
  name: string;
  id: number;
  portrait: string;
  token: string;

  copy(other: Fighter): void {
    this.name = other.name ?? this.name;
    this.id = other.id ?? this.id;
    this.portrait = other.portrait ?? this.portrait;
    this.token = other.token ?? this.token;
  }
}
