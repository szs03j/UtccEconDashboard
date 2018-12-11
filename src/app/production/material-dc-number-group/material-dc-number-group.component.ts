import { Input, Component, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { NumberGroupChartModel } from '../number-group-chart/number-group-chart-model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mat-dc-number-group',
  templateUrl: './material-dc-number-group.component.html',
  styleUrls: ['./material-dc-number-group.component.css']
})
export class MaterialDcNumberGroupComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  constructor() { }

  private _removeSub$ = new Subject();

  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public set numberDisplays(arr: Array<NumberGroupChartModel>) {
    this._gettersetter_numberDisplays = arr;
    this._removeSub$.next();
    this.chartLoaded = false;
    this._gettersetter_numberDisplays.forEach(
      (d) => {
        d.chartLoadedChange()
          .pipe( takeUntil(this._removeSub$) )
          .subscribe(
            (cl: boolean) => { if ( cl ) { this.chartLoaded = true; } });
      }
    );

  }
  public get numberDisplays() { return this._gettersetter_numberDisplays; }
  private _gettersetter_numberDisplays: Array<NumberGroupChartModel> = new Array<NumberGroupChartModel>();

  public chartLoaded = false;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this._removeSub$.next();
  }

}
