import { Input, Component, OnInit } from '@angular/core';
import { DcChartComponent } from '../dc-chart/dc-chart.component';

@Component({
  selector: 'app-number-group-chart',
  templateUrl: './number-group-chart.component.html',
  styleUrls: ['./number-group-chart.component.css']
})
export class NumberGroupChartComponent extends DcChartComponent implements OnInit {

  @Input() public title: string;
  @Input() public subtitle: string;

  ngOnInit() {
  }

}
