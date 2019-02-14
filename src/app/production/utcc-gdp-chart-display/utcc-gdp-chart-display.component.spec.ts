import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtccGdpChartDisplayComponent } from './utcc-gdp-chart-display.component';

describe('UtccGdpChartDisplayComponent', () => {
  let component: UtccGdpChartDisplayComponent;
  let fixture: ComponentFixture<UtccGdpChartDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtccGdpChartDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtccGdpChartDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
