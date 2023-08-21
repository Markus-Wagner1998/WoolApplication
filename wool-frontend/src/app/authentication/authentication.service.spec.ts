import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { getHttpUrl } from '../util';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let http: HttpClient;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
    });
    service = TestBed.inject(AuthenticationService);
    http = TestBed.inject(HttpClient);
    const router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.stub();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if user is logged in - logged in', () => {
    service.jwtToken = 'validToken';
    expect(service.isUserLoggedIn()).toBeTrue();
  });

  it('should check if user is logged in - logged out', () => {
    service.jwtToken = '';
    expect(service.isUserLoggedIn()).toBeFalse();
  });

  it('should process successful signup', () => {
    localStorage.clear();
    const postSpy = spyOn(http, 'post').and.returnValue(of({token: 'token'}));
    let signUpSuccessFull: boolean = false;
    service.signupSuccess.subscribe((value: boolean) => signUpSuccessFull = value);

    service.register('firstName', 'lastName', 'email', 'password');

    expect(postSpy).toHaveBeenCalledOnceWith(
      getHttpUrl('/api/auth/signup'), 
      {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        password: 'password',
      },
    );
    expect(signUpSuccessFull).toBeTrue();
    expect(service.jwtToken).toEqual('');
    expect(localStorage.getItem('jwt')).toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/'], {
      queryParams: {
        notActive: true,
      },
    });
  });

  it('should process erroneous signup', () => {
    const postSpy = spyOn(http, 'post').and.returnValue(throwError(() => new Error('stuff')));
    let signUpSuccessFull: boolean = true;
    service.jwtToken = '';
    service.signupSuccess.subscribe((value: boolean) => signUpSuccessFull = value);

    service.register('firstName', 'lastName', 'email', 'password');

    expect(postSpy).toHaveBeenCalledOnceWith(
      getHttpUrl('/api/auth/signup'), 
      {
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        password: 'password',
      },
    );
    expect(signUpSuccessFull).toBeFalse();
    expect(service.jwtToken).toEqual('');
    expect(localStorage.getItem('jwtToken')).toBeFalsy();
    expect(navigateSpy).not.toHaveBeenCalled();;
  })

  it('should process successful login', () => {
    const postSpy = spyOn(http, 'post').and.returnValue(of({token: 'token'}));
    let loginSuccessFull: boolean = false;
    service.loginSuccess.subscribe((value: boolean) => loginSuccessFull = value);

    service.login('email', 'password');

    expect(postSpy).toHaveBeenCalledOnceWith(
      getHttpUrl('/api/auth/signin'), 
      {
        email: 'email',
        password: 'password',
      },
    );
    expect(loginSuccessFull).toBeTrue();
    expect(service.jwtToken).toEqual('token');
    expect(localStorage.getItem('jwt')).toEqual('token');
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/']);
  });

  it('should process erroneous login', () => {
    const postSpy = spyOn(http, 'post').and.returnValue(throwError(() => new Error('stuff')));
    let loginSuccessFull: boolean = true;
    service.jwtToken = '';
    service.loginSuccess.subscribe((value: boolean) => loginSuccessFull = value);

    service.login('email', 'password');

    expect(postSpy).toHaveBeenCalledOnceWith(
      getHttpUrl('/api/auth/signin'), 
      {
        email: 'email',
        password: 'password',
      },
    );
    expect(loginSuccessFull).toBeFalse();
    expect(service.jwtToken).toEqual('');
    expect(localStorage.getItem('jwtToken')).toBeFalsy();
    expect(navigateSpy).not.toHaveBeenCalled();;
  });

  it('should refresh token', () => {
    spyOn(http, 'get').and.returnValue(of({token: 'token'}));
    service.jwtToken = '';

    service.refresh();

    expect(service.jwtToken).toEqual('token');
    expect(localStorage.getItem('jwt')).toEqual('token');
  });

  it('should delete all user information at logout', () => {
    localStorage.setItem('jwt', 'token');
    service.jwtToken = 'token';

    service.logout();
    expect(localStorage.getItem('jwt')).toBeFalsy();
    expect(service.jwtToken).toEqual('');
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/login'], {
      queryParams: {
        loggedOut: true,
      },
    });
  })

});
