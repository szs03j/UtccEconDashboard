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

import { zip} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as d3 from 'd3';
import * as dc from 'dc';

@Component({
  selector: 'app-chart-group-export-potential',
  templateUrl: './chart-group-export-potential.component.html',
  styleUrls: ['./chart-group-export-potential.component.css', '../muuri-grid-group/muuri-grid-group.component.css']
})
export class ChartGroupExportPotentialComponent extends MuuriGridGroupComponent implements OnInit {

  constructor(private _cds: ChartDataService) { super(); }

  public chartPotentialGroups: MaterialDcChartModel;
  public chartPotentialSubgroups: MaterialDcChartModel;
  public chartPotentialBox: MaterialDcChartModel;

  ngOnInit() {
    this._loadChartPotentialBox();
    this._loadChartPotentialGroups();
    this._loadChartPotentialSubgroups();
  }

  private _loadChartPotentialGroups() {

    // Set Title and Subtitle
    this.chartPotentialGroups          = new MaterialDcChartModel('exportPotential');
    this.chartPotentialGroups.title    = 'Export Potential Groups';
    this.chartPotentialGroups.subtitle = '';
    this.chartPotentialGroups.chartGroup = 'exportGroups';

    // Set Chart Dimension
    this._cds.potentialExport.getDim('byPartnerDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartPotentialGroups.dimension = dim; } });

    // Set Chart Group
    this._cds.potentialExport.getGroup('byPartnerDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
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
    zip(this._cds.potentialExport.getGroup('byCountry'), this._cds.potentialExport.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('from Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          this.chartPotentialGroups.filterItems.push( fi );
          this.chartPotentialGroups.filterItems = this.chartPotentialGroups.filterItems.slice(0);
        }
    });

    // Load Dropdown Filter by Partner
    zip(this._cds.potentialExport.getGroup('byPartner'), this._cds.potentialExport.getDim('byPartner'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          this.chartPotentialGroups.filterItems.push( new FilterModel('to Partner', group, dim) );
          this.chartPotentialGroups.filterItems = this.chartPotentialGroups.filterItems.slice(0);
        }
    });

    // Set Default Option when chart is displayed (this is the chartOptions key)
    this.chartPotentialGroups.selectedOption = 'potential';

    // Wire the muuri grid to refresh layout when the chart loaded changes
    this.chartPotentialGroups.chartLoadedChange()
      .pipe( takeUntil(this._onDestroy$) )
      .subscribe( (cl: boolean) => { if (cl) { this._refreshGridLayout(); } });
  }

  private _loadChartPotentialSubgroups() {

    // Set Title and Subtitle
    this.chartPotentialSubgroups          = new MaterialDcChartModel('exportPotentialSubgroups');
    this.chartPotentialSubgroups .title    = 'Export Potential Subgrps';
    this.chartPotentialSubgroups .subtitle = '';
    this.chartPotentialSubgroups.chartGroup = 'exportSubgroups';

    // Set Chart Dimension
    this._cds.potentialExportLarge.getDim('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartPotentialSubgroups.dimension = dim; } });

    // Set Chart Group
    this._cds.potentialExportLarge.getGroup('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
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
    zip(this._cds.potentialExportLarge.getGroup('byCountry'), this._cds.potentialExportLarge.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('from Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          this.chartPotentialSubgroups.filterItems.push( fi );
          this.chartPotentialSubgroups.filterItems = this.chartPotentialSubgroups.filterItems.slice(0);
        }
    });

    // Load Dropdown Filter by Partner
    zip(this._cds.potentialExportLarge.getGroup('byPartner'), this._cds.potentialExportLarge.getDim('byPartner'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          this.chartPotentialSubgroups.filterItems.push( new FilterModel('to Partner', group, dim) );
          this.chartPotentialSubgroups.filterItems = this.chartPotentialSubgroups.filterItems.slice(0);
        }
    });

    // Load Dropdown Filter by Description
    zip(this._cds.potentialExportLarge.getGroup('byDesc'), this._cds.potentialExportLarge.getDim('byDesc'))
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
  }

  private _loadChartPotentialBox() {

    // Set Title and Subtitle
    this.chartPotentialBox  = new MaterialDcChartModel('exportPotentialBox');
    this.chartPotentialBox.title  = 'Export Potential Box';
    this.chartPotentialBox.subtitle = '';
    this.chartPotentialBox.chartGroup = 'exportBox';

    // Set Chart Dimension
    this._cds.potentialExportBox.getDim('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { this.chartPotentialBox.dimension = dim; } });

    // Set Chart Group
    this._cds.potentialExportBox.getGroup('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
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
    plotOptions['title'] = function(kv) {  return [ kv.value['Description'],
        kv.value['Partner'],
        'RCA: ' + d3.format('.2f')(kv.value['RCA']),
        'Growth: ' + d3.format('.2f')(kv.value['Growth']) + '%'].join('\n'); };
    plotOptions['margins'] = {'top': 25, 'right': 5, 'bottom': 5, 'left': 5};

    this.chartPotentialBox.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, plotOptions);

    // Load Dropdown Filter by Country
    zip(this._cds.potentialExportBox.getGroup('byCountry'), this._cds.potentialExportBox.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('from Country', group, dim);
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
    zip(this._cds.potentialExportBox.getGroup('byCommodity'), this._cds.potentialExportBox.getDim('byCommodity'))
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
  }

}
