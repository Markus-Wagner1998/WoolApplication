import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../data/User';
import { getHttpUrl } from '../util';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css', '../app.component.css']
})
export class PasswordResetComponent {
  success: boolean = false;
  error: boolean = false;
  isLoading: boolean = false;
  user: User = new User(
    0,
    '',
    '',
    '',
    '',
    '',
  );

  constructor(private readonly http: HttpClient,
    private readonly router: Router) {}

  performReset(): void {
    if (this.user.isEmailValid()) {
      this.isLoading = true;
      this.http.put(getHttpUrl('/api/auth/preparePasswordReset'), {
        email: this.user.email,
      }).subscribe({
        next: () => {
          this.success = true;
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        error: () => {
          this.success = false;
          this.isLoading = false;
        }
      })
    } else {
      this.error = true;
    }
  }

  resetState(): void {
    this.success = false;
    this.isLoading = false;
    this.error = false;
  }

}
