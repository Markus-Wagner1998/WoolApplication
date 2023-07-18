import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../authentication/authentication.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
      declarations: [RegisterComponent]
    });
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authenticationService = TestBed.inject(AuthenticationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get correct errorMessage - wrong firstname', () => {
    component.firstName = '';
    expect(component.getErrorMessage()).toEqual('Gültigen Vornamen eingeben');
  });

  it('should get correct errorMessage - wrong lastName', () => {
    component.firstName = 'firstName';
    component.lastName = '';
    expect(component.getErrorMessage()).toEqual('Gültigen Nachnamen eingeben');
  });

  it('should get correct errorMessage - wrong email', () => {
    component.firstName = 'firstName';
    component.lastName = 'lastName';
    component.email = '';
    expect(component.getErrorMessage()).toEqual('Gültige E-Mail Adresse eingeben');
  });

  it('should get correct errorMessage - wrong password', () => {
    component.firstName = 'firstName';
    component.lastName = 'lastName';
    component.email = 'email@email.de';
    component.password = '';
    expect(component.getErrorMessage()).toEqual('Gültiges Passwort eingeben');
  });

  it('should get correct errorMessage - duplicate account', () => {
    component.firstName = 'firstName';
    component.lastName = 'lastName';
    component.email = 'email@email.de';
    component.password = 'password123';
    component.passwordRepeat = 'password123';
    expect(component.getErrorMessage()).toEqual('Account existiert bereits');
  });

  it('should get if parameters are valid - wrong firstname', () => {
    component.firstName = '';
    expect(component.areParametersValid()).toBeFalse();
  });

  it('should get if parameters are valid - wrong lastName', () => {
    component.firstName = 'firstName';
    component.lastName = '';
    expect(component.areParametersValid()).toBeFalse();
  });

  it('should get if parameters are valid - wrong email', () => {
    component.firstName = 'firstName';
    component.lastName = 'lastName';
    component.email = '';
    expect(component.areParametersValid()).toBeFalse();
  });

  it('should get if parameters are valid - wrong password', () => {
    component.firstName = 'firstName';
    component.lastName = 'lastName';
    component.email = 'email@email.de';
    component.password = '';
    expect(component.areParametersValid()).toBeFalse();
  });

  it('should get if parameters are valid - valid params', () => {
    component.firstName = 'firstName';
    component.lastName = 'lastName';
    component.email = 'email@email.de';
    component.password = 'password123';
    component.passwordRepeat = 'password123';
    expect(component.areParametersValid()).toBeTrue();
  });

  it('should perform signup - valid parameters', () => {
    component.error = true;
    component.firstName = 'firstName';
    component.lastName = 'lastName';
    component.email = 'email@email.de';
    component.password = 'password123';
    component.passwordRepeat = 'password123';
    spyOn(authenticationService, 'register').and.stub();

    component.performSignup();

    expect(component.error).toBeFalse();
  });

  it('should perform signup - invalid parameters', () => {
    component.error = false;
    component.firstName = 'firstName';
    component.lastName = 'lastName';
    component.email = 'email@email.de';
    component.password = 'password123';
    component.passwordRepeat = '';
    spyOn(authenticationService, 'register').and.stub();

    component.performSignup();

    expect(component.error).toBeTrue();
  });

});
