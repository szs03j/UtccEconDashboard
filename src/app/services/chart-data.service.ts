import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as d3 from 'd3';
import * as cf from 'crossfilter2';
import { DimGrpBroadcaster } from './dim-grp-broadcaster';
import { GeoJsonBroadcaster } from './geo-json-broadcaster';

@Injectable({
  providedIn: 'root'
})

export class ChartDataService {

  constructor() { }

  /*
  valid dims:
    'byCountry'
    'byDesc'
    'byYear'
    'byPartner'

  valid groups:
    'byYearChg'
    'byCountry'
    'byDesc'
    'byYear'
    'byPartner'
  */
  public import = new DimGrpBroadcaster(
    (dims, groups) => {
      this._loadImEx(dims, groups, '../assets/data/imports.csv' );
    }
  );

  /*
  valid dims:
    'byCountry'
    'byDesc'
    'byYear'
    'byPartner'

  valid groups:
    'byYearChg'
    'byCountry'
    'byDesc'
    'byYear'
    'byPartner'
  */
  public export = new DimGrpBroadcaster(
    (dims, groups) => {
      this._loadImEx(dims, groups, '../assets/data/exports.csv' );
    }
  );

  /*
  valid dims:
    'byCountry'
    'byPartnerDesc'
    'byPartner'

  valid groups:
    'byCountry'
    'byPartnerDesc'
    'byPartner'
  */
  public potentialExport = new DimGrpBroadcaster( (dims, groups) => {
    this._loadPotential(dims, groups, '../../assets/data/exportPotential.csv');
  });

  public potentialImport = new DimGrpBroadcaster( (dims, groups) => {
    this._loadPotential(dims, groups, '../../assets/data/importPotential.csv');
  });

  public gdp = new DimGrpBroadcaster( (dims, groups) => {
    function remove_empty_bins(source_group) {
      return {
        all: function () {
          return source_group.all().filter(function(d) {
            return !Number.isNaN(d.value) && d.value !== 0;
          });
        }
      };
    }

    d3.csv('../../assets/data/gdp.csv').then( (data) => {
      // clean the data
      data.forEach(function(d) {
        d['Local']  = +d['Local'];
        d['USD']    = +d['USD'];
        d['Year']   = new Date(+d['Year'], 0);
      });

      const unit        = 1000000000;

      const ndx         = cf(data);
      const countryDim  = ndx.dimension(function(d) {return d['Country']; });
      const countryYearDim = ndx.dimension(function(d) {return [d['Country'], d['Year']] as any; });
      const yearDim     = ndx.dimension( function (d) { return d['Year']; } );

      const yearUsdGrp2  = remove_empty_bins(yearDim.group().reduce(
        function(p, v) {
          p[v['Country']] = p[v['Country']] ? p[v['Country']] + (+v['USD'] / unit) : (+v['USD'] / unit);
          return p;
        },
        function(p, v) {
          p[v['Country']] = p[v['Country']] ? p[v['Country']] - (+v['USD'] / unit) : (+v['USD'] / unit);
          return p;
        },
        function() {
          return {} as any;
        }
      ));

      const yearUsdGrp = yearDim.group().reduceSum( function(d) { return +d['USD'] / unit; });

      const yearLocalGrp  = yearDim.group().reduce(
        function(p, v) {
          p[v['Country']] = p[v['Country']] ? p[v['Country']] + v['Local'] : v['Local'];
          return p;
        },
        function(p, v) {
          p[v['Country']] = p[v['Country']] ? p[v['Country']] - v['Local'] : v['Local'];
          return p;
        },
        function() {
          return {} as any;
        }
      );
      const usdGrp      = remove_empty_bins(countryYearDim.group().reduceSum( function(d) { return +d['USD'] / unit; }));
      const localGrp    = remove_empty_bins(countryYearDim.group().reduceSum( function(d) { return +d['Local'] / unit; }));
      const countryGrp 	    = countryDim.group();

      const addDimOrGrp = function(key: string, col: Map<string, BehaviorSubject<any>>, item: any, isGroup: boolean) {
        if (col[key]) {
          col[key].next(item);
        } else if (isGroup) {
          col[key] = new BehaviorSubject<cf.Group<d3.DSVRowAny, cf.NaturallyOrderedValue, cf.NaturallyOrderedValue>>(item);
        } else {
          col[key] = new BehaviorSubject<cf.Dimension<d3.DSVRowAny, any>>(item);
        }
      };

      const byCountry = 'byCountry';
      const byCountryYear = 'byCountryYear';
      const byYear = 'byYear';
      const byYearUsd = 'byYearUsd';
      const byYearUsd2 = 'byYearUsd2';
      const byYearLocal = 'byYearLocal';
      const byUsd = 'byUsd';
      const byLocal = 'byLocal';

      addDimOrGrp(byCountry, dims, countryDim, false );
      addDimOrGrp(byYear, dims, yearDim, false );
      addDimOrGrp(byCountryYear, dims, countryYearDim, false);

      addDimOrGrp(byCountry, groups, countryGrp, true);
      addDimOrGrp(byYearUsd, groups, yearUsdGrp, true);
      addDimOrGrp(byYearUsd2, groups, yearUsdGrp2, true);
      addDimOrGrp(byYearLocal, groups, yearLocalGrp, true);
      addDimOrGrp(byUsd, groups, usdGrp, true);
      addDimOrGrp(byLocal, groups, localGrp, true);

    });
  });

  public exchangeRate = new DimGrpBroadcaster ( (dims, groups) => {
    function remove_empty_bins(source_group) {
      return {
        all: function () {
          return source_group.all().filter(function(d) {
            return !Number.isNaN(d.value) && d.value !== 0;
          });
        }
      };
    }

    d3.csv('../../assets/data/exchangeRate.csv').then( (data) => {
      // clean the data
      data.forEach(function(d) {
        d['Rate']  = +d['Rate'];
        d['Date']  = new Date(d['Date']);
      });

      const unit        = 1000000000;

      interface Comparable extends Array<any> { valueOf: () => number; }

      const ndx         = cf(data);
      const countryDim  = ndx.dimension(function(d) {return d['Country']; });
      const countryDateDim     = ndx.dimension(function(d) {return [d['Country'], d['Date']] as any; });

      const countryDateGrp     = remove_empty_bins(countryDateDim.group().reduceSum( function(d) { return +d['Rate']; }));
      const countryGrp 	 = countryDim.group();

      const addDimOrGrp = function(key: string, col: Map<string, BehaviorSubject<any>>, item: any, isGroup: boolean) {
        if (col[key]) {
          col[key].next(item);
        } else if (isGroup) {
          col[key] = new BehaviorSubject<cf.Group<d3.DSVRowAny, cf.NaturallyOrderedValue, cf.NaturallyOrderedValue>>(item);
        } else {
          col[key] = new BehaviorSubject<cf.Dimension<d3.DSVRowAny, any>>(item);
        }
      };

      const byCountry = 'byCountry';
      const byCountryDate = 'byCountryDate';

      addDimOrGrp(byCountry, dims, countryDim, false );
      addDimOrGrp(byCountryDate, dims, countryDateDim, false);

      addDimOrGrp(byCountry, groups, countryGrp, true);
      addDimOrGrp(byCountryDate, groups, countryDateGrp, true);

    });
  });

  public seaJson = new GeoJsonBroadcaster(
    (geoJson) => {
      d3.json('../assets/data/geosea.json').then(gj => {
        geoJson.next(gj as d3.ExtendedGeometryCollection<d3.GeoGeometryObjects>);
      });
    }
  );


  private _loadPotential = (dims, groups, filename) => {

    function filter_bins(source_group, f) {
      return {
        all: function () {
          return source_group.all().filter(function(d) {
            return f(d);
          });
        }
      };
    }

    const remEmpty = function(d) {
      return  Math.abs(+d.value['RCA']) > 0.00001; // if using floating-point numbers
    };

    d3.csv(filename).then(function(data) {
      data.forEach( (d) => {
          // clean the data
          d['Growth'] = Number.isNaN(+d['Growth']) || !Number.isFinite(+d['Growth']) ? 0 : +d['Growth'];
          d['RCA'] = Number.isNaN(+d['RCA']) || !Number.isFinite(+d['RCA']) ? 0 : +d['RCA'];
      });

      interface Comparable { valueOf: () => number; }

      const ndx   = cf(data);
      const countryDim  = ndx.dimension( function(d) { return d['Reporter']; });
      const partnerDim  = ndx.dimension( function(d) { return d['Partner']; });
      const partnerDescDim = ndx.dimension( function(d) { return d['Partner'] + ',' + d['Description']; });

      const partnerGrp  = partnerDim.group();
      const countryGrp  = countryDim.group();

      const partnerDescGrp = filter_bins(partnerDescDim.group().reduce(
        function(p, v) {
          p['Growth'] += +v['Growth'];
          p['RCA'] += +v['RCA'];
          p['Description'] = v['Description'];
          p['Partner'] = v['Partner'];
          return p;
        },
        function(p, v) {
          p['Growth'] -= +v['Growth'];
          p['RCA'] -= +v['RCA'];
          p['Description'] = v['Description'];
          p['Partner'] = v['Partner'];
          return p;
        },
        function() {
          return {'Growth': 0, 'RCA': 0, 'Description': '', 'Partner': '', 'valueOf': function() { return this.RCA; } } ;
        }
        ), remEmpty);

      const addDimOrGrp = function(key: string, col: Map<string, BehaviorSubject<any>>, item: any, isGroup: boolean) {
        if (col[key]) {
          col[key].next(item);
        } else if (isGroup) {
          col[key] = new BehaviorSubject<cf.Group<d3.DSVRowAny, cf.NaturallyOrderedValue, cf.NaturallyOrderedValue>>(item);
        } else {
          col[key] = new BehaviorSubject<cf.Dimension<d3.DSVRowAny, any>>(item);
        }
      };

      const byCountry = 'byCountry';
      const byPartner = 'byPartner';
      const byPartnerDesc = 'byPartnerDesc';

      addDimOrGrp(byCountry, dims, countryDim, false );
      addDimOrGrp(byPartner, dims, partnerDim, false);
      addDimOrGrp(byPartnerDesc, dims, partnerDescDim, false);

      addDimOrGrp(byCountry, groups, countryGrp, true);
      addDimOrGrp(byPartner, groups, partnerGrp, true);
      addDimOrGrp(byPartnerDesc, groups, partnerDescGrp, true);

    });
  }

  private _loadImEx = (dims, groups, fileName) => {

    function filterBins(source_group, f) {
      return {
          all: function () {
              return source_group.all().filter(function(d) {
                  return f(d);
              });
          }
      };
    }

    function remEmptyFilter(kv: any) {
      return  !Number.isNaN(kv.value) &&
              Number.isFinite(kv.value) &&
              Math.abs(kv.value) > 0.00001; // if using floating-point numbers
    }

    function percentChangeGroup(source_group) {
      return {
        all: function () {
          // return source_group.all();
          let prevVal = null;
          return source_group.all().map(function(d) {
          let val = 0;
          if ( prevVal !== null && prevVal !== 0 ) {
            val = ((d.value - prevVal) / prevVal) * 100;
          }
          prevVal = d.value;
          return {key: d.key, value: val};
          });
        }
      };
    }

    d3.csv(fileName).then( g => {
      const data = (g as d3.DSVParsedArray<d3.DSVRowAny>);

      const ndx         = cf(data);
      const countryDim  = ndx.dimension( function(d) {return d['Reporter']; });
      const descDim     = ndx.dimension( function(d) {return d['Description']; });
      const yearDim     = ndx.dimension( function(d) {return d['Year']; });
      const partnerDim  = ndx.dimension( function(d) {return d['Partner']; });

      const divisor     = 1000000000;
      const countryGrp  = countryDim.group().reduceSum(function(d) { return +d['Value'] / divisor; });
      const descGrp     = descDim.group().reduceSum(function(d) { return +d['Value'] / divisor; });
      const yearGrp     = yearDim.group().reduceSum(function(d) { return +d['Value'] / divisor; });
      const yearChgGrp  = percentChangeGroup(yearGrp);
      const partnerGrp  = filterBins(partnerDim.group().reduceSum(function(d) { return +d['Value'] / divisor; }), remEmptyFilter);

      const addDimOrGrp = function(key: string, col: Map<string, BehaviorSubject<any>>, item: any, isGroup: boolean) {
        if (col[key]) {
          col[key].next(item);
        } else if (isGroup) {
          col[key] = new BehaviorSubject<cf.Group<d3.DSVRowAny, cf.NaturallyOrderedValue, cf.NaturallyOrderedValue>>(item);
        } else {
          col[key] = new BehaviorSubject<cf.Dimension<d3.DSVRowAny, any>>(item);
        }
      };

      const byCountry = 'byCountry';
      const byDesc    = 'byDesc';
      const byYear    = 'byYear';
      const byYearChg = 'byYearChg';
      const byPartner = 'byPartner';

      addDimOrGrp(byCountry, dims, countryDim, false );
      addDimOrGrp(byDesc, dims, descDim, false );
      addDimOrGrp(byYear, dims, yearDim, false);
      addDimOrGrp(byPartner, dims, partnerDim, false);

      addDimOrGrp(byCountry, groups, countryGrp, true);
      addDimOrGrp(byDesc, groups, descGrp, true);
      addDimOrGrp(byYear, groups, yearGrp, true);
      addDimOrGrp(byYearChg, groups, yearChgGrp, true);
      addDimOrGrp(byPartner, groups, partnerGrp, true);

    });
  }

}
