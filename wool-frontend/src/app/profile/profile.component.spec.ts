import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { UserDTO } from '../data/User';
import { FormsModule } from '@angular/forms';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, FormsModule],
      declarations: [ProfileComponent]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    const returnUserDTO: UserDTO = {
      id: 12,
      email: 'test@test.de',
      firstName: 'TestFirst',
      lastName: 'TestLast',
    };
    spyOn(http, 'get').and.returnValue(of(returnUserDTO));
    fixture.detectChanges();
  });

  it('should create and init correctly', () => {
    expect(component).toBeTruthy();
    expect(component.user.id).toEqual(12);
    expect(component.user.email).toEqual('test@test.de');
    expect(component.user.firstName).toEqual('TestFirst');
    expect(component.user.lastName).toEqual('TestLast');
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
    component.user.password = 'a';
    expect(component.getErrorMessage()).toEqual('Gültiges Passwort eingeben');
  });

  it('should get correct errorMessage - duplicate account', () => {
    component.user.firstName = 'firstName';
    component.user.lastName = 'lastName';
    component.user.email = 'email@email.de';
    component.user.password = 'password123';
    component.user.passwordRepeat = 'password123';
    expect(component.getErrorMessage()).toEqual('Fehler beim Update des Accounts');
  });

  it('should get correct successMessage', () => {
    expect(component.getSuccessMessage()).toEqual('Profil geupdated');
  });

  it('should reset state', () => {
    component.error = true;
    component.success = true;

    component.resetState();

    expect(component.success).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('should update user', () => {
    const returnUserDTO: UserDTO = {
      id: 100,
      firstName: 'updateFirst',
      lastName: 'updateLast',
      email: 'test@test.de',
    };
    spyOn(http, 'put').and.returnValue(of(returnUserDTO));

    component.updateUser();
    expect(component.error).toBeFalse();
    expect(component.success).toBeTrue();
  });

  it('should not be able to update user if user invalid', () => {
    component.user.email = '';

    component.updateUser();
    expect(component.error).toBeTrue();
    expect(component.success).toBeFalse();
  });

  it('should handle update user error in request', () => {
    spyOn(http, 'put').and.returnValue(throwError(() => new Error('Stuff')));

    component.updateUser();
    expect(component.error).toBeTrue();
    expect(component.success).toBeFalse();
  });

});
