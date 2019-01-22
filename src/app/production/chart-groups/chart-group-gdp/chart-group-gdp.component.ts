import { Component, OnInit } from '@angular/core';
import { ChartDataService } from '../../services/chart-data.service';
import { MaterialDcChartModel } from '../../material-dc-chart/material-dc-chart-model';
import { DcChartOptions } from '../../dc-chart/dc-chart-options';
import { DcChartType } from '../../dc-chart/dc-chart-type.enum';
import { BarChartOptionDefaults, PieChartOptionDefaults, XAxisType,
  pieLabelsAsPctProportion, pieLegendSpacer, MapChartOptionDefaults,
  angleYearLabels, removeEveryOtherXAxisLabel, SeriesChartOptionDefaults } from '../../dc-chart/chart-option-defaults';
import { MuuriGridGroupComponent } from '../muuri-grid-group/muuri-grid-group.component';
import { ChartInfoDialogData } from '../../chart-info-dialog/chart-info-dialog-data';


import { takeUntil } from 'rxjs/operators';
import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
  selector: 'app-chart-group-gdp',
  templateUrl: './chart-group-gdp.component.html',
  styleUrls: ['./chart-group-gdp.component.css', '../muuri-grid-group/muuri-grid-group.component.css']
})
export class ChartGroupGdpComponent extends MuuriGridGroupComponent implements OnInit {

  constructor(private _cds: ChartDataService) { super(); }

  // define all chart variables to be read in the view
  public chartGdpByCountry: MaterialDcChartModel;
  public chartGdpByYear: MaterialDcChartModel;
  public chartGdpByCountryYear: MaterialDcChartModel;
  public chartModels = new Array<MaterialDcChartModel>();

  private _sharedChartGroup = 'gdp';

  ngOnInit() {
    this._loadChartGdpByCountry();
    this._loadChartGdpByYear();
    this._loadChartGdpByCountryYear();
  }

  private _loadChartGdpByCountry() {
    // Set Title and Subtitle
    this.chartGdpByCountry    = new MaterialDcChartModel('gdpByCountry');
    this.chartGdpByCountry.title    = 'GDP';
    this.chartGdpByCountry.subtitle = 'by Country';
    this.chartGdpByCountry.chartGroup = this._sharedChartGroup;

    // Set Chart Dimension
    this._cds.gdp.getDim('byCountry').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartGdpByCountry.dimension = dim; } });

    // Set Chart Group
    this._cds.gdp.getGroup('byCountry').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { this.chartGdpByCountry.group = group;  } });

    // Bar Chart Configuration
    const barOptions = new BarChartOptionDefaults(XAxisType.Ordinal);
    this.chartGdpByCountry.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, barOptions);

    // Pie Chart Configuration
    const pieOptions = new PieChartOptionDefaults();
    pieOptions['on'] = [['pretransition', pieLabelsAsPctProportion], ['renderlet', pieLegendSpacer]];
    pieOptions['legend'] =
      dc.legend().x(35).y(0).itemHeight(9).gap(8).horizontal(true).itemWidth(75).legendWidth(225);
    pieOptions['externalRadiusPadding'] = 20;
    pieOptions['ordinalColors'] = ['#d62728', '#9467bd', '#2ca02c', '#1f77b4', '#ff7f0e'];
    this.chartGdpByCountry.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, pieOptions);

    // Map Chart Configuration
    const mapOptions = new MapChartOptionDefaults();
    this._cds.seaJson.getGeoJson().pipe(takeUntil(this._onDestroy$)).subscribe(
      (geoJson: any) => {
        if (geoJson) {
          mapOptions['projection'] =
          d3.geoOrthographic().rotate([250, 0, 0]).fitExtent([[0, 0], [mapOptions['width'], mapOptions['height']]], geoJson );
          mapOptions['overlayGeoJson'] = [geoJson['features'], 'state', function (d) { return d.properties.name; }];
          this.chartGdpByCountry.chartOptions['map'] = new DcChartOptions('map', DcChartType.GeoChoropleth, mapOptions);
          this.chartGdpByCountry.chartOptions = this._clone( this.chartGdpByCountry.chartOptions );
        }
      }
    );

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartGdpByCountry.selectedOption = 'pie';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartGdpByCountry.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartGdpByCountry.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartGdpByCountry.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartGdpByCountry);
  }

  private _loadChartGdpByYear() {
    // Set Title and Subtitle
    this.chartGdpByYear     = new MaterialDcChartModel('gdpByYear');
    this.chartGdpByYear.title     = 'GDP';
    this.chartGdpByYear.subtitle  = 'by Year';
    this.chartGdpByYear.chartGroup = this._sharedChartGroup;

    // Set Chart Dimension
    this._cds.gdp.getDim('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartGdpByYear.dimension = dim; } });

    // Set Chart Group
    this._cds.gdp.getGroup('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { this.chartGdpByYear.group = group;  } });

    const formatXAxis = function(c) { angleYearLabels(c); removeEveryOtherXAxisLabel(c); };

    // Bar Chart Configuration
    const barOptions = new BarChartOptionDefaults(XAxisType.Ordinal);
    barOptions['on'] = ['renderlet', formatXAxis];
    this.chartGdpByYear.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, barOptions);

    // Bar Chart Pct Chg Configuration
    this._cds.gdp.getGroup('byYearChg').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) {
        const opt = new BarChartOptionDefaults(XAxisType.Ordinal);
        opt['group'] = group;
        this.chartGdpByYear.chartOptions['barPctChg'] = new DcChartOptions('% chg', DcChartType.Bar, opt);
        this.chartGdpByYear.chartOptions['barPctChg'].options['on'] = [['preRender', function(chart) {
          chart.yAxis().tickFormat(function(v) {return v + '%'; });
          chart.title( function(kv) { return d3.format('+.2%')(kv.value / 100); });
        }], ['renderlet', formatXAxis]];
        // _clone creates a new instance which triggers updates in dcchartcomponent
        this.chartGdpByYear.chartOptions = this._clone(this.chartGdpByYear.chartOptions);
      }
    });

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartGdpByYear.selectedOption = 'bar';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartGdpByYear.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartGdpByYear.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartGdpByYear.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartGdpByYear);

  }

  private _loadChartGdpByCountryYear() {

    // Set Title and Subtitle
    this.chartGdpByCountryYear     = new MaterialDcChartModel('gdpHistory');
    this.chartGdpByCountryYear.title     = 'GDP';
    this.chartGdpByCountryYear.subtitle  = '';
    this.chartGdpByCountryYear.chartGroup = this._sharedChartGroup;

    // Set Chart Dimension
    this._cds.gdp.getDim('byCountryYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartGdpByCountryYear.dimension = dim; } });

    // Set Chart Group
    this._cds.gdp.getGroup('byCountryYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) {  this.chartGdpByCountryYear.group = group;  } });

    // Series Chart Configuration
    const seriesOptions = new SeriesChartOptionDefaults(XAxisType.Integer);
    const calcDomain = function (chart) {
      const ext = d3.extent(chart.group().all(), function(kv) { return kv.value; });
      chart.y(d3.scaleLinear().domain(ext));
    };

    seriesOptions['on'] = [
      ['preRedraw', calcDomain],
      ['renderlet', angleYearLabels],
      ['preRender', function(chart) {
      chart.yAxis().tickFormat(function(v) {return v + '%'; });
      chart.title( function(kv) { return d3.format('+.2%')(kv.value / 100); });
      chart.xAxis().tickFormat(function(e) {
        if (Math.floor(e) !== e) {
            return;
        }
        return e;
      });
    }]];
    seriesOptions['elasticY'] = false;
    seriesOptions['seriesAccessor'] = function(kv) { return kv.key[0]; };
    seriesOptions['valueAccessor'] = function(kv) {  return +kv.value; };
    seriesOptions['keyAccessor'] = function(kv) { return +kv.key[1]; };
    seriesOptions['title'] = function(d) {
      return d.key[1] + ' : ' + parseFloat(d.value).toFixed(2); };

    this.chartGdpByCountryYear.chartOptions['line'] = new DcChartOptions('line', DcChartType.Series, seriesOptions);

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartGdpByCountryYear.selectedOption = 'line';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartGdpByCountryYear.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartGdpByCountryYear.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartGdpByCountryYear.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartGdpByCountryYear);
  }

}
