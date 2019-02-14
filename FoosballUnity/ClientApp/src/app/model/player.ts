export class Player {
  name: string;
  playerReady: boolean;
  createdUtc: Date;

  constructor(name: string, playerReady: boolean, createdUtc: Date) {
    this.name = name;
    this.playerReady = playerReady;
    this.createdUtc = createdUtc;
  }
}
