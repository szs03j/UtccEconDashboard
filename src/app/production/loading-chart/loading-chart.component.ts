import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-chart',
  templateUrl: './loading-chart.component.html',
  styleUrls: ['./loading-chart.component.css']
})
export class LoadingChartComponent implements OnInit {

  constructor() { }

  /* to do: set these attributes to the html view. currently don't work */
  @Input() barCount = 4;
  @Input() barWidth = 10;
  @Input() barHeight = 100;
  @Input() speed = 1.8;

  ngOnInit() {
  }


}
