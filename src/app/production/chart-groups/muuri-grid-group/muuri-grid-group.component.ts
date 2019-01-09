import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as muuri from 'muuri';

/*
  this component is meant to be inherited by the other
  chart-group-* components in the adjacent directories.
  e.g. ChartGroupGdpComponent extends MuuriGridGroupComponent
*/
@Component({
  selector: 'app-muuri-grid-group',
  templateUrl: './muuri-grid-group.component.html',
  styleUrls: ['./muuri-grid-group.component.css']
})
export class MuuriGridGroupComponent implements AfterViewInit, OnDestroy {

  constructor() { }

  @ViewChild('grid') private _gridElementRef: ElementRef ;
  protected _muuriGrid: any;

  // Used to signal to all open subscriptions to terminate
  // when this component is destroyed
  protected _onDestroy$ = new Subject();

  ngAfterViewInit() {
    const gridDefaults = { dragEnabled: false, dragSortInterval: 5, layoutOnResize: 5 };
    this._muuriGrid = new muuri.default(this._gridElementRef.nativeElement, gridDefaults );
  }

  ngOnDestroy() {
    // signals to all subscribers that the component is terminating
    this._onDestroy$.next();
  }
  protected _refreshGridLayout() {
    this._muuriGrid.refreshItems();
    this._muuriGrid.layout();
  }

  // needed to force an update in angular when an array value changes
  // used in inherited components
  protected _clone( obj: any ): any {
    const newObj = {};
    Object.keys(obj).forEach( (k) => newObj[k] = obj[k] );
    return newObj;
  }

}
