import { DcChartOptions } from './dc-chart-options';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseMixin } from 'dc';
import { Dict } from '../dict';

export class DcChartModel {
  constructor(n: string) {
    this.name = n;
  }

  readonly name: string;
  public dimension: any;
  public group: any;
  public chartGroup: string;

  public get selectedOption() { return this._gettersetter_selectedOption.getValue(); }
  public set selectedOption(so: string) { this._gettersetter_selectedOption.next(so); }
  private _gettersetter_selectedOption = new BehaviorSubject<string>(null);

  public get chartLoaded() { return this._gettersetter_chartLoaded.getValue(); }
  public set chartLoaded( cl: boolean ) { this._gettersetter_chartLoaded.next(cl); }
  private _gettersetter_chartLoaded = new BehaviorSubject<boolean>(null);

  public get chart() { return this._gettersetter_chart.getValue(); }
  public set chart( c: BaseMixin<any> ) { this._gettersetter_chart.next(c); }
  private _gettersetter_chart = new BehaviorSubject<BaseMixin<any>>(null);

  public chartOptions = new Dict<DcChartOptions>();

  public selectedOptionChange(): Observable<string> { return this._gettersetter_selectedOption.asObservable(); }
  public chartLoadedChange(): Observable<boolean> { return this._gettersetter_chartLoaded.asObservable(); }
  public chartChange(): Observable<BaseMixin<any>> { return this._gettersetter_chart.asObservable(); }
}
