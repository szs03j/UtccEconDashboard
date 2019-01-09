import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuuriGridGroupComponent } from './muuri-grid-group.component';

describe('MuuriGridGroupComponent', () => {
  let component: MuuriGridGroupComponent;
  let fixture: ComponentFixture<MuuriGridGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuuriGridGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuuriGridGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
