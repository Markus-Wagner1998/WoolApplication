import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
      declarations: [RegisterComponent],
      providers: [ 
        {
          provide: AuthenticationService,
          useValue: {
            register: () => {},
            signupSuccess: of(false),
          }
        }
      ]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authenticationService = TestBed.inject(AuthenticationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.error).toBeTrue();
  });

  it('should get correct errorMessage - wrong firstname', () => {
    component.user.firstName = '';
    expect(component.getErrorMessage()).toEqual('Gültigen Vornamen eingeben');
  });

  it('should get correct errorMessage - wrong lastName', () => {
    component.user.firstName = 'firstName';
    component.user.lastName = '';
    expect(component.getErrorMessage()).toEqual('Gültigen Nachnamen eingeben');
  });

  it('should get correct errorMessage - wrong email', () => {
    component.user.firstName = 'firstName';
    component.user.lastName = 'lastName';
    component.user.email = '';
    expect(component.getErrorMessage()).toEqual('Gültige E-Mail Adresse eingeben');
  });

  it('should get correct errorMessage - wrong password', () => {
    component.user.firstName = 'firstName';
    component.user.lastName = 'lastName';
    component.user.email = 'email@email.de';
    component.user.password = '';
    expect(component.getErrorMessage()).toEqual('Gültiges Passwort eingeben');
  });

  it('should get correct errorMessage - duplicate account', () => {
    component.user.firstName = 'firstName';
    component.user.lastName = 'lastName';
    component.user.email = 'email@email.de';
    component.user.password = 'password123';
    component.user.passwordRepeat = 'password123';
    expect(component.getErrorMessage()).toEqual('Account existiert bereits');
  });

  it('should get if parameters are valid - wrong firstname', () => {
    component.user.firstName = '';
    expect(component.user.isCreateValid()).toBeFalse();
  });

  it('should get if parameters are valid - wrong lastName', () => {
    component.user.firstName = 'firstName';
    component.user.lastName = '';
    expect(component.user.isCreateValid()).toBeFalse();
  });

  it('should get if parameters are valid - wrong email', () => {
    component.user.firstName = 'firstName';
    component.user.lastName = 'lastName';
    component.user.email = '';
    expect(component.user.isCreateValid()).toBeFalse();
  });

  it('should get if parameters are valid - wrong password', () => {
    component.user.firstName = 'firstName';
    component.user.lastName = 'lastName';
    component.user.email = 'email@email.de';
    component.user.password = '';
    expect(component.user.isCreateValid()).toBeFalse();
  });

  it('should get if parameters are valid - valid params', () => {
    component.user.firstName = 'firstName';
    component.user.lastName = 'lastName';
    component.user.email = 'email@email.de';
    component.user.password = 'password123';
    component.user.passwordRepeat = 'password123';
    expect(component.user.isCreateValid()).toBeTrue();
  });

  it('should perform signup - valid parameters', () => {
    component.error = true;
    component.user.firstName = 'firstName';
    component.user.lastName = 'lastName';
    component.user.email = 'email@email.de';
    component.user.password = 'password123';
    component.user.passwordRepeat = 'password123';
    spyOn(authenticationService, 'register').and.stub();

    component.performSignup();

    expect(component.error).toBeFalse();
  });

  it('should perform signup - invalid parameters', () => {
    component.error = false;
    component.user.firstName = 'firstName';
    component.user.lastName = 'lastName';
    component.user.email = 'email@email.de';
    component.user.password = 'password123';
    component.user.passwordRepeat = '';
    spyOn(authenticationService, 'register').and.stub();

    component.performSignup();

    expect(component.error).toBeTrue();
  });

});
