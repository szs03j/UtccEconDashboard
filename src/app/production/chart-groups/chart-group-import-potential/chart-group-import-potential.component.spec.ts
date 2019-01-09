import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGroupImportPotentialComponent } from './chart-group-import-potential.component';

describe('ChartGroupImportPotentialComponent', () => {
  let component: ChartGroupImportPotentialComponent;
  let fixture: ComponentFixture<ChartGroupImportPotentialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartGroupImportPotentialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartGroupImportPotentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
