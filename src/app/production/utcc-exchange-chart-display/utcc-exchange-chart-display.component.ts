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
  selector: 'app-utcc-exchange-chart-display',
  templateUrl: './utcc-exchange-chart-display.component.html',
  styleUrls: ['./utcc-exchange-chart-display.component.css']
})
export class UtccExchangeChartDisplayComponent implements OnInit {

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

  private _loadFXGroup() {
    const fxGroup = new ChartGroupModel('Exchange Rate', 'exchange-rate');

    const numDisplayGrp = new MaterialDcNumberGroupModel();
    numDisplayGrp.title = 'Exchange Rate for 1 USD';

    const numDisplayGrp2 = new MaterialDcNumberGroupModel();
    numDisplayGrp2.title = 'Exchange Rate for 1 THB';

    zip(this._cds.dailyExchangeRate.getGroup('byDate'), this._cds.dailyExchangeRate.getDim('byDate'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if (group && dim) {
          const top = group.top(1);
          if (top.length === 0) { return; }
          const row = top[0];
          numDisplayGrp.subtitle = 'as of ' + row.key;
          numDisplayGrp2.subtitle = 'as of ' + row.key;
          const thb = row.value['Thailand']['amountUsd'];
          const countries = Object.keys(row.value);
          const numDis1 = new Array<NumberGroupChartModel>();
          const numDis2 = new Array<NumberGroupChartModel>();
          countries.sort(d3.ascending);
          countries.forEach((d) => {
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

    const fx = new MaterialDcChartModel('fx');
    fx.title = 'Exchange Rate';
    fx.subtitle = '';

    this._cds.exchangeRate.getDim('byCountryDate').pipe(takeUntil(this._onDestroy$)).subscribe(
      (dim: any) => { if (dim) { fx.dimension = dim; } });

    this._cds.exchangeRate.getGroup('byCountryDate').pipe(takeUntil(this._onDestroy$)).subscribe(
      (group: any) => { if (group) { fx.group = group; } });

    fx.chartOptions['line'] = new DcChartOptions('line', DcChartType.Series, this._getChartOptions('series'));
    fx.chartOptions['line'].options['xUnits'] = d3.timeDays;
    const calcDomain = function (chart) {
      const ext = d3.extent(chart.group().all(), function (kv) { return kv.value; });
      chart.y(d3.scaleLinear().domain(ext));
    };

    fx.chartOptions['line'].options['on'] = [['preRender', calcDomain], ['preRedraw', calcDomain]];
    fx.chartOptions['line'].options['elasticY'] = false;
    fx.chartOptions['line'].options['title'] = function (d) {
      return d.key[1].getDate() + '-' + d.key[1].getMonth() + '-' + d.key[1].getFullYear() + ' : ' + parseFloat(d.value).toFixed(2);
    };
    fx.selectedOption = 'line';

    zip(this._cds.exchangeRate.getGroup('byCountry'), this._cds.exchangeRate.getDim('byCountry'))
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([group, dim]) => {
        if (group && dim) {
          const fi = new FilterModel('by Country', group, dim);
          fi.selectMultipleEnabled = true;
          fx.filterItems.push(fi);
          fx.filterItems = fx.filterItems.slice(0); // must do this so angular recognizes that the array was updated
        }
      });

    fxGroup.chartModels.push(fx);
    this.chartGroups.push(fxGroup);
  }


  private _loadData() {
    this._loadFXGroup();
  }

  private _clone( obj: any ): any {
    const newObj = {};
    Object.keys(obj).forEach( (k) => newObj[k] = obj[k] );
    return newObj;
  }

}
