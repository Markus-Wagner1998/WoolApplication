import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getHttpUrl } from '../util';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {
  message: string = 'Account wird aktiviert;'

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams['hash']) {
        const currentUserhash: string = queryParams['hash'];
        this.http.get(getHttpUrl('/api/auth/activate/' + currentUserhash)).subscribe((data) => {
          this.router.navigate(['/login'], {
            queryParams: {
              active: true,
            },
          });
        })
      } else {
        this.router.navigate(['/login']);
      } 
    })
  }
}
