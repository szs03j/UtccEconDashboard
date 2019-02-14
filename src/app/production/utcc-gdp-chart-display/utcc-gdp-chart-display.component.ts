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
import { NumberGroupChartModel } from '../number-group-chart/number-group-chart-model';

@Component({
  selector: 'app-utcc-gdp-chart-display',
  templateUrl: './utcc-gdp-chart-display.component.html',
  styleUrls: ['./utcc-gdp-chart-display.component.css']
})
export class UtccGdpChartDisplayComponent implements OnInit {

  constructor( private _cds: ChartDataService, private _breakpointObserver: BreakpointObserver ) { }

  ngOnInit() {
    this._loadData();
  }

  ngOnDestroy() {
    this._onDestroy$.next();
  }
  title = 'UtccEconDashboardExport';
  private _onDestroy$ = new Subject();
  public chartGroups = new Array<ChartGroupModel>();

  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );

  private _getChartOptions(name: string) {
    const height = 225;
    const width = 300;
    const numberFormat = d3.format('.2f');
    const useViewBoxResizing = true;
    const usdTitle = function (kv) { return kv.key + '\n' + numberFormat(kv.value) + ' billion USD'; };

    let options = {};
    switch (name) {
      case 'number':
        options = {
          'height': height,
          'width': width,
          'formatNumber': numberFormat,
          'clipPadding': 10,
          'margins': { 'top': 5, 'right': 0, 'bottom': 20, 'left': 30 },
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
          'colorAccessor': (d) => (d.value >= 0) ? 'positive' : 'negative',
          'colors': d3.scaleOrdinal().domain(['positive', 'negative']).range(['#377eb8', '#e6550d']),
          'renderHorizontalGridLines': true,
          'clipPadding': 10,
          'margins': { 'top': 5, 'right': 0, 'bottom': 20, 'left': 30 },
          'title': usdTitle,
          'useViewBoxResizing': useViewBoxResizing
        };
        break;
      case 'pie':
        options = {
          'height': height,
          'width': width,
          'slicesCap': 8,
          'margins': { 'top': 0, 'right': 0, 'bottom': 0, 'left': 0 },
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
          'margins': { 'top': 0, 'right': 0, 'bottom': 20, 'left': 5 },
          'title': usdTitle,
          'useViewBoxResizing': useViewBoxResizing
        };
        break;

      case 'map':
        options = {
          'width': width,
          'height': height,
          'colors': d3.scaleQuantize().range(
            ['#E2F2FF', '#C4E4FF', '#9ED2FF', '#81C5FF', '#6BBAFF', '#51AEFF', '#36A2FF', '#1E96FF', '#0089FF', '#0061B5']),
          'colorDomain': [0, 1500],
          'colorAccessor': function (d) { return d ? +d : 0; },
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
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; })
            .curve(d3.curveLinear);

          const xVal = 1;
          const xPos = chart.x()(xVal);
          const vertLineData = [
            { x: xPos, y: 0 },
            { x: xPos, y: chart.effectiveHeight() }
          ];

          const yVal = avg;
          const yPos = chart.y()(yVal);
          const horzLineData = [
            { x: chart.x().range()[0], y: yPos },
            { x: chart.x().range()[1], y: yPos }
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
            .attr('x', function (d) { return d.x; })
            .attr('y', function (d) { return d.y; })
            .text(function (d) { return d.text; })
            .attr('opacity', .65);

        };

        const calcDomain = function (chart) {
          const data = chart.group().all();
          const xMinMax = d3.extent(data, function (e) { return chart.keyAccessor()(e); });
          const xRight = xMinMax[1] - 1;
          const xLeft = 1 - xMinMax[0];
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
          'chart': function (c) { return dc.scatterPlot(c).symbolSize(6).highlightedSize(8); },
          'elasticX': false,
          'elasticY': false,
          'brushOn': false,
          'clipPadding': 10,
          'x': d3.scaleLinear(),
          'seriesAccessor': function (kv) { return kv.value['Partner']; },
          'keyAccessor': function (kv) { return +kv.value['RCA']; },
          'valueAccessor': function (kv) { return +kv.value['Growth']; },
          'colorAccessor': function (kv) { return kv.value['Partner']; },
          'title': function (kv) {
            return [kv.value['Description'],
            kv.value['Partner'],
            'RCA: ' + numberFormat(kv.value['RCA']),
            'Growth: ' + numberFormat(kv.value['Growth']) + '%'].join('\n');
          },
          'margins': { 'top': 25, 'right': 5, 'bottom': 20, 'left': 40 },
          'legend': dc.legend().x(15).y(0).itemHeight(9).gap(8).horizontal(true).autoItemWidth(true),
          'useViewBoxResizing': useViewBoxResizing,
          'on': [['preRender', function (chart) {
            chart.yAxis().tickFormat(function (v) { return v + '%'; });
            calcDomain(chart);
          }],
          ['preRedraw', function (chart) { calcDomain(chart); }],
          ['pretransition', function (chart) { drawMarkup(chart); }]]
        };
        break;

      case 'potentialBox':
        const drawMarkup2 = function (chart) {

          const lineFunction = d3.line()
            .x(function (d) { return d.x; })
            .y(function (d) { return d.y; })
            .curve(d3.curveLinear);

          const xVal = 0;
          const xPos = chart.x()(xVal);
          const vertLineData = [
            { x: xPos, y: 0 },
            { x: xPos, y: chart.effectiveHeight() }
          ];

          const yVal = 0;
          const yPos = chart.y()(yVal);
          const horzLineData = [
            { x: chart.x().range()[0], y: yPos },
            { x: chart.x().range()[1], y: yPos }
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
            .attr('x', function (d) { return d.x; })
            .attr('y', function (d) { return d.y; })
            .text(function (d) { return d.text; })
            .attr('opacity', .65);

        };

        options = {
          'width': width,
          'height': height,
          'chart': function (c) { return dc.scatterPlot(c).symbolSize(6).highlightedSize(8); },
          'elasticX': false,
          'elasticY': false,
          'brushOn': false,
          'clipPadding': 10,
          'x': d3.scaleLinear().domain([-3, 3]),
          'xAxisLabel': '',
          'y': d3.scaleLinear().domain([-2.5, 2.5]),
          'seriesAccessor': function (kv) { return kv.value['Partner']; },
          'keyAccessor': function (kv) { return +kv.value['x']; },
          'valueAccessor': function (kv) { return +kv.value['y']; },
          'colorAccessor': function (kv) { return kv.value['Partner']; },
          'title': function (kv) {
            return [kv.value['Description'],
            kv.value['Partner'],
            'RCA: ' + numberFormat(kv.value['RCA']),
            'Growth: ' + numberFormat(kv.value['Growth']) + '%'].join('\n');
          },
          'margins': { 'top': 25, 'right': 5, 'bottom': 5, 'left': 5 },
          'legend': dc.legend().x(15).y(0).itemHeight(9).gap(8).horizontal(true).autoItemWidth(true),
          'useViewBoxResizing': useViewBoxResizing,
          'on': ['pretransition', function (chart) { drawMarkup2(chart); }]
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
          'seriesAccessor': function (kv) { return kv.key[0]; },
          'keyAccessor': function (kv) { return kv.key[1]; },
          'valueAccessor': function (kv) { return +kv.value; },
          'margins': { 'top': 15, 'right': 5, 'bottom': 20, 'left': 28 },
          'legend': dc.legend().x(35).y(0).itemHeight(9).gap(8).horizontal(true).itemWidth(75).legendWidth(225),
          'useViewBoxResizing': useViewBoxResizing
        };
        break;
    }

    return options;
  }

  private _loadGdpGroup() {
    const gdpGroup = new ChartGroupModel('GDP', 'gdp');

    const gdp = new MaterialDcChartModel('gdp');
    gdp.title = 'GDP';
    gdp.subtitle = '';

    this._cds.gdp.getDim('byYear').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { gdp.dimension = dim; } });

    this._cds.gdp.getGroup('byYearUsd').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { gdp.group = group; } });

    gdp.chartOptions['bar'] = new DcChartOptions('bar', DcChartType.Bar, this._getChartOptions('bar'));
    gdp.chartOptions['bar'].options['x'] = d3.scaleTime();
    gdp.chartOptions['bar'].options['xUnits'] = d3.timeYears;
    gdp.chartOptions['bar'].options['title'] = function (kv) {
      return kv.key.getFullYear() +
        '\n' + d3.format('.2f')(kv.value) + ' billion USD';
    };
    gdp.chartOptions['bar'].options['on'] = ['preRender', function (chart) {
      const ext = d3.extent(chart.group().all(), function (kv) { return kv.key; });
      const minDate = new Date(ext[0].getFullYear(), 0);
      minDate.setHours(minDate.getHours() - 1);
      const maxDate = new Date(ext[1].getFullYear(), 0);
      maxDate.setFullYear(maxDate.getFullYear() + 1);

      chart.x(d3.scaleTime().domain([minDate, maxDate]));
      chart.elasticX(false);
    }];
    gdp.selectedOption = 'bar';

    zip(this._cds.gdp.getGroup('byCountry'), this._cds.gdp.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if (group && dim) {
          const fi = new FilterModel('by Country', group, dim);
          fi.selectMultipleEnabled = false;
          fi.selectDefault = 'Thailand';
          gdp.filterItems.push(fi);
          gdp.filterItems = gdp.filterItems.slice(0);
        }
      });

    gdpGroup.chartModels.push(gdp);
    this.chartGroups.push(gdpGroup);
  }


  private _loadData() {
    this._loadGdpGroup();
  }

  private _clone( obj: any ): any {
    const newObj = {};
    Object.keys(obj).forEach( (k) => newObj[k] = obj[k] );
    return newObj;
  }

}
