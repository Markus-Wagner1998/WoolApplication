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
  error: boolean = false;

  constructor(private readonly authenticationService: AuthenticationService) {
    this.authenticationService.signupSuccess.subscribe((value) => this.error = !value);
  }

  getErrorMessage(): string {
    return "Ooops, Somethring went terribly wrong";
  }

  performSignup(): void {
    this.authenticationService.register(
      this.firstName, 
      this.lastName, 
      this.email, 
      this.password
    );
  }

}
