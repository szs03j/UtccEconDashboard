import {DcChartType} from './dc-chart-type.enum';

export class DcChartOptions {
  constructor ( n: string, ct: DcChartType, opts: any ) {
    this.name       = n;
    this.chartType  = ct;
    this.options    = opts;
  }

  name:      string;
  chartType: DcChartType;
  options:   any;

  compositeOptions = new Array<DcChartOptions>();
}
