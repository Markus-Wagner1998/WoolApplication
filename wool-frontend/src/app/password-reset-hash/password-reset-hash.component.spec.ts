import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetHashComponent } from './password-reset-hash.component';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

describe('PasswordResetHashComponent', () => {
  let component: PasswordResetHashComponent;
  let fixture: ComponentFixture<PasswordResetHashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, HttpClientModule, FormsModule],
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
