import { DcChartModel } from '../dc-chart/dc-chart-model';
import { FilterModel } from './filter-model';
export class MaterialDcChartModel extends DcChartModel {
  public title;
  public subtitle;

  public filterItems: Array<FilterModel> = new Array<FilterModel>();

}
