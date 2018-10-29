import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtccEconChartDisplayComponent } from './utcc-econ-chart-display.component';

describe('UtccEconChartDisplayComponent', () => {
  let component: UtccEconChartDisplayComponent;
  let fixture: ComponentFixture<UtccEconChartDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtccEconChartDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtccEconChartDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
