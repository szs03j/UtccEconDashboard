export class ChartInfoDialogData {
  constructor(t: string, s: string, d: Array<string>, dfn: string) {
    this.title = t;
    this.subtitle = s;
    this.description = d;
    this.dlFilename = dfn;
  }

  title: string;
  subtitle: string;
  dlFilename: string;
  description: Array<string>;
}
