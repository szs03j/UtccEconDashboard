import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartInfoDialogComponent } from './chart-info-dialog.component';

describe('ChartInfoDialogComponent', () => {
  let component: ChartInfoDialogComponent;
  let fixture: ComponentFixture<ChartInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
