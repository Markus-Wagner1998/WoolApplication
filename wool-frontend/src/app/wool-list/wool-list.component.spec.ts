import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoolListComponent } from './wool-list.component';

describe('WoolListComponent', () => {
  let component: WoolListComponent;
  let fixture: ComponentFixture<WoolListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WoolListComponent]
    });
    fixture = TestBed.createComponent(WoolListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
