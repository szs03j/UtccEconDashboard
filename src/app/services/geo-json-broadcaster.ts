import { Observable, BehaviorSubject } from 'rxjs';
import { ExtendedGeometryCollection, GeoGeometryObjects } from 'd3';

export class GeoJsonBroadcaster {

  // takes a loadfunction argument to load the geojson (intended to be d3.json(...) )
  constructor( loadFunc: ( geoJson:   BehaviorSubject<ExtendedGeometryCollection<GeoGeometryObjects>> ) => void ) {
      this._loadFunction = loadFunc;
  }

  private _geoJson = new BehaviorSubject<ExtendedGeometryCollection<GeoGeometryObjects>>(null);
  private _isLoaded = false;
  private _loadFunction: ( geoJson: BehaviorSubject<ExtendedGeometryCollection<GeoGeometryObjects>> ) => void;

  private _callLoading() {
    this._isLoaded = true;
    this._loadFunction(this._geoJson);
  }

  public getGeoJson(): Observable<ExtendedGeometryCollection<GeoGeometryObjects>> {
    if (!this._isLoaded) {
      this._callLoading();
    }
    return this._geoJson.asObservable();
  }
}
