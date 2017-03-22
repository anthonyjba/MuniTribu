import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortableGroupComponent } from './sortable-group.component';

describe('SortableGroupComponent', () => {
  let component: SortableGroupComponent;
  let fixture: ComponentFixture<SortableGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortableGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortableGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
