import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcChartComponent } from './dc-chart.component';

describe('DcChartComponent', () => {
  let component: DcChartComponent;
  let fixture: ComponentFixture<DcChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
