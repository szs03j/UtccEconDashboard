import { DcChartModel } from '../dc-chart/dc-chart-model';
import { FilterModel } from './filter-model';
import { ChartGroupItemModel } from '../chart-group/chart-group-item-model';
import { ChartGroupItemModelType } from '../chart-group/chart-group-item-model-type.enum';
import { ChartInfoDialogData } from '../chart-info-dialog/chart-info-dialog-data';

export class MaterialDcChartModel extends DcChartModel implements ChartGroupItemModel {

  public title;
  public subtitle;
  // deprecated, was used in 'chart-group' code
  public readonly modelType = ChartGroupItemModelType.MaterialDcChart;

  public filterItems: Array<FilterModel> = new Array<FilterModel>();
  public dialogData: ChartInfoDialogData = null;
}
