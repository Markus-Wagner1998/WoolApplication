import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from './authentication.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authenticationService: AuthenticationService;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, HttpClientModule],
    });
    guard = TestBed.inject(AuthGuard);
    authenticationService = TestBed.inject(AuthenticationService);
    const router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.stub();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should be able to activate if jwt token is stored', () => {
    authenticationService.jwtToken = 'jwtToken';
    expect(guard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should not be able to activate if no jwt token is stored', () => {
    authenticationService.jwtToken = '';
    expect(guard.canActivate({} as ActivatedRouteSnapshot, {url: 'http://google.de'} as RouterStateSnapshot)).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/login'], { queryParams: { returnUrl:  'http://google.de' } });
  });

});
