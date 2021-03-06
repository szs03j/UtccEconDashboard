import { Component, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DcChartComponent } from '../dc-chart/dc-chart.component';
import { FilterModel } from './filter-model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChartInfoDialogComponent } from '../chart-info-dialog/chart-info-dialog.component';
import { ChartInfoDialogData } from '../chart-info-dialog/chart-info-dialog-data';

@Component({
  selector: 'app-mat-dc-chart',
  templateUrl: './material-dc-chart.component.html',
  styleUrls: ['./material-dc-chart.component.css', '../../../assets/css/dc.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class MaterialDcChartComponent extends DcChartComponent {
  constructor(public dialog: MatDialog, public cd: ChangeDetectorRef) { super(cd); }

  @Input() public dialogData: ChartInfoDialogData;
  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public set filterItems(it: Array<FilterModel>) {
    this._gettersetter_filterItems = it;
    this._gettersetter_filterItems.forEach( (d) => {
      if ( d.selectDefault ) {
        this.handleDimFilter(d.dimension, d.selectDefault);
      }
    });
  }

  public displaySpinner = false;
  public get filterItems() { return this._gettersetter_filterItems; }
  private _gettersetter_filterItems: Array<FilterModel> = new Array<FilterModel>();

  handleChartLoadedChange(state: boolean) {
    this.displaySpinner = !state;
  }

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

  openDialog(): void {
    const dialogRef = this.dialog.open(ChartInfoDialogComponent, {
      width: '400px',
      data: this.dialogData
    });
  }

}
