import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtccExportChartDisplayComponent } from './utcc-export-chart-display.component';

describe('UtccExportChartDisplayComponent', () => {
  let component: UtccExportChartDisplayComponent;
  let fixture: ComponentFixture<UtccExportChartDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtccExportChartDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtccExportChartDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
