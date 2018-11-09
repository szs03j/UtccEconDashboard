import { Input, Component, OnInit, AfterViewInit } from '@angular/core';
import { NumberGroupChartModel } from '../number-group-chart/number-group-chart-model';

@Component({
  selector: 'app-mat-dc-number-group',
  templateUrl: './material-dc-number-group.component.html',
  styleUrls: ['./material-dc-number-group.component.css']
})
export class MaterialDcNumberGroupComponent implements OnInit, AfterViewInit {

  constructor() { }

  @Input() public title: string;
  @Input() public subtitle: string;
  @Input() public numberDisplays: Array<NumberGroupChartModel> = new Array<NumberGroupChartModel>();

  ngOnInit() {
  }

  ngAfterViewInit() {

  }
}
