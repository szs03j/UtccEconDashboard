import { MaterialDcChartModel } from '../material-dc-chart/material-dc-chart-model';

export class ChartGroupModel {
  constructor( t: string ) {
    this.title = t;
  }
  public title: string;
  public chartModels = new Array<MaterialDcChartModel>();
}
