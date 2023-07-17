import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../app.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  passwordRepeat: string = '';
  error: boolean = false;

  constructor(private readonly authenticationService: AuthenticationService) {
    this.authenticationService.signupSuccess.subscribe((value) => this.error = !value);
  }

  getErrorMessage(): string {
    if (!this.isFirstNameValid()) {
      return "Gültigen Vornamen eingeben";
    } else if (!this.isLastNameValid()) {
      return "Gültigen Nachnamen eingeben";
    } else if (!this.isEmailValid()) {
      return "Gültige E-Mail Adresse eingeben";
    } else if (!this.isPasswordValid()) {
      return "Gültiges Passwort eingeben";
    } else {
      return "Account existiert bereits";
    }
  }

  performSignup(): void {
    if (this.areParametersValid()) {
      this.error = false;
      this.authenticationService.register(
        this.firstName, 
        this.lastName, 
        this.email, 
        this.password
      );
    } else {
      this.error = true;
    }
  }

  areParametersValid(): boolean {
    return this.isFirstNameValid() && this.isLastNameValid() && this.isEmailValid() && this.isPasswordValid();
  }

  isFirstNameValid(): boolean {
    return this.firstName.length > 2;
  }

  isLastNameValid(): boolean {
    return this.lastName.length > 2;
  }

  isEmailValid(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }

  isPasswordValid(): boolean {
    return this.password.length > 8 && this.password === this.passwordRepeat;
  }

}
