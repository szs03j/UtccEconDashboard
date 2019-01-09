import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGroupExportPotentialComponent } from './chart-group-export-potential.component';

describe('ChartGroupExportPotentialComponent', () => {
  let component: ChartGroupExportPotentialComponent;
  let fixture: ComponentFixture<ChartGroupExportPotentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartGroupExportPotentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartGroupExportPotentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
