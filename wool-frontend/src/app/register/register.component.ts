import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../data/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../app.component.css']
})
export class RegisterComponent {
  user: User = new User(
    0,
    '',
    '',
    '',
    '',
    '',
  );
  error: boolean = false;
  isLoading: boolean = false;

  constructor(private readonly authenticationService: AuthenticationService) {
    this.authenticationService.signupSuccess.subscribe((value) => {
      this.error = !value;
      this.isLoading = false;
    });
  }

  getErrorMessage(): string {
    if (!this.user.isFirstNameValid()) {
      return "Gültigen Vornamen eingeben";
    } else if (!this.user.isLastNameValid()) {
      return "Gültigen Nachnamen eingeben";
    } else if (!this.user.isEmailValid()) {
      return "Gültige E-Mail Adresse eingeben";
    } else if (!this.user.isPasswordValid()) {
      return "Gültiges Passwort eingeben";
    } else {
      return "Account existiert bereits";
    }
  }

  performSignup(): void {
    if (this.user.isCreateValid()) {
      this.error = false;
      this.isLoading = true;
      this.authenticationService.register(
        this.user.firstName, 
        this.user.lastName, 
        this.user.email, 
        this.user.password
      );
    } else {
      this.error = true;
      this.isLoading = false;
    }
  }

  resetState(): void {
    this.error = false;
    this.isLoading = false;
  }

}
