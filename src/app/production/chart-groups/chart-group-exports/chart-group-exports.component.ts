import { Component, OnInit } from '@angular/core';
import { ChartDataService } from '../../services/chart-data.service';
import { MaterialDcChartModel } from '../../material-dc-chart/material-dc-chart-model';
import { DcChartOptions } from '../../dc-chart/dc-chart-options';
import { DcChartType } from '../../dc-chart/dc-chart-type.enum';
import { BarChartOptionDefaults, PieChartOptionDefaults, XAxisType,
  MapChartOptionDefaults, angleYearLabels, RowChartOptionDefaults } from '../../dc-chart/chart-option-defaults';
import { MuuriGridGroupComponent } from '../muuri-grid-group/muuri-grid-group.component';
import { ChartInfoDialogData } from '../../chart-info-dialog/chart-info-dialog-data';

import { takeUntil } from 'rxjs/operators';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart-group-exports',
  templateUrl: './chart-group-exports.component.html',
  styleUrls: ['./chart-group-exports.component.css', '../muuri-grid-group/muuri-grid-group.component.css']
})
export class ChartGroupExportsComponent extends MuuriGridGroupComponent implements OnInit {

  constructor(private _cds: ChartDataService) { super(); }

  // define all chart variables to be read in the view
  public chartByCountry: MaterialDcChartModel;
  public chartByYear: MaterialDcChartModel;
  public chartByProduct: MaterialDcChartModel;
  public chartByPartner: MaterialDcChartModel;
  public chartModels = new Array<MaterialDcChartModel>();

  private _sharedChartGroup = 'exports';

  ngOnInit() {
    this._loadChartByCountry();
    this._loadChartByProduct();
    this._loadChartByYear();
    this._loadChartByPartner();
  }


  private _loadChartByCountry() {

    // Set Title and Subtitle
    this.chartByCountry    = new MaterialDcChartModel('exportsByCountry');
    this.chartByCountry.title    = 'Exports';
    this.chartByCountry.subtitle = 'by Country';
    this.chartByCountry.chartGroup = this._sharedChartGroup;

    // Load the Dimension for the chart
    this._cds.export.getDim('byCountry').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartByCountry.dimension = dim; } });

    // Load the Group for the chart
    this._cds.export.getGroup('byCountry').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { this.chartByCountry.group = group;  } });

    // Bar Chart Configuration
    this.chartByCountry.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, new BarChartOptionDefaults(XAxisType.Ordinal));

    // Pie Chart Configuration
    this.chartByCountry.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, new PieChartOptionDefaults());

    // Map Chart Configuration
    this._cds.seaJson.getGeoJson().pipe(takeUntil(this._onDestroy$)).subscribe(
      (geoJson: any) => {
        if (geoJson) {
          const mapOpt = new MapChartOptionDefaults();
          mapOpt['projection'] =
            d3.geoOrthographic().rotate([250, 0, 0]).fitExtent([[0, 0], [mapOpt['width'], mapOpt['height']]], geoJson );
          mapOpt['overlayGeoJson'] = [geoJson['features'], 'state', function (d) { return d.properties.name; }];
          this.chartByCountry.chartOptions['map'] = new DcChartOptions('map', DcChartType.GeoChoropleth, mapOpt);
          this.chartByCountry.chartOptions = this._clone( this.chartByCountry.chartOptions );
        }
      }
    );

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartByCountry.selectedOption = 'map';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartByCountry.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    this.chartByCountry.chartFilteredChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: any) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartByCountry.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartByCountry.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartByCountry);
  }

  private _loadChartByYear() {

    // Set Title and Subtitle
    this.chartByYear     = new MaterialDcChartModel('exportsByYear');
    this.chartByYear.title     = 'Exports';
    this.chartByYear.subtitle  = 'by Year';
    this.chartByYear.chartGroup = this._sharedChartGroup;

    // Set Dimension for Chart
    this._cds.export.getDim('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartByYear.dimension = dim; } });

    // Set Group for Chart
    this._cds.export.getGroup('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { this.chartByYear.group = group;  } });

    // Bar Chart Configuration
    const barOptions = new BarChartOptionDefaults(XAxisType.Ordinal);
    barOptions['on'] = ['renderlet', angleYearLabels];
    this.chartByYear.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, barOptions);

    // Pie Chart Configuration
    this.chartByYear.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, new PieChartOptionDefaults());

    // Bar Pct Chg Chart Configuration
    this._cds.export.getGroup('byYearChg').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) {
        const opt = new BarChartOptionDefaults( XAxisType.Ordinal );
        opt['group'] = group;
        this.chartByYear.chartOptions['barPctChg'] = new DcChartOptions('% chg', DcChartType.Bar, opt);
        opt['on'] = [['preRender', function(chart) {
          chart.yAxisLabel('Percent Change');
          chart.yAxis().tickFormat(function(v) {return v + '%'; });
          chart.title( function(kv) { return d3.format('+.2%')(kv.value / 100); });
        }], ['renderlet', angleYearLabels]];
        // _clone creates a new instance which triggers updates in dcchartcomponent
        this.chartByYear.chartOptions = this._clone(this.chartByYear.chartOptions);
      }
    });

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartByYear.selectedOption = 'bar';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartByYear.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    this.chartByYear.chartFilteredChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: any) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartByYear.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartByYear.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartByYear);
  }

  private _loadChartByProduct() {

    // Set Title and Subtitle
    this.chartByProduct     = new MaterialDcChartModel('exportsByProduct');
    this.chartByProduct.title     = 'Exports';
    this.chartByProduct.subtitle  = 'by Product';
    this.chartByProduct.chartGroup = this._sharedChartGroup;

    // Set Dimension for Chart
    this._cds.export.getDim('byDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartByProduct.dimension = dim; } });

    // Set Group for Chart
    this._cds.export.getGroup('byDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { this.chartByProduct.group = group;  } });

    // Row Chart Configuration
    this.chartByProduct.chartOptions['row'] = new DcChartOptions('row', DcChartType.Row, new RowChartOptionDefaults(XAxisType.Float));

    // Pie Chart Configuration
    this.chartByProduct.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, new PieChartOptionDefaults() );

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartByProduct.selectedOption = 'row';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartByProduct.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    this.chartByProduct.chartFilteredChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: any) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartByProduct.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartByProduct.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartByProduct);

  }

  private _loadChartByPartner() {

    // Set Title and Subtitle
    this.chartByPartner    = new MaterialDcChartModel('exportsByPartner');
    this.chartByPartner.title    = 'Exports';
    this.chartByPartner.subtitle = 'by Partner';
    this.chartByPartner.chartGroup = this._sharedChartGroup;

    // Set Dimension for Chart
    this._cds.export.getDim('byPartner').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartByPartner.dimension = dim; } });

    // Set Group for Chart
    this._cds.export.getGroup('byPartner').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { this.chartByPartner.group = group;  } });

    // Row Chart Configuration
    this.chartByPartner.chartOptions['row'] = new DcChartOptions('row', DcChartType.Row, new RowChartOptionDefaults(XAxisType.Float));

    // Pie Chart Configuration
    this.chartByPartner.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, new PieChartOptionDefaults());

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartByPartner.selectedOption = 'row';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartByPartner.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    this.chartByPartner.chartFilteredChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: any) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartByPartner.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartByPartner.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartByPartner);
  }


}
