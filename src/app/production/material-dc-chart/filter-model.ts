export class FilterModel {

  constructor(n: string, g: any, d: any) {
    this.name = n;
    this.group = g;
    this.dimension = d;
  }

  public name: string;
  public dimension: any;
  public group: any;
  public selectMultipleEnabled = true;
  public selectAllEnabled = true;
  public selectDefault: any;
}
