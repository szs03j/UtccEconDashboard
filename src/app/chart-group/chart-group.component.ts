import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, Input, ViewChild } from '@angular/core';
import { MaterialDcChartModel } from '../material-dc-chart/material-dc-chart-model';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import * as muuri from 'muuri';

@Component({
  selector: 'app-chart-group',
  templateUrl: './chart-group.component.html',
  styleUrls: ['./chart-group.component.css']
})
export class ChartGroupComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private _breakpointObserver: BreakpointObserver) { }

  private _removeSub$ = new Subject();

  @ViewChild('grid') private _gridElementRef: ElementRef ;
  private _muuriGrid: any;

  @Input() public title: string;
  @Input() public set chartModels(cm: Array<MaterialDcChartModel>) { this._gettersetter_chartModels = cm; this._wireChartModels(); }
  public get chartModels() { return this._gettersetter_chartModels; }
  private _gettersetter_chartModels = new Array<MaterialDcChartModel>();

  public isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  ngOnInit() {
  }

  ngAfterViewInit() {
    const gridDefaults = { dragEnabled: false, dragSortInterval: 5, layoutOnResize: 5 };
    this._muuriGrid = new muuri.default(this._gridElementRef.nativeElement, gridDefaults );
  }

  ngOnDestroy() {
    this._removeSub$.next();
  }

  private _handleChartLoadedChange( model: MaterialDcChartModel ) {
    if ( model.chartLoaded ) { this._muuriGrid.refreshItems(); this._muuriGrid.layout(); }
  }

  private _wireChartModels() {
    this._removeSub$.next();
    this.chartModels.forEach(
      (d) => {
        d.chartLoadedChange()
          .pipe( takeUntil(this._removeSub$) )
          .subscribe(
            (cl: boolean) => this._handleChartLoadedChange(d));
      }
    );

  }
}
