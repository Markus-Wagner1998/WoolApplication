import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';
import { of } from 'rxjs';

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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authenticationService = TestBed.inject(AuthenticationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.error).toBeTrue();
  });

  it('should perform login', () => {
    const loginSpy = spyOn(authenticationService, 'login').and.stub();

    component.performLogin();

    expect(loginSpy).toHaveBeenCalledTimes(1);
  });

});
