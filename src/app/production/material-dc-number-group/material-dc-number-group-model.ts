
import { Observable, merge } from 'rxjs';
import { NumberGroupChartModel } from '../number-group-chart/number-group-chart-model';

export class MaterialDcNumberGroupModel {
  public title;
  public subtitle;

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
