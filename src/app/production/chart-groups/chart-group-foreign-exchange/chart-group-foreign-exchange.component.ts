import { Component, OnInit } from '@angular/core';
import { ChartDataService } from '../../services/chart-data.service';
import { MaterialDcChartModel } from '../../material-dc-chart/material-dc-chart-model';
import { MaterialDcNumberGroupModel } from '../../material-dc-number-group/material-dc-number-group-model';
import { NumberGroupChartModel } from '../../number-group-chart/number-group-chart-model';
import { FilterModel } from '../../material-dc-chart/filter-model';
import { DcChartOptions } from '../../dc-chart/dc-chart-options';
import { DcChartType } from '../../dc-chart/dc-chart-type.enum';
import { NumberChartGroupOptionDefaults, XAxisType, SeriesChartOptionDefaults } from '../../dc-chart/chart-option-defaults';
import { MuuriGridGroupComponent } from '../muuri-grid-group/muuri-grid-group.component';
import { ChartInfoDialogData } from '../../chart-info-dialog/chart-info-dialog-data';


import { zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-group-foreign-exchange',
  templateUrl: './chart-group-foreign-exchange.component.html',
  styleUrls: ['./chart-group-foreign-exchange.component.css', '../muuri-grid-group/muuri-grid-group.component.css']
})
export class ChartGroupForeignExchangeComponent extends MuuriGridGroupComponent implements OnInit {

  constructor(private _cds: ChartDataService) { super(); }

  // define all chart variables to be read in the view
  public chartExchangeUsd: MaterialDcNumberGroupModel;
  public chartExchangeThb: MaterialDcNumberGroupModel;
  public chartExchangeRate: MaterialDcChartModel;
  public chartModels = new Array<MaterialDcChartModel>();

  ngOnInit() {
    this._loadChartExchangeUsd();
    this._loadChartExchangeThb();
    this._loadChartExchangeRate();

  }

  private _loadChartExchangeUsd() {

    // Set Title for Chart
    this.chartExchangeUsd = new MaterialDcNumberGroupModel();
    this.chartExchangeUsd.title = 'Exchange Rate for 1 USD';

    // Load Subcharts
    zip(this._cds.dailyExchangeRate.getGroup('byDate'), this._cds.dailyExchangeRate.getDim('byDate'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const top = group.top(1);
          if ( top.length === 0 ) { return; }
          const row = top[0];
          this.chartExchangeUsd.subtitle = 'as of ' + row.key;
          const countries = Object.keys(row.value);
          const numDis1 = new Array<NumberGroupChartModel>();
          countries.sort(d3.ascending);
          countries.forEach( (d) => {
            const currencyName = row.value[d]['currencyName'];
            const chartModel = new NumberGroupChartModel(d);
            chartModel.title  = d;
            chartModel.subtitle  = currencyName;
            chartModel.chartOptions['number'] = new DcChartOptions('number', DcChartType.Number, new NumberChartGroupOptionDefaults());
            chartModel.chartOptions['number'].options['valueAccessor'] = function (kv) { return kv.value[d]['amountUsd']; };
            chartModel.selectedOption = 'number';
            chartModel.group = group;
            chartModel.dimension = dim;
            numDis1.push(chartModel);
          });
          this.chartExchangeUsd.numberDisplays = numDis1;
        }
    });


  }

  private _loadChartExchangeThb() {

    this.chartExchangeThb = new MaterialDcNumberGroupModel();
    this.chartExchangeThb.title = 'Exchange Rate for 1 THB';

    zip(this._cds.dailyExchangeRate.getGroup('byDate'), this._cds.dailyExchangeRate.getDim('byDate'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const top = group.top(1);
          if ( top.length === 0 ) { return; }
          const row = top[0];
          this.chartExchangeThb.subtitle = 'as of ' + row.key;
          const thb = row.value['Thailand']['amountUsd'];
          const countries = Object.keys(row.value);
          const numDis2 = new Array<NumberGroupChartModel>();
          countries.sort(d3.ascending);
          countries.forEach( (d) => {
            const currencyName = row.value[d]['currencyName'];
            const chartModel2 = new NumberGroupChartModel(d);
            chartModel2.title = d;
            chartModel2.subtitle = currencyName;
            chartModel2.chartOptions['number'] = new DcChartOptions('number', DcChartType.Number, new NumberChartGroupOptionDefaults());
            chartModel2.chartOptions['number'].options['valueAccessor'] = function (kv) { return kv.value[d]['amountUsd'] / thb; };
            chartModel2.selectedOption = 'number';
            chartModel2.group = group;
            chartModel2.dimension = dim;
            numDis2.push(chartModel2);
          });

          this.chartExchangeThb.numberDisplays = numDis2;
        }
    });
  }

  private _loadChartExchangeRate() {

    // Set Title and Subtitle
    this.chartExchangeRate    = new MaterialDcChartModel('exchangeRate');
    this.chartExchangeRate.title    = 'Currency Comparison';
    this.chartExchangeRate.subtitle = '';
    this.chartExchangeRate.chartGroup = 'exchangeRate';

    // Set Dimension for Chart
    this._cds.exchangeRate.getDim('byCountryDate').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) {   this.chartExchangeRate.dimension = dim; } });

    // Set Group for Chart
    this._cds.exchangeRate.getGroup('byCountryDate').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) {   this.chartExchangeRate.group = group;  } });

    // Series Chart Configuration
    const seriesOptions = new SeriesChartOptionDefaults(XAxisType.Date);
    this.chartExchangeRate.chartOptions['line'] = new DcChartOptions('line', DcChartType.Series, seriesOptions);
    seriesOptions['xUnits'] = d3.timeDays;

    const calcDomain = function (chart) {
      const ext = d3.extent(chart.group().all(), function(kv) { return kv.value; });
      chart.y(d3.scaleLinear().domain(ext));
    };

    seriesOptions['seriesAccessor'] = function(kv) { return kv.key[0]; };
    seriesOptions['keyAccessor'] = function(kv) {  return kv.key[1]; };
    seriesOptions['valueAccessor'] = function(kv) {  return +kv.value; };
    seriesOptions['on'] = [['preRender', calcDomain], ['preRedraw', calcDomain]];
    seriesOptions['elasticY'] = false;
    seriesOptions['title'] = function(d) {
      return d.key[1].getDate() + '-' + d.key[1].getMonth()  + '-' + d.key[1].getFullYear() + ' : ' + parseFloat(d.value).toFixed(2); };

    // Load Dropdown Filter by Country
    zip(this._cds.exchangeRate.getGroup('byCountry'), this._cds.exchangeRate.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('by Country', group, dim);
          fi.selectMultipleEnabled = true;
          this.chartExchangeRate.filterItems.push( fi );
          this.chartExchangeRate.filterItems = this.chartExchangeRate.filterItems.slice(0);
        }
    });

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartExchangeRate.selectedOption = 'line';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartExchangeRate.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartExchangeRate.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartExchangeRate.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartExchangeRate);

  }

}
