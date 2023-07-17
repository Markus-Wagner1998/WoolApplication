import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  loginSuccess: Subject<boolean> = new Subject();
  signupSuccess: Subject<boolean> = new Subject();
  jwtToken: string = '';

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    const oldJwt = localStorage.getItem('jwt');
    if (oldJwt) {
      this.jwtToken = oldJwt;
    }
  }

  isUserLoggedIn(): boolean {
    return !!this.jwtToken;
  }

  register(firstName: string, lastName: string, email: string, password: string): void {
    this.http.post<JwtTokenResponse>(
      '/api/auth/signup',
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      }
    ).subscribe({
      next: (data) => {
        this.jwtToken = data.token;
        localStorage.setItem('jwt', this.jwtToken);
        this.signupSuccess.next(true);
        this.router.navigate(['/']);
      },
      error: (error) => this.signupSuccess.next(false),
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
        localStorage.setItem('jwt', this.jwtToken);
        this.loginSuccess.next(true);
        this.router.navigate(['/']);
      },
      error: (error) => this.loginSuccess.next(false),
    });
  }

  refresh(): void {
    this.http.get<JwtTokenResponse>(
      '/api/auth/refresh'
    ).subscribe({
      next: (data) => {
        this.jwtToken = data.token;
        localStorage.setItem('jwt', this.jwtToken);
      }
    });
  }

  logout(): void {
    this.jwtToken = '';
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}

interface JwtTokenResponse {
  token: string;
}