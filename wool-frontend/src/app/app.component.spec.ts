import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './authentication/authentication.service';

describe('AppComponent', () => {
  let app: AppComponent;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [AppComponent]
    });
    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    authenticationService = TestBed.inject(AuthenticationService);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Wool Organizer'`, () => {
    expect(app.title).toEqual('Wool Organizer');
  });

  it('should check if logged in - true', () => {
    spyOn(authenticationService, 'isUserLoggedIn').and.returnValue(true);
    expect(app.isLoggedIn()).toBeTrue();
  });

  it('should check if logged in - false', () => {
    spyOn(authenticationService, 'isUserLoggedIn').and.returnValue(false);
    expect(app.isLoggedIn()).toBeFalse();
  });

  it('should call authService logout', () => {
    const logoutSpy = spyOn(authenticationService, 'logout').and.stub();
    app.logout();
    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it('should open menu', () => {
    app.openMenu();
    expect(app.menuOpen).toBeTrue();
  });

  it('should close menu', () => {
    app.closeMenu();
    expect(app.menuOpen).toBeFalse();
  });

});
