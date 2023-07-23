import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css', '../app.component.css']
})
export class PasswordResetComponent {
  success: boolean = false;
  isLoading: boolean = false;
  email: string = '';

  constructor(private readonly http: HttpClient,
    private readonly router: Router) {}

  performReset(): void {
    this.isLoading = true;
    this.http.put('/api/auth/preparePasswordReset', {
      email: this.email,
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
  }

  resetState(): void {
    this.success = false;
    this.isLoading = false;
  }

}
