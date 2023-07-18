import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoolListComponent } from './wool-list.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { of } from 'rxjs';
import { Wool } from '../data/Wool';
import { WoolListItemComponent } from './wool-list-item/wool-list-item.component';

describe('WoolListComponent', () => {
  let component: WoolListComponent;
  let fixture: ComponentFixture<WoolListComponent>;
  let http: HttpClient;
  const mockWool: Wool = {
    id: 1000,
    name: 'name',
    color: 'color',
    brand: 'brand',
    intensity: 1,
    initialAmount: 1,
    remainingAmount: 1,
    singleAmount: 1,
    tags: [],
    images: [],
  };


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppRoutingModule],
      declarations: [WoolListComponent, WoolListItemComponent, LoadingSpinnerComponent]
    });
    fixture = TestBed.createComponent(WoolListComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    spyOn(http, 'get').and.returnValue(of([mockWool]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
