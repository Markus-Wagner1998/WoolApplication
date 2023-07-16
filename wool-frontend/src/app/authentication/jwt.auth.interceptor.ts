import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class JwtAuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.authenticationService.jwtToken) {
      const authToken = "Bearer " + this.authenticationService.jwtToken;
      const authReq = req.clone({
        headers: req.headers.set('Authorization', authToken)
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}