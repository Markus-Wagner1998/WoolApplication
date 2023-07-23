import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../app.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: boolean = false;
  showMessage: boolean = false;
  message: string = '';

  constructor(private authenticationService: AuthenticationService,
              private readonly route: ActivatedRoute) {
    this.authenticationService.loginSuccess.subscribe((value) => this.error = !value);
    this.route.queryParams.subscribe((queryParams) => {
      if(queryParams['passwordReset'] && queryParams['passwordReset'] === 'true') {
        this.showMessage = true;
        this.message = 'Passwort erfolgreich zurückgesetzt';
      } else if(queryParams['notActive'] && queryParams['notActive'] === 'true') {
        this.showMessage = true;
        this.message = 'Account vor Benutzung aktivieren';
      } else if(queryParams['active'] && queryParams['active'] === 'true') {
        this.showMessage = true;
        this.message = 'Account aktiviert';
      } else if(queryParams['loggedOut'] && queryParams['loggedOut'] === 'true') {
        this.showMessage = true;
        this.message = 'Erfolgreich ausgeloggt';
      }
    })
  }

  performLogin() {
    this.authenticationService.login(this.email, this.password);
  }
}
