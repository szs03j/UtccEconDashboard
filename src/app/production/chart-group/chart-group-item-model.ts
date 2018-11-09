import { ChartGroupItemModelType } from './chart-group-item-model-type.enum';
import { Observable } from 'rxjs';

export interface ChartGroupItemModel {
  readonly modelType: ChartGroupItemModelType;
  chartLoadedChange(): Observable<boolean>;
}
