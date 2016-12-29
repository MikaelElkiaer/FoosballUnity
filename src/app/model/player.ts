export class Player {
  name: string;
  playerReady: boolean;
  oprettet: Date;

  constructor(name: string, playerReady: boolean, oprettet: Date) {
    this.name = name;
    this.playerReady = playerReady;
    this.oprettet = oprettet;
  }
}
