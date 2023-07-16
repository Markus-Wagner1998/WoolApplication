import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../app.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: boolean = false;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.loginSuccess.subscribe((value) => this.error = !value);
  }

  performLogin() {
    this.authenticationService.login(this.email, this.password);
  }
}
