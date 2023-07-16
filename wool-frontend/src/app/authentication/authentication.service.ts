import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
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
    ).subscribe((data) => {
      this.jwtToken = data.token;
      this.router.navigate(['/']);
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