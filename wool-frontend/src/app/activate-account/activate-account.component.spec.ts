import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateAccountComponent } from './activate-account.component';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { getHttpUrl } from '../util';

describe('ActivateAccountComponent', () => {
  let component: ActivateAccountComponent;
  let fixture: ComponentFixture<ActivateAccountComponent>;

  it('should forward with correct user message', () => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, HttpClientModule],
      declarations: [ActivateAccountComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              hash: 'hashValue',
            }),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(ActivateAccountComponent);
    component = fixture.componentInstance;
    const http = TestBed.inject(HttpClient);
    const getSpy = spyOn(http, 'get').and.returnValue(of('value'));
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(getSpy).toHaveBeenCalledOnceWith(getHttpUrl('/api/auth/activate/hashValue'));
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/login'], {
      queryParams: {
        active: true,
      },
    });
  });

  it('should forward to login page if no hash was provided', () => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, HttpClientModule],
      declarations: [ActivateAccountComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          },
        },
      ],
    });
    fixture = TestBed.createComponent(ActivateAccountComponent);
    component = fixture.componentInstance;
    const http = TestBed.inject(HttpClient);
    const getSpy = spyOn(http, 'get').and.returnValue(of('value'));
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(getSpy).not.toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/login']);
  });
});
