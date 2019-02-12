export class TrainingResult {
  name: string;
  daysTrained: number;

  constructor(name: string, daysTrained: number) {
    this.name = name;
    this.daysTrained = daysTrained;
  }
}
