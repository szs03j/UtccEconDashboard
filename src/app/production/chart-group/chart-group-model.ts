
export class ChartGroupModel {
  constructor( t: string, i: string ) {
    this.title = t;
    this.id = i;
  }
  public title: string;
  public id: string;
  public chartModels = new Array<any>();
}
