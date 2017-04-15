export class Player {
  name: string;
  playerReady: boolean;
  oprettet: Date;
  registeredRFIDTag : string;

  constructor(name: string, playerReady: boolean, oprettet: Date, registeredRFIDTag : string) {
    this.name = name;
    this.playerReady = playerReady;
    this.oprettet = oprettet;
    this.registeredRFIDTag = registeredRFIDTag;
  }
}
