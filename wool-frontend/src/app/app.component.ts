import { Component } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Wool Organizer';
  menuOpen: boolean = false;

  constructor(private readonly authenticationService: AuthenticationService) {}

  isLoggedIn(): boolean {
    return this.authenticationService.isUserLoggedIn();
  }

  logout(): void {
    this.authenticationService.logout();
  }

  openMenu(): void {
    this.menuOpen = true;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
