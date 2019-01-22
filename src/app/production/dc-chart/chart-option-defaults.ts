import * as d3 from 'd3';
import * as dc from 'dc';

export enum XAxisType {
  Ordinal, Date, Integer, Float
}

export class ChartOptionDefaults {

  constructor( xAxis?: XAxisType) {

    switch (xAxis) {
      case XAxisType.Date:
        this.x = d3.scaleTime();
        this.xUnits = d3.timeYears;
      break;
      case XAxisType.Ordinal:
        this.x = d3.scaleBand();
        this.xUnits = dc.units.ordinal;
      break;
      case XAxisType.Integer:
        this.x = d3.scaleLinear();
        this.xUnits = dc.units.integers;
        break;
      case XAxisType.Float:
        this.x = d3.scaleLinear();
        this.xUnits = dc.units.fp;
      break;
    }

  }
  public height = 225;
  public width  = 300;
  public useViewBoxResizing = true;
  public x: any;
  public xUnits: any;
  public elasticX = true;
  public elasticY = true;
  public brushOn  = false;
  public clipPadding = 10;

}

export class BarChartOptionDefaults extends ChartOptionDefaults {
  constructor(xAxis: XAxisType) {
    super(xAxis);
  }
  public centerBar  = false;
  public colors     = d3.scaleOrdinal().domain(['positive', 'negative']).range(['#377eb8' , '#e6550d']);
  public renderHorizontalGridLines = true;
  public margins    = {'top': 5, 'right': 0, 'bottom': 30, 'left': 40};
  public title  = titleUsd;
  public yAxisLabel = 'Billion USD';
  public colorAccessor = (d) =>  (d.value >= 0) ? 'positive' : 'negative';

}

export class PieChartOptionDefaults extends ChartOptionDefaults {
  constructor() {
    super();
  }
  public slicesCap  = 8;
  public margins    = {'top': 0, 'right': 0, 'bottom': 0, 'left': 0};
  public title = titleUsd;

}

export class RowChartOptionDefaults extends ChartOptionDefaults {
  constructor(xAxis: XAxisType) {
    super(xAxis);
  }
  public renderVerticalGridLines = true;
  public cap      = 8;
  public margins  = {'top': 0, 'right': 0, 'bottom': 20, 'left': 10};
  public title = titleUsd;
  public othersLabel = 'Others';
}

export class MapChartOptionDefaults extends ChartOptionDefaults {
  constructor() {
    super();
  }
  public colors = d3.scaleQuantize().range(
    ['#E2F2FF', '#C4E4FF', '#9ED2FF', '#81C5FF', '#6BBAFF', '#51AEFF', '#36A2FF', '#1E96FF', '#0089FF', '#0061B5'] );
  public colorDomain    = [0, 1500];
  public title = titleUsd;
  public colorAccessor  = function(d) {  return d ? +d : 0; };
}

export class ScatterChartOptionDefaults extends ChartOptionDefaults {
  constructor(xAxis: XAxisType) {
    super(xAxis);
  }
  public elasticX = false;
  public elasticY = false;
  public margins  = {'top': 25, 'right': 5, 'bottom': 30, 'left': 35};
  public legend   = dc.legend().x(15).y(0).itemHeight(9).gap(8).horizontal(true).autoItemWidth(true);
  public chart    = function(c) { return dc.scatterPlot(c).symbolSize(6).highlightedSize(8); };
}

export class SeriesChartOptionDefaults extends ChartOptionDefaults {
  constructor(xAxis: XAxisType) {
    super(xAxis);
  }

  public margins  = {'top': 30, 'right': 5, 'bottom': 30, 'left': 35};
  public legend   = dc.legend().x(35).y(0).itemHeight(9).gap(8).horizontal(true).itemWidth(75).legendWidth(225);
}

export class NumberChartGroupOptionDefaults extends ChartOptionDefaults {
  constructor() { super(); }
  public formatNumber = d3.format('.2f');
  public clipPadding = 10;
  public margins = {'top': 5, 'right': 0, 'bottom': 20, 'left': 30};
}

// Helper Functions

// used for the renderlet function to angle year labels
export function angleYearLabels ( chart ) {
  chart.select('g.axis.x').selectAll('text')
  .attr('transform', function(d) { return 'translate(-15 10) rotate(-45)'; });
}

// used for the renderlet function of the GDP pie proportion pct chart to allow for room for the legend
export function pieLegendSpacer (chart) {
  chart.select('g').attr('transform', 'translate(150 130)');
}

// used in the pretransition of pie charts to replace labels with percentages of each pie slice
export function pieLabelsAsPctProportion (chart) {
  chart.selectAll('text.pie-slice').text(function(d) {
    return Math.round((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
  });
}

// used for the pretransition of the potential box import / export charts
export function potentialBoxMarkup (chart) {

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

}

// used for the pretransition of the potential import / export charts
export function potentialMarkup (chart) {
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
}

// used for the preRender and preRedraw of the potential impoart / export charts
export function potentialCalcDomain (chart) {
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
}

// used for the renderlet function to remove every other label in the x axis
export function removeEveryOtherXAxisLabel (chart) {
  chart.select('g.axis.x').selectAll('text')
    .text(function(d, i) { if ( (i % 2) === 0) { return d; } return ''; });
}

// used as the title function in charts that display usd
export function titleUsd ( kv ) {
  return kv.key + '\n' + d3.format('.2f')(kv.value) + ' billion USD';
}



