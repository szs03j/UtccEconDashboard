import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGroupImportsComponent } from './chart-group-imports.component';

describe('ChartGroupImportsComponent', () => {
  let component: ChartGroupImportsComponent;
  let fixture: ComponentFixture<ChartGroupImportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartGroupImportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartGroupImportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
