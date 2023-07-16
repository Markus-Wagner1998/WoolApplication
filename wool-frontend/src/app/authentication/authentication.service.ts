import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  loginSuccess: Subject<boolean> = new Subject();
  jwtToken: string = '';

  constructor(private readonly http: HttpClient, private readonly router: Router) { }

  register(firstName: string, lastName: string, email: string, password: string): void {
    this.http.post<JwtTokenResponse>(
      '/api/auth/signup',
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      }
    ).subscribe((data) => {
      this.jwtToken = data.token;
      this.router.navigate(['/']);
    });
  }

  login(email: string, password: string): void {
    this.http.post<JwtTokenResponse>(
      '/api/auth/signin',
      {
        email: email,
        password: password
      }
    ).subscribe({
      next: (data) => {
        this.jwtToken = data.token;
        this.loginSuccess.next(true);
        this.router.navigate(['/']);
      },
      error: (error) => this.loginSuccess.next(false),
    });
  }

  logout(): void {
    this.jwtToken = '';
    this.router.navigate(['/login']);
  }

}

interface JwtTokenResponse {
  token: string;
}