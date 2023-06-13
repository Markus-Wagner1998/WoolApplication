import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoolListItemComponent } from './wool-list-item.component';

describe('WoolListItemComponent', () => {
  let component: WoolListItemComponent;
  let fixture: ComponentFixture<WoolListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WoolListItemComponent]
    });
    fixture = TestBed.createComponent(WoolListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
