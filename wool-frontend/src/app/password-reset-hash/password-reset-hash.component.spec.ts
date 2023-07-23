import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetHashComponent } from './password-reset-hash.component';

describe('PasswordResetHashComponent', () => {
  let component: PasswordResetHashComponent;
  let fixture: ComponentFixture<PasswordResetHashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordResetHashComponent]
    });
    fixture = TestBed.createComponent(PasswordResetHashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
