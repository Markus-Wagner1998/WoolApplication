import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppRoutingModule, FormsModule],
      declarations: [LoginComponent],
      providers: [ 
        {
          provide: AuthenticationService,
          useValue: {
            login: () => {},
            loginSuccess: of(false),
          }
        }
      ]
    });
  });

  it('should create', () => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.error).toBeTrue();
    expect(component.showMessage).toBeFalse();
    expect(component.message).toBeFalsy();
  });

  it('should create with passwordReset param', () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppRoutingModule, FormsModule],
      declarations: [LoginComponent],
      providers: [ 
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              passwordReset: 'true',
            }),
          }
        }
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.showMessage).toBeTrue();
    expect(component.message).toEqual('Passwort erfolgreich zurückgesetzt');
  });

  it('should create with notActive param', () => {
    TestBed.configureTestingModule({
      providers: [ 
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              notActive: 'true',
            }),
          }
        }
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.showMessage).toBeTrue();
    expect(component.message).toEqual('Account vor Benutzung aktivieren');
  });

  it('should create with active param', () => {
    TestBed.configureTestingModule({
      providers: [ 
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              active: 'true',
            }),
          }
        }
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.showMessage).toBeTrue();
    expect(component.message).toEqual('Account aktiviert');
  });

  it('should create with loggedOut param', () => {
    TestBed.configureTestingModule({
      providers: [ 
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              loggedOut: 'true',
            }),
          }
        }
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.showMessage).toBeTrue();
    expect(component.message).toEqual('Erfolgreich ausgeloggt');
  });

  it('should perform login', () => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authenticationService = TestBed.inject(AuthenticationService);
    const loginSpy = spyOn(authenticationService, 'login').and.stub();

    component.performLogin();

    expect(loginSpy).toHaveBeenCalledTimes(1);
  });

});
