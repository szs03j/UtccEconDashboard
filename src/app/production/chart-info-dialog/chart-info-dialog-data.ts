export class ChartInfoDialogData {
  constructor(t: string, s: string, d: Array<string>) {
    this.title = t;
    this.subtitle = s;
    this.description = d;
  }

  title: string;
  subtitle: string;
  description: Array<string>;
}
