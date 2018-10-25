import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDcChartComponent } from './material-dc-chart.component';

describe('MaterialDcChartComponent', () => {
  let component: MaterialDcChartComponent;
  let fixture: ComponentFixture<MaterialDcChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDcChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDcChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
