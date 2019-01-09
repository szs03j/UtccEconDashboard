import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGroupExportsComponent } from './chart-group-exports.component';

describe('ChartGroupExportsComponent', () => {
  let component: ChartGroupExportsComponent;
  let fixture: ComponentFixture<ChartGroupExportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartGroupExportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartGroupExportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
