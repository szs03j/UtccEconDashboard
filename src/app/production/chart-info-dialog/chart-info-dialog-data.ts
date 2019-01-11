export class ChartInfoDialogData {
  constructor(t: string, s: string, d: string) {
    this.title = t;
    this.subtitle = s;
    this.description = d;
  }

  title: string;
  subtitle: string;
  description: string;
}
