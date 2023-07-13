import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../app.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  submitLogin(): void {
    console.log("Logging in: ", this.username, this.password)
  }


}
