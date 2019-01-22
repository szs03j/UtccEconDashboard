import { BehaviorSubject, Observable } from 'rxjs';
import * as d3 from 'd3';
import { ChartInfoDialogData } from '../chart-info-dialog/chart-info-dialog-data';

export class ChartInfoBroadcaster {
  constructor(fn: string) {
    this.filename = fn;
  }

  public filename = '';
  private _data = new Map<string, BehaviorSubject<ChartInfoDialogData>>();
  private _isLoaded = false;

  public getInfo(chartName: string): Observable<ChartInfoDialogData> {
    if (!this._isLoaded) {
      this._isLoaded = true;
      this._loadData();
    }

    if (!this._data[chartName]) {
      this._data[chartName] = new BehaviorSubject<ChartInfoDialogData>(null);
    }

    return this._data[chartName].asObservable();
  }

  private _loadData() {
    d3.json(this.filename).then(jso => {
      Object.keys(jso).forEach(k => {
        if (this._data[k]) {
          this._data[k].next(jso[k] as ChartInfoDialogData);
        } else {
          this._data[k] = new BehaviorSubject( jso[k] as ChartInfoDialogData);
        }
      });
    });
  }

}
