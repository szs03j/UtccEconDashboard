import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DcChartComponent } from '../dc-chart/dc-chart.component';
import { FilterModel } from './filter-model';

@Component({
  selector: 'app-mat-dc-chart',
  templateUrl: './material-dc-chart.component.html',
  styleUrls: ['./material-dc-chart.component.css', '../../../node_modules/dc/style/dc.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MaterialDcChartComponent extends DcChartComponent {
  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public filterItems: Array<FilterModel> = new Array<FilterModel>();

  handleDimFilter(dim: any, fil: any) {

    if ( Array.isArray(fil)) {
      if ( fil.length < 1 ) {
        dim.filterAll();
      } else {
        dim.filterFunction( function (d) {
          for ( let i = 0; i < fil.length; i++ ) {
            if ( d === fil[i] ) { return true; }
          }
          return false;
        });
      }
    } else {
      dim.filter(fil);
    }
    if (this.chart) { this.chart.redrawGroup(); }
  }

}
