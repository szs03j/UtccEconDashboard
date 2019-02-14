import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtccExchangeChartDisplayComponent } from './utcc-exchange-chart-display.component';

describe('UtccExchangeChartDisplayComponent', () => {
  let component: UtccExchangeChartDisplayComponent;
  let fixture: ComponentFixture<UtccExchangeChartDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtccExchangeChartDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtccExchangeChartDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
