import { Component,
  ViewEncapsulation,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output} from '@angular/core';
import * as dc from 'dc';
import { BaseMixin } from 'dc';
import { DcChartOptions } from './dc-chart-options';
import { DcChartType } from './dc-chart-type.enum';
import { Dict } from '../dict';

@Component({
  selector: 'app-dc-chart',
  templateUrl: './dc-chart.component.html',
  styleUrls: ['./dc-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DcChartComponent implements AfterViewInit, OnChanges {
  constructor() { }

  @ViewChild('chartRoot') private chartElemRef: ElementRef;

  public get chart() { return this._gettersetter_chart; }
  // private set
  private _gettersetter_chart: BaseMixin<any>;
  @Output() public chartChange: EventEmitter<BaseMixin<any>> = new EventEmitter<BaseMixin<any>>(true);

  private _viewInit = false;

  /* var filters */
  public get filters() { return this.chart ? this.chart.filters() : []; }

  /* var chartOptions */
  @Input() public set chartOptions( items: Dict<DcChartOptions> ) {
    this._gettersetter_chartOptions = items; }
  public get chartOptions() { return this._gettersetter_chartOptions; }
  private _gettersetter_chartOptions: Dict<DcChartOptions> = new Dict<DcChartOptions>();
  public get chartOptionsKeys() { return Object.keys(this._gettersetter_chartOptions); }

  /* var dimension */
  /* WARNING: if selected chartOptions has a dimension, the dc chart will use the one in the options and not use this value */
  @Input() public set dimension( dim: any ) { this._gettersetter_dimension = dim; }
  public get dimension() { return this._gettersetter_dimension; }
  private _gettersetter_dimension: any;

  /* var group */
  /* WARNING: if selected chartOptions has a group, the dc chart will use the one in the options and not use this value */
  @Input() public set group( group: any ) { this._gettersetter_group = group; }
  public get group() { return this._gettersetter_group; }
  private _gettersetter_group: any;

  /* var chartGroup */
  @Input() public set chartGroup( cg: string ) { this._gettersetter_chartGroup = cg; }
  public get chartGroup() { return this._gettersetter_chartGroup; }
  private _gettersetter_chartGroup: string;

  /* var selectedChart */
  @Input() public get selectedOption() { return this._gettersetter_selectedOption; }
  public set selectedOption( nameIdx: string ) { this._gettersetter_selectedOption = nameIdx;  this._loadChart();  }
  private _gettersetter_selectedOption: string;
  @Output() public selectedOptionChange: EventEmitter<string> = new EventEmitter<string>(true);

  /* var chartLoaded  (state variable) */
  public get chartLoaded() { return this._gettersetter_chartLoaded; }
  // has a private setter function
  private _gettersetter_chartLoaded = false;
  @Output() chartLoadedChange: EventEmitter<boolean> = new EventEmitter<boolean>(true);

  /* var keepFilters if the component should preserve filters between chart reload */
  @Input() public set keepFilters(kf: boolean) { this._gettersetter_keepFilters = kf; }
  public get keepFilters() { return this._gettersetter_keepFilters; }
  private _gettersetter_keepFilters = true;

  @Output() chartFiltered:      EventEmitter<any> = new EventEmitter<any>(true);
  @Output() chartPreRender:     EventEmitter<any> = new EventEmitter<any>();
  @Output() chartPostRender:    EventEmitter<any> = new EventEmitter<any>();
  @Output() chartPreRedraw:     EventEmitter<any> = new EventEmitter<any>();
  @Output() chartPostRedraw:    EventEmitter<any> = new EventEmitter<any>();
  @Output() chartRenderlet:     EventEmitter<any> = new EventEmitter<any>();
  @Output() chartZoomed:        EventEmitter<any> = new EventEmitter<any>();
  @Output() chartPreTransition: EventEmitter<any> = new EventEmitter<any>();

  /* private setters */
  private _setChart( c: BaseMixin<any> ) {
    if (this._gettersetter_chart) {
      dc.deregisterChart(this._gettersetter_chart);
      delete this._gettersetter_chart;
    }
    this._gettersetter_chart = c;
    this.chartChange.emit(this._gettersetter_chart);
  }
  private _setChartLoaded( isLoaded: boolean ) {
    this._gettersetter_chartLoaded = isLoaded; this.chartLoadedChange.emit(this._gettersetter_chartLoaded); }

  ngAfterViewInit() {
    this._viewInit = true;
    this._loadChart();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.chartLoaded) {
      this._loadChart();
    }
  }

  public filtersMatch(list: any) {
    if ( this.chart ) {
      this.chart.filterAll();
      if ( list ) {
        this.filtersToggle(list);
      } else {
        this.chart.redrawGroup();
      }
    }

  }

  public filtersToggle(list: any) {
    if ( this.chart ) {
      if ( list && list.length > 0 ) {
        this.chart.filter([list]);
      } else {
        this.chart.filterAll();
      }
      this.chart.redrawGroup();
    }
  }

  /* checks validation then loads the chart for the selected configuration */
  private _loadChart(): void {

    // set the first chart option as selected if nothing has explicitly been selected
    if ( !this.selectedOption && this.chartOptionsKeys.length > 0 ) {
      this.selectedOption = this.chartOptionsKeys[0];
    }

    if ( this._viewInit ) {
      const optionInfo: DcChartOptions = this.chartOptions[this.selectedOption];
      if ( this._validateChartOptions(optionInfo) ) {
        let prevFilters: Array<any>;
        if ( this.chart ) {
          prevFilters = this.chart.filters();
        }
        this._setChart(this._getNewChart(optionInfo.chartType, this.chartElemRef.nativeElement));
        if ( this.chart) {
          this._setChartLoaded(true);
          this._applyOptions(this.chart, optionInfo, true);
          this.chart.render();
          if ( this.keepFilters && prevFilters && prevFilters.length > 0 ) {
            this.chart.filter(prevFilters);
            this.chart.redraw();
          }
          return;
        }
      }
    }

    // selected chart not loaded. remove any existing charts
    if ( this.chart ) { this.chart.svg().remove(); }
    this._setChartLoaded(false);
  }

  private _applyCompositeOptions(parentChart: dc.CompositeChart, parentOptions: DcChartOptions ): void {
    const subCharts = new Array<BaseMixin<any>>();
    for ( let i = 0; i < parentOptions.compositeOptions.length; i++ ) {
      const optInfo: DcChartOptions = parentOptions.compositeOptions[i];
      const chart: BaseMixin<any> = this._getNewChart( optInfo.chartType, parentChart );
      this._applyOptions(chart, optInfo, false);
      subCharts.push(chart);
    }
    parentChart.compose(subCharts);
  }

  private _validateChartOptions(config?: DcChartOptions): boolean {
    if (
      (config && config.options) &&
      (this.dimension || config.options.dimension)  &&
      (this.group || config.options.group) ) {
      return true;
    }
    return false;
  }

  private _getNewChart(ct: DcChartType, parent: any): dc.BaseMixin<any> {
    let ch: dc.BaseMixin<any>;
    switch (ct) {
      case DcChartType.Bar:
        ch = dc.barChart(parent);
        break;
      case DcChartType.GeoChoropleth:
        ch = dc.geoChoroplethChart(parent);
        break;
      case DcChartType.Pie:
        ch = dc.pieChart(parent);
        break;
      case DcChartType.Row:
        ch = dc.rowChart(parent);
        break;
      case DcChartType.Line:
        ch = dc.lineChart(parent);
        break;
      case DcChartType.Plot:
        ch = dc.scatterPlot(parent);
        break;
      case DcChartType.Series:
        ch = dc.seriesChart(parent);
        break;
      case DcChartType.Composite:
        ch = dc.compositeChart(parent);
        break;
      case DcChartType.Number:
        ch = dc.numberDisplay(parent);
        break;
    }
    return ch;
  }

  private _applyOptions(chart: dc.BaseMixin<any>, optInfo: DcChartOptions, applyOnOptions: boolean) {
    const options = optInfo.options;
    let sanitizedOptions = options;
    /* create new options array without 'on'. there is a bug in dc
      that prevents the 'on' item from being called correctly. also,
      the 'on' events need to be wrapped in a parent function so this component
      has access to the event */
    if ( options['on'] ) {
      sanitizedOptions = {};
      const ks = Object.keys(options);
      ks.forEach( (k) => {
        if (k !== 'on') { sanitizedOptions[k] = options[k]; }
      });
    }

    /* if the options don't contain a dimension or group then use the dimension or group
      set in the component. */
    if ( !sanitizedOptions['dimension'] ) { chart.dimension(this.dimension); }
    if ( !sanitizedOptions['group'] ) { chart.group(this.group); }
    if ( !sanitizedOptions['chartGroup'] && this.chartGroup ) { chart.chartGroup(this.chartGroup); }

    chart.options(sanitizedOptions);
    if ( applyOnOptions ) { this._applyOnOptions(chart, options); }
    if ( optInfo.chartType === DcChartType.Composite ) {
      this._applyCompositeOptions(chart as dc.CompositeChart, optInfo);
    }
  }

  /* this function injects a handler from this component into each of the 'on' events of the chart.  */
  private _applyOnOptions(chart: dc.BaseMixin<any>, options: any) {
    const parsedOptions: Dict<any> = this._getParsedOnOptions(options);
    const injectHandlers: Dict<any> = new Dict<any>();

    injectHandlers['preRender']     = this._handleChartPreRender;
    injectHandlers['postRender']    = this._handleChartPostRender;
    injectHandlers['preRedraw']     = this._handleChartPreRedraw;
    injectHandlers['postRedraw']    = this._handleChartPostRedraw;
    injectHandlers['filtered']      = this._handleChartFiltered;
    injectHandlers['renderlet']     = this._handleChartRenderlet;
    injectHandlers['pretransition'] = this._handleChartPreTransition;
    injectHandlers['zoomed']        = this._handleChartZoomed;

    Object.keys(injectHandlers).forEach( (k) => {
      const v = injectHandlers[k];
      const fromOptionsHandler = parsedOptions[k];
      const handler = v.bind(this);
      const wrapperFunc = function( c: any, filters: any ) {
        handler(c, filters);
        if (fromOptionsHandler) { fromOptionsHandler(c); }
      };
      parsedOptions[k] = wrapperFunc;
    });

    Object.keys(parsedOptions).forEach( function( k ) { chart.on(k, parsedOptions[k]); });
  }

  /* will return dict { 'filtered': function(), 'preDraw': function() } ...*/
  private _getParsedOnOptions(options: any): Dict<any> {
    const onOptions = new Dict<any>();
    if ( Array.isArray(options['on']) && options['on'].length > 0 ) {
      if ( Array.isArray(options['on'][0]) ) {
        // array should be like this on: [['filtered', function(){}], ['preDraw', function(){}]]
        options['on'].forEach( (d) => {
          if (Array.isArray(d) && d.length >= 2) {
            onOptions[d[0]] = d[1];
          }
        });
      } else {
        if (options['on'].length >= 2) {
          onOptions[options['on'][0]] = options['on'][1];
        }
      }
    }

    return onOptions;
  }

  /*
    http://dc-js.github.io/dc.js/docs/html/dc.baseMixin.html#on__anchor
    renderlet - This listener function will be invoked after transitions after redraw and render. Replaces the deprecated renderlet method.
    pretransition - Like .on('renderlet', ...) but the event is fired before transitions start.
    preRender - This listener function will be invoked before chart rendering.
    postRender - This listener function will be invoked after chart finish rendering including all renderlets' logic.
    preRedraw - This listener function will be invoked before chart redrawing.
    postRedraw - This listener function will be invoked after chart finish redrawing including all renderlets' logic.
    filtered - This listener function will be invoked after a filter is applied, added or removed.
    zoomed - This listener function will be invoked after a zoom is triggered.
  */

  /* registered with the _chart.on('filter') */

  private _handleChartRenderlet(chart: any, filter: any): void {
    this.chartRenderlet.emit({chart: chart, filter: filter});
  }

  private _handleChartPreTransition(chart: any, filter: any): void {
    this.chartPreTransition.emit({chart: chart, filter: filter});
  }

  private _handleChartPreRender(chart: any ): void {
    this.chartPreRender.emit({ chart: chart });
  }

  private _handleChartPostRender(chart: any): void {
    this.chartPostRender.emit({ chart: chart });
  }

  private _handleChartPreRedraw(chart: any): void {
    this.chartPreRedraw.emit({ chart: chart });
  }

  private _handleChartPostRedraw(chart: any): void {
    this.chartPostRedraw.emit({ chart: chart });
  }

  private _handleChartFiltered(chart: any, filter: any): void {
    this.chartFiltered.emit({chart: chart, filter: filter});
  }

  private _handleChartZoomed(chart: any, filter: any): void {
    this.chartZoomed.emit({chart: chart, filter: filter});
  }

}
