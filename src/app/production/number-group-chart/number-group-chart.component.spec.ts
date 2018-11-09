import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberGroupChartComponent } from './number-group-chart.component';

describe('NumberGroupChartComponent', () => {
  let component: NumberGroupChartComponent;
  let fixture: ComponentFixture<NumberGroupChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberGroupChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberGroupChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
