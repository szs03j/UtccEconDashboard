import { DcChartModel } from '../dc-chart/dc-chart-model';
import { FilterModel } from './filter-model';
import { ChartInfoDialogData } from '../chart-info-dialog/chart-info-dialog-data';

export class MaterialDcChartModel extends DcChartModel {

  public title;
  public subtitle;

  public filterItems: Array<FilterModel> = new Array<FilterModel>();
  public dialogData: ChartInfoDialogData = null;
}
