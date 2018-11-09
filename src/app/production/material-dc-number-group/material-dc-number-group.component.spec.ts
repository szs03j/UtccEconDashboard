import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDcNumberGroupComponent } from './material-dc-number-group.component';

describe('MaterialDcNumberGroupComponent', () => {
  let component: MaterialDcNumberGroupComponent;
  let fixture: ComponentFixture<MaterialDcNumberGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialDcNumberGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDcNumberGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
