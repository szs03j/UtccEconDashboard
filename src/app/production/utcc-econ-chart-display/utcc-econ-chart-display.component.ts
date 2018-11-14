import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import * as dc from 'dc';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map, takeUntil } from 'rxjs/operators';
import { MaterialDcChartModel } from '../material-dc-chart/material-dc-chart-model';
import { DcChartOptions } from '../dc-chart/dc-chart-options';
import { DcChartType } from '../dc-chart/dc-chart-type.enum';
import { Observable, zip, Subject } from 'rxjs';
import { ChartDataService } from '../services/chart-data.service';
import { FilterModel } from '../material-dc-chart/filter-model';
import { ChartGroupModel } from '../chart-group/chart-group-model';
import { MaterialDcNumberGroupModel } from '../material-dc-number-group/material-dc-number-group-model';
import { NumberGroupChartModel } from '../number-group-chart/number-group-chart-model';

@Component({
  selector: 'app-utcc-econ-chart-display',
  templateUrl: './utcc-econ-chart-display.component.html',
  styleUrls: ['./utcc-econ-chart-display.component.css']
})
export class UtccEconChartDisplayComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor( private _cds: ChartDataService, private _breakpointObserver: BreakpointObserver ) { }

  title = 'UtccEconDashboard';
  private _onDestroy$ = new Subject();
  public chartGroups = new Array<ChartGroupModel>();

  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  ngAfterViewInit() {

  }

  ngOnInit() {
    this._loadData();
  }

  ngOnDestroy() {
    this._onDestroy$.next();
  }

  private _getChartOptions(name: string) {
    const height  = 225;
    const width   = 300;
    const numberFormat = d3.format('.2f');
    const useViewBoxResizing = true;
    const usdTitle = function(kv) { return kv.key + '\n' + numberFormat(kv.value) + ' billion USD'; };

    let options = {};
    switch (name) {
      case 'number':
      options = {
        'height': height,
        'width': width,
        'formatNumber': numberFormat,
        'clipPadding': 10,
        'margins': {'top': 5, 'right': 0, 'bottom': 20, 'left': 30},
        'useViewBoxResizing': useViewBoxResizing
      };
      break;
      case 'bar':
      options = {
        'height': height,
        'width': width,
        'x': d3.scaleBand(),
        'xUnits': dc.units.ordinal,
        'elasticX': true,
        'elasticY': true,
        'brushOn': false,
        'centerBar': false,
        'colorAccessor': (d) =>  (d.value >= 0) ? 'positive' : 'negative',
        'colors': d3.scaleOrdinal().domain(['positive', 'negative']).range(['#377eb8' , '#e6550d']),
        'renderHorizontalGridLines': true,
        'clipPadding': 10,
        'margins': {'top': 5, 'right': 0, 'bottom': 20, 'left': 30},
        'title': usdTitle,
        'useViewBoxResizing': useViewBoxResizing
      };
      break;
      case 'pie':
      options = {
        'height': height,
        'width': width,
        'slicesCap': 8,
        'margins': {'top': 0, 'right': 0, 'bottom': 0, 'left': 0},
        'title': usdTitle,
        'useViewBoxResizing': useViewBoxResizing
      };
      break;
      case 'row':
      options = {
        'height': height,
        'width': width,
        'x': d3.scaleBand(),
        'xUnits': dc.units.ordinal,
        'elasticX': true,
        'elasticY': true,
        'brushOn': false,
        'renderVerticalGridLines': true,
        'clipPadding': 10,
        'cap': 8,
        'margins': {'top': 0, 'right': 0, 'bottom': 20, 'left': 5},
        'title': usdTitle,
        'useViewBoxResizing': useViewBoxResizing
      };
      break;

      case 'map':
      options = {
        'width':  width,
        'height': height,
        'colors': d3.scaleQuantize().range(
        ['#E2F2FF', '#C4E4FF', '#9ED2FF', '#81C5FF', '#6BBAFF', '#51AEFF', '#36A2FF', '#1E96FF', '#0089FF', '#0061B5'] ),
        'colorDomain': [0, 1500],
        'colorAccessor': function(d) {  return d ? +d : 0; },
        // 'projection': geoOrthographic().rotate([250, 0, 0]).fitExtent([[0, 0], [width, height]], geoJson),
        // 'overlayGeoJson': [geoJson['features'], 'state', function (d) { return d.properties.name; }],
        'title': usdTitle,
        'useViewBoxResizing': useViewBoxResizing
      };
      break;

      case 'potential':
      const drawMarkup = function (chart) {
        const data = chart.group().all();
        // change from +d.value to chart.valueAccessor()(d);
        const avg = d3.mean(data, function (d) { return chart.valueAccessor()(d); });

        const lineFunction = d3.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .curve(d3.curveLinear);

        const xVal = 1;
        const xPos = chart.x()(xVal);
        const vertLineData = [
          {x: xPos, y: 0},
          {x: xPos, y: chart.effectiveHeight()}
        ];

        const yVal = avg;
        const yPos = chart.y()(yVal);
        const horzLineData = [
          {x: chart.x().range()[0], y: yPos },
          {x: chart.x().range()[1], y: yPos }
        ];

        const chartBody = chart.chartBodyG();
        let path2 = chartBody.selectAll('path.rcaAxisLine').data([horzLineData, vertLineData]);
        path2 = path2
          .enter()
            .append('path')
            .attr('class', 'rcaAxisLine')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .style('stroke-dasharray', ('13,5'))
          .merge(path2);
        path2.attr('d', lineFunction);

        const yLen = horzLineData[1].x - horzLineData[0].x;
        const xOffset = yLen / 4;
        const xLen = vertLineData[1].y - vertLineData[0].y;
        const yOffset = xLen / 4;
        const textData = [
          { 'text': 'Intro', 'x': xPos - xOffset, 'y': yPos - yOffset },
          { 'text': 'Star', 'x': xPos + xOffset, 'y': yPos - yOffset },
          { 'text': 'Dog', 'x': xPos - xOffset, 'y': yPos + yOffset },
          { 'text': 'Cow', 'x': xPos + xOffset, 'y': yPos + yOffset }];

        let text = chartBody.selectAll('text').data(textData);
        text = text
          .enter()
            .append('text')
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; })
            .text( function(d) { return d.text; })
            .attr( 'opacity', .65 );

      };

      const calcDomain = function (chart) {
        const data = chart.group().all();
        const xMinMax = d3.extent(data, function (e) { return chart.keyAccessor()(e); });
        const xRight = xMinMax[1] - 1;
        const xLeft  = 1 - xMinMax[0];
        const largerXDif = xRight > xLeft ? xRight : xLeft;
        const xDomain = [1 - largerXDif, 1 + largerXDif];
        chart.x(d3.scaleLinear().domain(xDomain));

        const yMinMax = d3.extent(data, function (e) { return chart.valueAccessor()(e); });
        const avg = d3.mean(data, function (e) { return chart.valueAccessor()(e); });
        const yTop = yMinMax[1] !== yMinMax[0] ? yMinMax[1] - avg : 100;
        const yBot = yMinMax[1] !== yMinMax[0] ? avg - yMinMax[0] : -100;
        const largerYDif = yTop > yBot ? yTop : yBot;
        const yDomain = [avg - largerYDif, avg + largerYDif];
        chart.y(d3.scaleLinear().domain(yDomain));

      };

      options = {
        'width': width,
        'height': height,
        'chart': function(c) { return dc.scatterPlot(c).symbolSize(6).highlightedSize(8); },
        'elasticX': false,
        'elasticY': false,
        'brushOn': false,
        'clipPadding': 10,
        'x': d3.scaleLinear(),
        'seriesAccessor': function(kv) { return kv.value['Partner']; },
        'keyAccessor': function(kv) { return +kv.value['RCA']; },
        'valueAccessor': function(kv) {  return +kv.value['Growth']; },
        'colorAccessor': function(kv) {  return kv.value['Partner']; },
        'title': function(kv) {  return [ kv.value['Description'],
            kv.value['Partner'],
            'RCA: ' + numberFormat(kv.value['RCA']),
            'Growth: ' + numberFormat(kv.value['Growth']) + '%'].join('\n'); },
        'margins': {'top': 25, 'right': 5, 'bottom': 20, 'left': 40},
        'legend': dc.legend().x(15).y(0).itemHeight(9).gap(8).horizontal(true).autoItemWidth(true),
        'useViewBoxResizing': useViewBoxResizing,
        'on': [['preRender', function(chart) {
          chart.yAxis().tickFormat(function(v) {return v + '%'; });
          calcDomain(chart); }],
              ['preRedraw', function(chart) { calcDomain(chart); }],
              ['pretransition', function(chart) { drawMarkup(chart); }]]
      };
      break;

      case 'potentialBox':
      const drawMarkup2 = function (chart) {

        const lineFunction = d3.line()
          .x(function(d) { return d.x; })
          .y(function(d) { return d.y; })
          .curve(d3.curveLinear);

        const xVal = 0;
        const xPos = chart.x()(xVal);
        const vertLineData = [
          {x: xPos, y: 0},
          {x: xPos, y: chart.effectiveHeight()}
        ];

        const yVal = 0;
        const yPos = chart.y()(yVal);
        const horzLineData = [
          {x: chart.x().range()[0], y: yPos },
          {x: chart.x().range()[1], y: yPos }
        ];

        const chartBody = chart.chartBodyG();
        let path2 = chartBody.selectAll('path.rcaAxisLine').data([horzLineData, vertLineData]);
        path2 = path2
          .enter()
            .append('path')
            .attr('class', 'rcaAxisLine')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .style('stroke-dasharray', ('13,5'))
          .merge(path2);
        path2.attr('d', lineFunction);

        const yLen = horzLineData[1].x - horzLineData[0].x;
        const xOffset = yLen / 4;
        const xLen = vertLineData[1].y - vertLineData[0].y;
        const yOffset = xLen / 4;
        const textData = [
          { 'text': 'Intro', 'x': xPos - xOffset, 'y': yPos - yOffset },
          { 'text': 'Star', 'x': xPos + xOffset, 'y': yPos - yOffset },
          { 'text': 'Dog', 'x': xPos - xOffset, 'y': yPos + yOffset },
          { 'text': 'Cow', 'x': xPos + xOffset, 'y': yPos + yOffset }];

        let text = chartBody.selectAll('text').data(textData);
        text = text
          .enter()
            .append('text')
            .attr('x', function(d) { return d.x; })
            .attr('y', function(d) { return d.y; })
            .text( function(d) { return d.text; })
            .attr( 'opacity', .65 );

      };

      options = {
        'width': width,
        'height': height,
        'chart': function(c) { return dc.scatterPlot(c).symbolSize(6).highlightedSize(8); },
        'elasticX': false,
        'elasticY': false,
        'brushOn': false,
        'clipPadding': 10,
        'x': d3.scaleLinear().domain([-3, 3]),
        'xAxisLabel': '',
        'y': d3.scaleLinear().domain([-2.5, 2.5]),
        'seriesAccessor': function(kv) { return kv.value['Partner']; },
        'keyAccessor': function(kv) { return +kv.value['x']; },
        'valueAccessor': function(kv) {  return +kv.value['y']; },
        'colorAccessor': function(kv) {  return kv.value['Partner']; },
        'title': function(kv) {  return [ kv.value['Description'],
            kv.value['Partner'],
            'RCA: ' + numberFormat(kv.value['RCA']),
            'Growth: ' + numberFormat(kv.value['Growth']) + '%'].join('\n'); },
        'margins': {'top': 25, 'right': 5, 'bottom': 5, 'left': 5},
        'legend': dc.legend().x(15).y(0).itemHeight(9).gap(8).horizontal(true).autoItemWidth(true),
        'useViewBoxResizing': useViewBoxResizing,
        'on': ['pretransition', function(chart) { drawMarkup2(chart); }]
      };
      break;

      case 'series':
      options = {
        'width': width,
        'height': height,
        'elasticX': true,
        'elasticY': true,
        'brushOn': false,
        'clipPadding': 10,
        'x': d3.scaleTime(),
        'xUnits': d3.timeYears,
        'seriesAccessor': function(kv) { return kv.key[0]; },
        'keyAccessor': function(kv) {  return kv.key[1]; },
        'valueAccessor': function(kv) {  return +kv.value; },
        'margins': {'top': 15, 'right': 5, 'bottom': 20, 'left': 28},
        'legend': dc.legend().x(35).y(0).itemHeight(9).gap(8).horizontal(true).itemWidth(75).legendWidth(225),
        'useViewBoxResizing': useViewBoxResizing
        };
      break;
    }

    return options;
  }

  private _loadExportsGroup() {

    const exportsGroup = new ChartGroupModel('Exports', 'exports');

    /* create exportsByCountry chart model */
    const exportsByCountry    = new MaterialDcChartModel('exportsByCountry');
    exportsByCountry.title    = 'Exports';
    exportsByCountry.subtitle = 'by Country';
    this._cds.export.getDim('byCountry').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { exportsByCountry.dimension = dim; } });

    this._cds.export.getGroup('byCountry').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { exportsByCountry.group = group;  } });

    exportsByCountry.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, this._getChartOptions('bar'));
    exportsByCountry.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, this._getChartOptions('pie'));
    this._cds.seaJson.getGeoJson().pipe(takeUntil(this._onDestroy$)).subscribe(
      (geoJson: any) => {
        if (geoJson) {
          const mapOpt = this._getChartOptions('map');
          mapOpt['projection'] =
            d3.geoOrthographic().rotate([250, 0, 0]).fitExtent([[0, 0], [mapOpt['width'], mapOpt['height']]], geoJson );
          mapOpt['overlayGeoJson'] = [geoJson['features'], 'state', function (d) { return d.properties.name; }];
          exportsByCountry.chartOptions['map'] = new DcChartOptions('map', DcChartType.GeoChoropleth, mapOpt);
          exportsByCountry.chartOptions = this._clone( exportsByCountry.chartOptions );
        }
      }
    );
    exportsByCountry.selectedOption = 'map';
    exportsGroup.chartModels.push(exportsByCountry);

    /* create exportsByDesc chart model */
    const exportsByDesc     = new MaterialDcChartModel('exportsByDesc');
    exportsByDesc.title     = 'Exports';
    exportsByDesc.subtitle  = 'by Product';

    this._cds.export.getDim('byDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { exportsByDesc.dimension = dim; } });

    this._cds.export.getGroup('byDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { exportsByDesc.group = group;  } });

    exportsByDesc.chartOptions['row'] = new DcChartOptions('row', DcChartType.Row, this._getChartOptions('row'));
    exportsByDesc.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, this._getChartOptions('pie'));
    exportsByDesc.selectedOption = 'row';
    exportsGroup.chartModels.push(exportsByDesc);

    /* create exportsByYear chart model */
    const exportsByYear     = new MaterialDcChartModel('exportsByYear');
    exportsByYear.title     = 'Exports';
    exportsByYear.subtitle  = 'by Year';
    this._cds.export.getDim('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { exportsByYear.dimension = dim; } });

    this._cds.export.getGroup('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { exportsByYear.group = group;  } });

    exportsByYear.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, this._getChartOptions('bar'));
    exportsByYear.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, this._getChartOptions('pie'));
    this._cds.import.getGroup('byYearChg').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) {
        const opt = this._getChartOptions('bar');
        opt['group'] = group;
        exportsByYear.chartOptions['barPctChg'] = new DcChartOptions('% chg', DcChartType.Bar, opt);
        exportsByYear.chartOptions['barPctChg'].options['on'] = ['preRender', function(chart) {
          chart.yAxis().tickFormat(function(v) {return v + '%'; });
          chart.title( function(kv) { return d3.format('+.2%')(kv.value / 100); });
        }];
        // _clone creates a new instance which triggers updates in dcchartcomponent
        exportsByYear.chartOptions = this._clone(exportsByYear.chartOptions);
      }
    });
    exportsByYear.selectedOption = 'bar';
    exportsGroup.chartModels.push(exportsByYear);

    /* create exportsByPartner chart model */
    const exportsByPartner    = new MaterialDcChartModel('exportsByPartner');
    exportsByPartner.title    = 'Exports';
    exportsByPartner.subtitle = 'by Partner';
    this._cds.export.getDim('byPartner').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { exportsByPartner.dimension = dim; } });

    this._cds.export.getGroup('byPartner').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { exportsByPartner.group = group;  } });

    exportsByPartner.chartOptions['row'] = new DcChartOptions('row', DcChartType.Row, this._getChartOptions('row'));
    exportsByPartner.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, this._getChartOptions('pie'));
    exportsByPartner.selectedOption = 'row';
    exportsGroup.chartModels.push(exportsByPartner);

    this.chartGroups.push(exportsGroup);
  }

  private _loadImportsGroup() {
    const importsGroup = new ChartGroupModel('Imports', 'imports' );

    /* create importsByCountry chart model */
    const importsByCountry    = new MaterialDcChartModel('importsByCountry');
    importsByCountry.title    = 'Imports';
    importsByCountry.subtitle = 'by Country';
    this._cds.import.getDim('byCountry').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { importsByCountry.dimension = dim; } });

    this._cds.import.getGroup('byCountry').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { importsByCountry.group = group;  } });

    importsByCountry.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, this._getChartOptions('bar'));
    importsByCountry.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, this._getChartOptions('pie'));
    this._cds.seaJson.getGeoJson().pipe(takeUntil(this._onDestroy$)).subscribe(
      (geoJson: any) => {
        if (geoJson) {
          const mapOpt = this._getChartOptions('map');
          mapOpt['projection'] =
          d3.geoOrthographic().rotate([250, 0, 0]).fitExtent([[0, 0], [mapOpt['width'], mapOpt['height']]], geoJson );
          mapOpt['overlayGeoJson'] = [geoJson['features'], 'state', function (d) { return d.properties.name; }];
          importsByCountry.chartOptions['map'] = new DcChartOptions('map', DcChartType.GeoChoropleth, mapOpt);
          importsByCountry.chartOptions = this._clone( importsByCountry.chartOptions );
        }
      }
    );
    importsByCountry.selectedOption = 'map';
    importsGroup.chartModels.push(importsByCountry);

    /* create importsByDesc chart model */
    const importsByDesc     = new MaterialDcChartModel('importsByDesc');
    importsByDesc.title     = 'Imports';
    importsByDesc.subtitle  = 'by Product';

    this._cds.import.getDim('byDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { importsByDesc.dimension = dim; } });

    this._cds.import.getGroup('byDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { importsByDesc.group = group;  } });

    importsByDesc.chartOptions['row'] = new DcChartOptions('row', DcChartType.Row, this._getChartOptions('row'));
    importsByDesc.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, this._getChartOptions('pie'));
    importsByDesc.selectedOption = 'row';
    importsGroup.chartModels.push(importsByDesc);

    /* create importsByYear chart model */
    const importsByYear     = new MaterialDcChartModel('importsByYear');
    importsByYear.title     = 'Imports';
    importsByYear.subtitle  = 'by Year';
    this._cds.import.getDim('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { importsByYear.dimension = dim; } });

    this._cds.import.getGroup('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { importsByYear.group = group;  } });

    importsByYear.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, this._getChartOptions('bar'));
    importsByYear.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, this._getChartOptions('pie'));
    this._cds.import.getGroup('byYearChg').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) {
        const opt = this._getChartOptions('bar');
        opt['group'] = group;
        importsByYear.chartOptions['barPctChg'] = new DcChartOptions('% chg', DcChartType.Bar, opt);
        importsByYear.chartOptions['barPctChg'].options['on'] = ['preRender', function(chart) {
          chart.yAxis().tickFormat(function(v) {return v + '%'; });
          chart.title( function(kv) { return d3.format('+.2%')(kv.value / 100); });
        }];
        // _clone creates a new instance which triggers updates in dcchartcomponent
        importsByYear.chartOptions = this._clone(importsByYear.chartOptions);
      }
    });
    importsByYear.selectedOption = 'bar';
    importsGroup.chartModels.push(importsByYear);

    /* create importsByPartner chart model */
    const importsByPartner    = new MaterialDcChartModel('importsByPartner');
    importsByPartner.title    = 'Imports';
    importsByPartner.subtitle = 'by Partner';
    this._cds.import.getDim('byPartner').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { importsByPartner.dimension = dim; } });

    this._cds.import.getGroup('byPartner').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { importsByPartner.group = group;  } });

    importsByPartner.chartOptions['row'] = new DcChartOptions('row', DcChartType.Row, this._getChartOptions('row'));
    importsByPartner.chartOptions['pie'] = new DcChartOptions('pie', DcChartType.Pie, this._getChartOptions('pie'));
    importsByPartner.selectedOption = 'row';
    importsGroup.chartModels.push(importsByPartner);

    this.chartGroups.push(importsGroup);
  }

  private _loadExportPotentialGroup() {
    const exportPotentialGroup = new ChartGroupModel('Export Potential', 'export-potential' );

    // Export Potential Small Chart ---------------------------------------------------------------------
    const exportPotential    = new MaterialDcChartModel('exportPotential');
    exportPotential.title    = 'Export Potential Groups';
    exportPotential.subtitle = '';

    this._cds.potentialExport.getDim('byPartnerDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { exportPotential.dimension = dim; } });

    this._cds.potentialExport.getGroup('byPartnerDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { exportPotential.group = group;  } });

    exportPotential.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, this._getChartOptions('potential'));
    exportPotential.selectedOption = 'potential';

    zip(this._cds.potentialExport.getGroup('byCountry'), this._cds.potentialExport.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('from Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          exportPotential.filterItems.push( fi );
          exportPotential.filterItems = exportPotential.filterItems.slice(0);
        }
    });

    zip(this._cds.potentialExport.getGroup('byPartner'), this._cds.potentialExport.getDim('byPartner'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          exportPotential.filterItems.push( new FilterModel('to Partner', group, dim) );
          exportPotential.filterItems = exportPotential.filterItems.slice(0);
        }
    });

    exportPotentialGroup.chartModels.push(exportPotential);

    // Export Potential Large Chart --------------------------------------------------------------------
    const exportPotentialLarge  = new MaterialDcChartModel('exportPotentialLarge');
    exportPotentialLarge.title  = 'Export Potential Subgroups';
    exportPotentialLarge.subtitle = '';

    this._cds.potentialExportLarge.getDim('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { exportPotentialLarge.dimension = dim; } });

    this._cds.potentialExportLarge.getGroup('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { exportPotentialLarge.group = group;  } });

    exportPotentialLarge.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, this._getChartOptions('potential'));
    exportPotentialLarge.selectedOption = 'potential';
    exportPotentialLarge.chartOptions['potential'].options['title'] = function(kv) {
      return [ kv.value['Description'],
      kv.value['Commodity'],
      kv.value['Partner'],
      'RCA: ' + d3.format('.2f')(kv.value['RCA']),
      'Growth: ' + d3.format('.2f')(kv.value['Growth']) + '%'].join('\n'); };

    zip(this._cds.potentialExportLarge.getGroup('byCountry'), this._cds.potentialExportLarge.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('from Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          exportPotentialLarge.filterItems.push( fi );
          // need to do this so the array is updated in angular, otherwise angular doesn't know there is a change to the array
          exportPotentialLarge.filterItems = exportPotentialLarge.filterItems.slice(0);
        }
      }
    );

    zip(this._cds.potentialExportLarge.getGroup('byPartner'), this._cds.potentialExportLarge.getDim('byPartner'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('to Partner', group, dim);
         // fi.selectDefault = 'Cambodia';
          fi.selectMultipleEnabled = true;
          fi.selectAllEnabled = false;
          exportPotentialLarge.filterItems.push( fi );
          exportPotentialLarge.filterItems = exportPotentialLarge.filterItems.slice(0);
        }
      }
    );

    zip(this._cds.potentialExportLarge.getGroup('byDesc'), this._cds.potentialExportLarge.getDim('byDesc'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('by Group', group, dim);
        // fi.selectDefault = 'Cambodia';
          fi.selectMultipleEnabled = true;
          fi.selectAllEnabled = false;
          exportPotentialLarge.filterItems.push( fi );
          exportPotentialLarge.filterItems = exportPotentialLarge.filterItems.slice(0);
        }
      }
    );

    exportPotentialGroup.chartModels.push(exportPotentialLarge);

    // Export Potential Box Chart ----------------------------------------------------------------------------
    const exportPotentialBox  = new MaterialDcChartModel('exportPotentialBox');
    exportPotentialBox.title  = 'Export Potential Box';
    exportPotentialBox.subtitle = '';

    this._cds.potentialExportBox.getDim('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { exportPotentialBox.dimension = dim; } });

    this._cds.potentialExportBox.getGroup('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { exportPotentialBox.group = group;  } });

    exportPotentialBox.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, this._getChartOptions('potentialBox'));
    exportPotentialBox.selectedOption = 'potential';
    exportPotentialBox.chartOptions['potential'].options['title'] = function(kv) {
      return [ kv.value['Description'],
      kv.value['Commodity'],
      kv.value['Partner'] ].join('\n');
    };

    zip(this._cds.potentialExportBox.getGroup('byCountry'), this._cds.potentialExportBox.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('from Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          exportPotentialBox.filterItems.push( fi );
          // need to do this so the array is updated in angular, otherwise angular doesn't know there is a change to the array
          exportPotentialBox.filterItems = exportPotentialBox.filterItems.slice(0);
        }
      }
    );

    zip(this._cds.potentialExportBox.getGroup('byCommodity'), this._cds.potentialExportBox.getDim('byCommodity'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('by Subgroup', group, dim);
          fi.selectDefault = 'Aircraft, spacecraft and parts thereof';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          exportPotentialBox.filterItems.push( fi );
          exportPotentialBox.filterItems = exportPotentialBox.filterItems.slice(0);
        }
      }
    );

    exportPotentialGroup.chartModels.push(exportPotentialBox);

    // Add the entire group of charts to be displayed
    this.chartGroups.push(exportPotentialGroup);
  }

  private _loadImportPotentialGroup() {
    const importPotentialGroup = new ChartGroupModel('Import Potential', 'import-potential' );

    const importPotential    = new MaterialDcChartModel('importPotential');
    importPotential.title    = 'Import Potential Groups';
    importPotential.subtitle = '';

    this._cds.potentialImport.getDim('byPartnerDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { importPotential.dimension = dim; } });

    this._cds.potentialImport.getGroup('byPartnerDesc').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { importPotential.group = group;  } });

    importPotential.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, this._getChartOptions('potential'));
    importPotential.selectedOption = 'potential';
    zip(this._cds.potentialImport.getGroup('byCountry'), this._cds.potentialImport.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('to Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          importPotential.filterItems.push( fi );
          importPotential.filterItems = importPotential.filterItems.slice(0);
        }
    });

    zip(this._cds.potentialImport.getGroup('byPartner'), this._cds.potentialImport.getDim('byPartner'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          importPotential.filterItems.push( new FilterModel('from Partner', group, dim) );
          importPotential.filterItems = importPotential.filterItems.slice(0);
        }
    });

    importPotentialGroup.chartModels.push(importPotential);

    // Import Potential Large Chart --------------------------------------------------------------------
    const importPotentialLarge  = new MaterialDcChartModel('importPotentialLarge');
    importPotentialLarge.title  = 'Import Potential Subgroups';
    importPotentialLarge.subtitle = '';

    this._cds.potentialImportLarge.getDim('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { importPotentialLarge.dimension = dim; } });

    this._cds.potentialImportLarge.getGroup('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { importPotentialLarge.group = group;  } });

    importPotentialLarge.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, this._getChartOptions('potential'));
    importPotentialLarge.selectedOption = 'potential';
    importPotentialLarge.chartOptions['potential'].options['title'] = function(kv) {
      return [ kv.value['Description'],
      kv.value['Commodity'],
      kv.value['Partner'],
      'RCA: ' + d3.format('.2f')(kv.value['RCA']),
      'Growth: ' + d3.format('.2f')(kv.value['Growth']) + '%'].join('\n'); };

    zip(this._cds.potentialImportLarge.getGroup('byCountry'), this._cds.potentialImportLarge.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('to Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          importPotentialLarge.filterItems.push( fi );
          // need to do this so the array is updated in angular, otherwise angular doesn't know there is a change to the array
          importPotentialLarge.filterItems = importPotentialLarge.filterItems.slice(0);
        }
      }
    );

    zip(this._cds.potentialImportLarge.getGroup('byPartner'), this._cds.potentialImportLarge.getDim('byPartner'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('from Partner', group, dim);
          // fi.selectDefault = 'Cambodia';
          fi.selectMultipleEnabled = true;
          fi.selectAllEnabled = false;
          importPotentialLarge.filterItems.push( fi );
          importPotentialLarge.filterItems = importPotentialLarge.filterItems.slice(0);
        }
      }
    );

    zip(this._cds.potentialImportLarge.getGroup('byDesc'), this._cds.potentialImportLarge.getDim('byDesc'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('by Group', group, dim);
        // fi.selectDefault = 'Cambodia';
          fi.selectMultipleEnabled = true;
          fi.selectAllEnabled = false;
          importPotentialLarge.filterItems.push( fi );
          importPotentialLarge.filterItems = importPotentialLarge.filterItems.slice(0);
        }
      }
    );

    importPotentialGroup.chartModels.push(importPotentialLarge);

    // Import Potential Box Chart ----------------------------------------------------------------------------
    const importPotentialBox  = new MaterialDcChartModel('importPotentialBox');
    importPotentialBox.title  = 'Import Potential Box';
    importPotentialBox.subtitle = '';

    this._cds.potentialImportBox.getDim('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { importPotentialBox.dimension = dim; } });

    this._cds.potentialImportBox.getGroup('byPartnerHS2').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { importPotentialBox.group = group;  } });

    importPotentialBox.chartOptions['potential'] = new DcChartOptions('plot', DcChartType.Series, this._getChartOptions('potentialBox'));
    importPotentialBox.selectedOption = 'potential';
    importPotentialBox.chartOptions['potential'].options['title'] = function(kv) {
      return [ kv.value['Description'],
      kv.value['Commodity'],
      kv.value['Partner'] ].join('\n');
    };

    zip(this._cds.potentialImportBox.getGroup('byCountry'), this._cds.potentialImportBox.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('to Country', group, dim);
          fi.selectDefault = 'Thailand';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          importPotentialBox.filterItems.push( fi );
          // need to do this so the array is updated in angular, otherwise angular doesn't know there is a change to the array
          importPotentialBox.filterItems = importPotentialBox.filterItems.slice(0);
        }
      }
    );

    zip(this._cds.potentialImportBox.getGroup('byCommodity'), this._cds.potentialImportBox.getDim('byCommodity'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('by Subgroup', group, dim);
          fi.selectDefault  = 'Aircraft, spacecraft and parts thereof';
          fi.selectMultipleEnabled = false;
          fi.selectAllEnabled = false;
          importPotentialBox.filterItems.push( fi );
          importPotentialBox.filterItems = importPotentialBox.filterItems.slice(0);
        }
      }
    );

    importPotentialGroup.chartModels.push(importPotentialBox);

    this.chartGroups.push(importPotentialGroup);
  }

  private _loadGdpGroup() {
    const gdpGroup = new ChartGroupModel('GDP', 'gdp' );

    const gdp    = new MaterialDcChartModel('gdp');
    gdp.title    = 'GDP';
    gdp.subtitle = '';

    this._cds.gdp.getDim('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) {  gdp.dimension = dim; } });

    this._cds.gdp.getGroup('byYearUsd').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) {  gdp.group = group;  } });

    gdp.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, this._getChartOptions('bar'));
    gdp.chartOptions['bar'].options['x'] = d3.scaleTime();
    gdp.chartOptions['bar'].options['xUnits'] = d3.timeYears;
    gdp.chartOptions['bar'].options['title'] = function(kv) {
      return kv.key.getFullYear() +
      '\n' + d3.format('.2f')(kv.value) + ' billion USD'; };
    gdp.chartOptions['bar'].options['on'] = ['preRender', function(chart) {
      const ext = d3.extent(chart.group().all(), function(kv) { return kv.key; });
      const minDate = new Date( ext[0].getFullYear(), 0);
      minDate.setHours( minDate.getHours() - 1 );
      const maxDate = new Date( ext[1].getFullYear(), 0);
      maxDate.setFullYear( maxDate.getFullYear() + 1 );

      chart.x(d3.scaleTime().domain([minDate, maxDate]));
      chart.elasticX(false);
      }];
    gdp.selectedOption = 'bar';

    zip(this._cds.gdp.getGroup('byCountry'), this._cds.gdp.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('by Country', group, dim);
          fi.selectMultipleEnabled = false;
          fi.selectDefault = 'Thailand';
          gdp.filterItems.push( fi );
          gdp.filterItems = gdp.filterItems.slice(0);
        }
    });

    gdpGroup.chartModels.push(gdp);
    this.chartGroups.push(gdpGroup);
  }

  private _loadFXGroup() {
    const fxGroup = new ChartGroupModel('Exchange Rate', 'exchange-rate' );

    const numDisplayGrp = new MaterialDcNumberGroupModel();
    numDisplayGrp.title = 'Exchange Rate for 1 USD';

    const numDisplayGrp2 = new MaterialDcNumberGroupModel();
    numDisplayGrp2.title = 'Exchange Rate for 1 THB';

    zip(this._cds.dailyExchangeRate.getGroup('byDate'), this._cds.dailyExchangeRate.getDim('byDate'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const top = group.top(1);
          if ( top.length === 0 ) { return; }
          const row = top[0];
          numDisplayGrp.subtitle = 'as of ' + row.key;
          numDisplayGrp2.subtitle = 'as of ' + row.key;
          const thb = row.value['Thailand']['amountUsd'];
          const countries = Object.keys(row.value);
          const numDis1 = new Array<NumberGroupChartModel>();
          const numDis2 = new Array<NumberGroupChartModel>();
          countries.sort(d3.ascending);
          countries.forEach( (d) => {
            const currencyName = row.value[d]['currencyName'];
            const chartModel = new NumberGroupChartModel(d);
            const chartModel2 = new NumberGroupChartModel(d);
            chartModel.title = d;
            chartModel2.title = d;
            chartModel.subtitle = currencyName;
            chartModel2.subtitle = currencyName;
            chartModel.chartOptions['number'] = new DcChartOptions('number', DcChartType.Number, this._getChartOptions('number'));
            chartModel2.chartOptions['number'] = new DcChartOptions('number', DcChartType.Number, this._getChartOptions('number'));
            chartModel.chartOptions['number'].options['valueAccessor'] = function (kv) { return kv.value[d]['amountUsd']; };
            chartModel2.chartOptions['number'].options['valueAccessor'] = function (kv) { return kv.value[d]['amountUsd'] / thb; };
            chartModel.selectedOption = 'number';
            chartModel2.selectedOption = 'number';
            chartModel.group = group;
            chartModel2.group = group;
            chartModel.dimension = dim;
            chartModel2.dimension = dim;
            numDis1.push(chartModel);
            numDis2.push(chartModel2);
          });
          numDisplayGrp.numberDisplays = numDis1;
          numDisplayGrp2.numberDisplays = numDis2;
        }
    });

    fxGroup.chartModels.push(numDisplayGrp);
    fxGroup.chartModels.push(numDisplayGrp2);

    const fx    = new MaterialDcChartModel('fx');
    fx.title    = 'Exchange Rate';
    fx.subtitle = '';

    this._cds.exchangeRate.getDim('byCountryDate').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) {   fx.dimension = dim; } });

    this._cds.exchangeRate.getGroup('byCountryDate').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) {   fx.group = group;  } });

    fx.chartOptions['line'] = new DcChartOptions('line', DcChartType.Series, this._getChartOptions('series'));
    fx.chartOptions['line'].options['xUnits'] = d3.timeDays;
    const calcDomain = function (chart) {
      const ext = d3.extent(chart.group().all(), function(kv) { return kv.value; });
      chart.y(d3.scaleLinear().domain(ext));
    };

    fx.chartOptions['line'].options['on'] = [['preRender', calcDomain], ['preRedraw', calcDomain]];
    fx.chartOptions['line'].options['elasticY'] = false;
    fx.chartOptions['line'].options['title'] = function(d) {
      return d.key[1].getDate() + '-' + d.key[1].getMonth()  + '-' + d.key[1].getFullYear() + ' : ' + parseFloat(d.value).toFixed(2); };
    fx.selectedOption = 'line';

    zip(this._cds.exchangeRate.getGroup('byCountry'), this._cds.exchangeRate.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if ( group && dim) {
          const fi = new FilterModel('by Country', group, dim);
          fi.selectMultipleEnabled = true;
          fx.filterItems.push( fi );
          fx.filterItems = fx.filterItems.slice(0); // must do this so angular recognizes that the array was updated
        }
    });

    fxGroup.chartModels.push(fx);
    this.chartGroups.push(fxGroup);
  }

  private _loadData() {
    this._loadImportsGroup();
    this._loadExportsGroup();
    this._loadImportPotentialGroup();
    this._loadExportPotentialGroup();
    this._loadGdpGroup();
    this._loadFXGroup();
  }

  private _clone( obj: any ): any {
    const newObj = {};
    Object.keys(obj).forEach( (k) => newObj[k] = obj[k] );
    return newObj;
  }
}