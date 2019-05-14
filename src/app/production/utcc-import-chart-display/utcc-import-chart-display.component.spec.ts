import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtccImportChartDisplayComponent } from './utcc-import-chart-display.component';

describe('UtccImportChartDisplayComponent', () => {
  let component: UtccImportChartDisplayComponent;
  let fixture: ComponentFixture<UtccImportChartDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtccImportChartDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtccImportChartDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
