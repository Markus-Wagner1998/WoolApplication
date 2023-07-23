import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetHashComponent } from './password-reset-hash.component';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('PasswordResetHashComponent', () => {
  let component: PasswordResetHashComponent;
  let fixture: ComponentFixture<PasswordResetHashComponent>;
  let http: HttpClient;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, HttpClientModule, FormsModule],
      declarations: [PasswordResetHashComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({
            hash: 'hashValue',
          }),
        }
      }]
    });
    fixture = TestBed.createComponent(PasswordResetHashComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset state', () => {
    component.error = true;
    component.isLoading = true;

    component.resetState();

    expect(component.error).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('should not trigger password reset for invalid password', () => {
    component.user.password = 'A';
    component.user.passwordRepeat = 'B';
    const putSpy = spyOn(http, 'put').and.stub();

    component.performReset();

    expect(putSpy).not.toHaveBeenCalled();
    expect(component.error).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });

  it('should trigger password reset', () => {
    component.user.password = 'VALIDPassword';
    component.user.passwordRepeat = component.user.password;
    const putSpy = spyOn(http, 'put').and.returnValue(of('stuff'));
    const navigateSpy = spyOn(router, 'navigate').and.stub();

    component.performReset();

    expect(putSpy).toHaveBeenCalledOnceWith('/api/auth/resetPassword/hashValue', {
      password: 'VALIDPassword',
    });
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/login'], {
      queryParams: {
        passwordReset: true,
      },
    });
    expect(component.error).toBeFalse();
    expect(component.isLoading).toBeFalse();
  });

  it('should route to login if no hash available', () => {
    const navigateSpy = spyOn(router, 'navigate').and.stub();
    component['route'].queryParams = of({});

    component.ngOnInit();

    expect(navigateSpy).toHaveBeenCalledOnceWith(['/login']);
  });

});
