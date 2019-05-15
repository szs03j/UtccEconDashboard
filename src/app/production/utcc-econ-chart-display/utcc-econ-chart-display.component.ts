import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';


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
