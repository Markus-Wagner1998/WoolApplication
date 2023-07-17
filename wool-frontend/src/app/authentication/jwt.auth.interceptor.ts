import { HttpClient, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtAuthInterceptor implements HttpInterceptor {

  constructor(private readonly authenticationService: AuthenticationService, private readonly http: HttpClient) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.authenticationService.jwtToken) {
      if (!req.url.includes('/api/auth/refresh')) {
        if (this.isTokenExpired(this.authenticationService.jwtToken)) {
          this.authenticationService.logout()
        } else if (this.willTokenExpireSoon(this.authenticationService.jwtToken)) {
          this.authenticationService.refresh();
        }
      }
      const authToken = "Bearer " + this.authenticationService.jwtToken;
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authToken)
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }

  private isTokenExpired(token: string): boolean {
    const tokenExpiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= tokenExpiry;
  }

  private willTokenExpireSoon(token: string): boolean {
    const tokenExpiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= tokenExpiry - 300;
  }
}