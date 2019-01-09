import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGroupGdpComponent } from './chart-group-gdp.component';

describe('ChartGroupGdpComponent', () => {
  let component: ChartGroupGdpComponent;
  let fixture: ComponentFixture<ChartGroupGdpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartGroupGdpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartGroupGdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
