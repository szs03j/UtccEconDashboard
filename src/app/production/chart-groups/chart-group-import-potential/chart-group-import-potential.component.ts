import { Component, OnInit } from '@angular/core';
import { ChartDataService } from '../../services/chart-data.service';
import { MaterialDcChartModel } from '../../material-dc-chart/material-dc-chart-model';
import { DcChartOptions } from '../../dc-chart/dc-chart-options';
import { DcChartType } from '../../dc-chart/dc-chart-type.enum';
import { FilterModel } from '../../material-dc-chart/filter-model';
import { BarChartOptionDefaults, PieChartOptionDefaults, XAxisType,
  pieLabelsAsPctProportion, pieLegendSpacer, MapChartOptionDefaults,
  angleYearLabels, removeEveryOtherXAxisLabel, potentialBoxMarkup,
  SeriesChartOptionDefaults, ScatterChartOptionDefaults, potentialMarkup, potentialCalcDomain } from '../../dc-chart/chart-option-defaults';
import { MuuriGridGroupComponent } from '../muuri-grid-group/muuri-grid-group.component';
import { ChartInfoDialogData } from '../../chart-info-dialog/chart-info-dialog-data';


import { zip} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
  selector: 'app-chart-group-import-potential',
  templateUrl: './chart-group-import-potential.component.html',
  styleUrls: ['./chart-group-import-potential.component.css', '../muuri-grid-group/muuri-grid-group.component.css']
})
export class ChartGroupImportPotentialComponent extends MuuriGridGroupComponent implements OnInit {

  constructor(private _cds: ChartDataService) { super(); }

  public chartPotentialGroups: MaterialDcChartModel;
  public chartPotentialSubgroups: MaterialDcChartModel;
  public chartPotentialBox: MaterialDcChartModel;
  public chartModels = new Array<MaterialDcChartModel>();

  ngOnInit() {

    this._loadChartPotentialGroups();
    this._loadChartPotentialSubgroups();
    this._loadChartPotentialBox();
  }

  private _loadChartPotentialGroups() {

    // Set Title and Subtitle
    this.chartPotentialGroups          = new MaterialDcChartModel('importPotentialGroups');
    this.chartPotentialGroups.title    = 'Import Potential Groups';
    this.chartPotentialGroups.subtitle = '';
    this.chartPotentialGroups.chartGroup = 'importGroups';

    // Set Chart Dimension
    this._cds.potentialImport.getDim('byPartnerDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartPotentialGroups.dimension = dim; } });

    // Set Chart Group
    this._cds.potentialImport.getGroup('byPartnerDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { this.chartPotentialGroups.group = group;  } });

    // Scatterplot Chart Configuration
    const plotOptions = new ScatterChartOptionDefaults(XAxisType.Float);
    plotOptions['on'] = [['preRender', function (c) {
      c.yAxis().tickFormat(function(v) {return v + '%'; });
      potentialCalcDomain(c); }],
    ['preRedraw', potentialCalcDomain], ['pretransition', potentialMarkup]];
    plotOptions['seriesAccessor'] = function(kv) { return kv.value['Partner']; };
    plotOptions['keyAccessor']    = function(kv) { return +kv.value['RCA']; };
    plotOptions['valueAccessor']  = function(kv) {  return +kv.value['Growth']; };
    plotOptions['colorAccessor']  = function(kv) {  return kv.value['Partner']; };
    plotOptions['title'] = function(kv) {  return [ kv.value['Description'],
        kv.value['Partner'],
        'RCA: ' + d3.format('.2f')(kv.value['RCA']),
        'Growth: ' + d3.format('.2f')(kv.value['Growth']) + '%'].join('\n'); };

    this.chartPotentialGroups.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, plotOptions);

    // Load Dropdown Filter by Country
    zip(this._cds.potentialImport.getGroup('byCountry'), this._cds.potentialImport.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('to Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          this.chartPotentialGroups.filterItems.push( fi );
          this.chartPotentialGroups.filterItems = this.chartPotentialGroups.filterItems.slice(0);
        }
    });

    // Load Dropdown Filter by Partner
    zip(this._cds.potentialImport.getGroup('byPartner'), this._cds.potentialImport.getDim('byPartner'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          this.chartPotentialGroups.filterItems.push( new FilterModel('from Partner', group, dim) );
          this.chartPotentialGroups.filterItems = this.chartPotentialGroups.filterItems.slice(0);
        }
    });

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartPotentialGroups.selectedOption = 'potential';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartPotentialGroups.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartPotentialGroups.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartPotentialGroups.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartPotentialGroups);
  }

  private _loadChartPotentialSubgroups() {

    // Set Title and Subtitle
    this.chartPotentialSubgroups          = new MaterialDcChartModel('importPotentialSubgroups');
    this.chartPotentialSubgroups .title    = 'Import Potential Subgrps';
    this.chartPotentialSubgroups .subtitle = '';
    this.chartPotentialSubgroups.chartGroup = 'importSubgroups';

    // Set Chart Dimension
    this._cds.potentialImportLarge.getDim('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartPotentialSubgroups.dimension = dim; } });

    // Set Chart Group
    this._cds.potentialImportLarge.getGroup('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { this.chartPotentialSubgroups.group = group;  } });

    // Scatterplot Chart Configuration
    const plotOptions = new ScatterChartOptionDefaults(XAxisType.Float);
    plotOptions['on'] = [['preRender', function (c) {
      c.yAxis().tickFormat(function(v) {return v + '%'; });
      potentialCalcDomain(c); }],
    ['preRedraw', potentialCalcDomain], ['pretransition', potentialMarkup]];
    plotOptions['seriesAccessor'] = function(kv) { return kv.value['Partner']; };
    plotOptions['keyAccessor']    = function(kv) { return +kv.value['RCA']; };
    plotOptions['valueAccessor']  = function(kv) {  return +kv.value['Growth']; };
    plotOptions['colorAccessor']  = function(kv) {  return kv.value['Partner']; };
    plotOptions['title'] = function(kv) {  return [ kv.value['Description'],
    kv.value['Commodity'],
    kv.value['Partner'],
    'RCA: ' + d3.format('.2f')(kv.value['RCA']),
    'Growth: ' + d3.format('.2f')(kv.value['Growth']) + '%'].join('\n'); };

    this.chartPotentialSubgroups.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, plotOptions);

    // Load Dropdown Filter by Country
    zip(this._cds.potentialImportLarge.getGroup('byCountry'), this._cds.potentialImportLarge.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('to Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          this.chartPotentialSubgroups.filterItems.push( fi );
          this.chartPotentialSubgroups.filterItems = this.chartPotentialSubgroups.filterItems.slice(0);
        }
    });

    // Load Dropdown Filter by Partner
    zip(this._cds.potentialImportLarge.getGroup('byPartner'), this._cds.potentialImportLarge.getDim('byPartner'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          this.chartPotentialSubgroups.filterItems.push( new FilterModel('from Partner', group, dim) );
          this.chartPotentialSubgroups.filterItems = this.chartPotentialSubgroups.filterItems.slice(0);
        }
    });

    // Load Dropdown Filter by Description
    zip(this._cds.potentialImportLarge.getGroup('byDesc'), this._cds.potentialImportLarge.getDim('byDesc'))
    .pipe(takeUntil(this._onDestroy$))
    .subscribe(([group, dim]) => {
      if ( group && dim) {
        const fi = new FilterModel('by Group', group, dim);

        fi.selectMultipleEnabled = true;
        fi.selectAllEnabled = false;
        this.chartPotentialSubgroups.filterItems.push( fi );
        this.chartPotentialSubgroups.filterItems = this.chartPotentialSubgroups.filterItems.slice(0);
      }
    }
  );

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartPotentialSubgroups.selectedOption = 'potential';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartPotentialSubgroups.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartPotentialSubgroups.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartPotentialSubgroups.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartPotentialSubgroups);
  }

  private _loadChartPotentialBox() {

    // Set Title and Subtitle
    this.chartPotentialBox  = new MaterialDcChartModel('importPotentialBox');
    this.chartPotentialBox.title  = 'Import Potential Box';
    this.chartPotentialBox.subtitle = '';
    this.chartPotentialBox.chartGroup = 'importBox';

    // Set Chart Dimension
    this._cds.potentialImportBox.getDim('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartPotentialBox.dimension = dim; } });

    // Set Chart Group
    this._cds.potentialImportBox.getGroup('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { this.chartPotentialBox.group = group;  } });


    // Scatterplot Chart Configuration
    const plotOptions = new ScatterChartOptionDefaults(XAxisType.Float);
    plotOptions['on'] = [['preRender', function (c) {
      c.yAxis().tickFormat(function(v) {return v + '%'; }); }], ['pretransition', potentialBoxMarkup]];
    plotOptions['x'] = d3.scaleLinear().domain([-3, 3]);
    plotOptions['y'] = d3.scaleLinear().domain([-2.5, 2.5]);
    plotOptions['seriesAccessor'] = function(kv) { return kv.value['Partner']; };
    plotOptions['keyAccessor']    = function(kv) { return +kv.value['x']; };
    plotOptions['valueAccessor']  = function(kv) {  return +kv.value['y']; };
    plotOptions['colorAccessor']  = function(kv) {  return kv.value['Partner']; };
    plotOptions['title'] = function(kv) {  return [ kv.value['Commodity'],
        kv.value['Partner']].join('\n'); };
    plotOptions['margins'] = {'top': 25, 'right': 5, 'bottom': 5, 'left': 5};

    this.chartPotentialBox.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, plotOptions);

    // Load Dropdown Filter by Country
    zip(this._cds.potentialImportBox.getGroup('byCountry'), this._cds.potentialImportBox.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('to Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          this.chartPotentialBox.filterItems.push( fi );
          // need to do this so the array is updated in angular, otherwise angular doesn't know there is a change to the array
          this.chartPotentialBox.filterItems = this.chartPotentialBox.filterItems.slice(0);
        }
      }
    );

    // Load Dropdown Filter by Commodity
    zip(this._cds.potentialImportBox.getGroup('byCommodity'), this._cds.potentialImportBox.getDim('byCommodity'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('by Subgroup', group, dim);
          fi.selectDefault = 'Aircraft, spacecraft and parts thereof';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          this.chartPotentialBox.filterItems.push( fi );
          this.chartPotentialBox.filterItems = this.chartPotentialBox.filterItems.slice(0);
        }
      }
    );

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartPotentialBox.selectedOption = 'potential';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartPotentialBox.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });

    // Set Dialog Data
    this._cds.info.getInfo(this.chartPotentialBox.name).pipe(takeUntil(this._onDestroy$)).subscribe(
      (data: ChartInfoDialogData) => {  if (data) { this.chartPotentialBox.dialogData = data;  } });

    // Add to array for easier display in view
    this.chartModels.push(this.chartPotentialBox);
  }

}
