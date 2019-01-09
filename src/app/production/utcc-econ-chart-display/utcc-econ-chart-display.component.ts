import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import * as dc from 'dc';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map, takeUntil } from 'rxjs/operators';
import { MaterialDcChartModel } from '../material-dc-chart/material-dc-chart-model';
import { DcChartOptions } from '../dc-chart/dc-chart-options';
import { DcChartType } from '../dc-chart/dc-chart-type.enum';
import { Observable, zip, Subject } from 'rxjs';
import { ChartDataService } from '../services/chart-data.service';
import { FilterModel } from '../material-dc-chart/filter-model';
import { ChartGroupModel } from '../chart-group/chart-group-model';
import { MaterialDcNumberGroupModel } from '../material-dc-number-group/material-dc-number-group-model';
import { NumberGroupChartModel } from '../number-group-chart/number-group-chart-model';

@Component({
  selector: 'app-utcc-econ-chart-display',
  templateUrl: './utcc-econ-chart-display.component.html',
  styleUrls: ['./utcc-econ-chart-display.component.css']
})
export class UtccEconChartDisplayComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor( private _breakpointObserver: BreakpointObserver ) { }

  title = 'UtccEconDashboard';
  private _onDestroy$ = new Subject();

  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  ngAfterViewInit() {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this._onDestroy$.next();
  }

}
