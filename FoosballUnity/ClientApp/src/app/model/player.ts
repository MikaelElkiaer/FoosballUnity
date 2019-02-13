export class Player {
  name: string;
  playerReady: boolean;
  createdUtc: Date;
  registeredRFIDTag: string;

  constructor(name: string, playerReady: boolean, createdUtc: Date, registeredRFIDTag: string) {
    this.name = name;
    this.playerReady = playerReady;
    this.createdUtc = createdUtc;
    this.registeredRFIDTag = registeredRFIDTag;
  }
}
