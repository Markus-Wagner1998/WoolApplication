import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetComponent } from './password-reset.component';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let router: Router;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, HttpClientModule, FormsModule],
      declarations: [PasswordResetComponent]
    });
    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    http = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset state', () => {
    component.success = true;
    component.isLoading = true;
    component.error = true;

    component.resetState();

    expect(component.success).toBeFalse();
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should perform password reset', () => {
    component.user.email = 'test@test.de';
    const putSpy = spyOn(http, 'put').and.returnValue(of('data'));
    const navigateSpy = spyOn(router, 'navigate').and.stub();

    component.performReset();

    expect(component.success).toBeTrue();
    expect(component.isLoading).toBeFalse();
    expect(putSpy).toHaveBeenCalledOnceWith('/api/auth/preparePasswordReset', {
      email: 'test@test.de',
    });
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/login']);
  });

  it('should handle error during password reset', () => {
    component.user.email = 'test@test.de';
    const putSpy = spyOn(http, 'put').and.returnValue(throwError(() => new Error('Error')));
    const navigateSpy = spyOn(router, 'navigate').and.stub();

    component.performReset();

    expect(component.success).toBeFalse();
    expect(component.isLoading).toBeFalse();
    expect(putSpy).toHaveBeenCalledOnceWith('/api/auth/preparePasswordReset', {
      email: 'test@test.de',
    });
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not trigger reset for invalid email', () => {
    component.user.email = '';
    const putSpy = spyOn(http, 'put').and.stub();
    const navigateSpy = spyOn(router, 'navigate').and.stub();

    component.performReset();

    expect(component.success).toBeFalse();
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeTrue()
    expect(putSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

});
