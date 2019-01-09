import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartGroupForeignExchangeComponent } from './chart-group-foreign-exchange.component';

describe('ChartGroupForeignExchangeComponent', () => {
  let component: ChartGroupForeignExchangeComponent;
  let fixture: ComponentFixture<ChartGroupForeignExchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartGroupForeignExchangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartGroupForeignExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
