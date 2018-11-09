
import { ChartGroupItemModel } from '../chart-group/chart-group-item-model';
import { ChartGroupItemModelType } from '../chart-group/chart-group-item-model-type.enum';
import { Observable, merge } from 'rxjs';
import { NumberGroupChartModel } from '../number-group-chart/number-group-chart-model';

export class MaterialDcNumberGroupModel implements ChartGroupItemModel {
  public title;
  public subtitle;

  public readonly modelType = ChartGroupItemModelType.MaterialDcNumberGroup;
  public numberDisplays: Array<NumberGroupChartModel> = new Array<NumberGroupChartModel>();

  // merging all of the subcharts 'chartloadedchange()' observables into 1 observable
  public chartLoadedChange(): Observable<boolean> {
    let t = new Observable<boolean>();
    this.numberDisplays.forEach((d) => {
      t = merge(t, d.chartLoadedChange());
    });
    return t;
  }

}
