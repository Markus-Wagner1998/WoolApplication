import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../data/User';

@Component({
  selector: 'app-password-reset-hash',
  templateUrl: './password-reset-hash.component.html',
  styleUrls: ['./password-reset-hash.component.css', '../app.component.css']
})
export class PasswordResetHashComponent implements OnInit {
  user: User = new User(
    0,
    '',
    '',
    '',
    '',
    ''
  );
  error: boolean = false;
  isLoading: boolean = false;
  currentUserHash: string = '';

  constructor(private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['hash']) {
        this.currentUserHash = queryParams['hash'];
      } else {
        this.router.navigate(['/login']);
      }
    })
  }

  performReset(): void {
    if (this.user.isPasswordValid()) {
      this.isLoading = true;
        this.http.put('/api/auth/resetPassword/' + this.currentUserHash, {
          password: this.user.password,
        }).subscribe((data) => {
          this.isLoading = false;
          this.router.navigate(['/login'], {
            queryParams: {
              passwordReset: true,
            }
          })
        })
    } else {
      this.error = true;
    }
  } 

  resetState(): void {
    this.error = false;
  }

}
