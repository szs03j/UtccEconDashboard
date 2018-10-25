import { Observable, BehaviorSubject } from 'rxjs';
import { DSVRowAny } from 'd3';
import { Group, Dimension, NaturallyOrderedValue } from 'crossfilter2';

export class DimGrpBroadcaster {
  constructor( loadFunc: (
    dims:   Map<string, BehaviorSubject<Dimension<DSVRowAny, any>>>,
    groups: Map<string, BehaviorSubject<Group<DSVRowAny, NaturallyOrderedValue, NaturallyOrderedValue>>> ) => void ) {
      this._loadFunction = loadFunc;
  }

  private _dims = new Map<string, BehaviorSubject<Dimension<DSVRowAny, any>>>();
  private _groups = new Map<string, BehaviorSubject<Group<DSVRowAny, NaturallyOrderedValue, NaturallyOrderedValue>>>();
  private _isLoaded = false;
  private _loadFunction: (
    dims:   Map<string, BehaviorSubject<Dimension<DSVRowAny, any>>>,
    groups: Map<string, BehaviorSubject<Group<DSVRowAny, NaturallyOrderedValue, NaturallyOrderedValue>>> ) => void;

  private _callLoading() {
    this._isLoaded = true;
    this._loadFunction(this._dims, this._groups);
  }

  public getDim(name: string): Observable<Dimension<DSVRowAny, any>> {
    if (!this._isLoaded) {
      this._callLoading();
    }

    if (!this._dims[name]) {
      this._dims[name] = new BehaviorSubject<Dimension<DSVRowAny, any>>(null);
    }

    return this._dims[name].asObservable();
  }

  public getGroup(name: string): Observable<Group<DSVRowAny, NaturallyOrderedValue, NaturallyOrderedValue>> {
    if (!this._isLoaded) {
      this._callLoading();
    }

    if (!this._groups[name]) {
      this._groups[name] = new BehaviorSubject<Group<DSVRowAny, NaturallyOrderedValue, NaturallyOrderedValue>>(null);
    }

    return this._groups[name].asObservable();
  }
}
