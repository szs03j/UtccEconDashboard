
export class ChartGroupModel {
  constructor( t: string ) {
    this.title = t;
  }
  public title: string;
  public chartModels = new Array<any>();
}
