import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGroupComponent } from './chart-group.component';

describe('ChartGroupComponent', () => {
  let component: ChartGroupComponent;
  let fixture: ComponentFixture<ChartGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
