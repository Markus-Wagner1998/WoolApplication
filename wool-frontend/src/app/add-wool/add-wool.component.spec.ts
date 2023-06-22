import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWoolComponent } from './add-wool.component';

describe('AddWoolComponent', () => {
  let component: AddWoolComponent;
  let fixture: ComponentFixture<AddWoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWoolComponent]
    });
    fixture = TestBed.createComponent(AddWoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
