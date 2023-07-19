import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoolListComponent } from './wool-list.component';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { of } from 'rxjs';
import { Wool } from '../data/Wool';
import { WoolListItemComponent } from './wool-list-item/wool-list-item.component';
import { ActivatedRoute } from '@angular/router';

describe('WoolListComponent', () => {
  let component: WoolListComponent;
  let fixture: ComponentFixture<WoolListComponent>;
  let http: HttpClient;
  let getSpy: jasmine.Spy;
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
      declarations: [WoolListComponent, WoolListItemComponent, LoadingSpinnerComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({name: 'name'}),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(WoolListComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    getSpy = spyOn(http, 'get').and.returnValue(of([mockWool]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply filter on init', () => {
    component.woolFilter.brand = 'brand';
    component.ngOnInit();
    expect(component.woolFilter.name).toEqual('name');
    expect(component.woolFilter.brand).toBeFalsy();
  });

  it('should handle element deleted - name filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.name = 'name';
    const httpParams: HttpParams = new HttpParams().set('name', 'name');

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - brand filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.brand = 'brand';
    const httpParams: HttpParams = new HttpParams().set('brand', 'brand');

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - color filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.color = 'color';
    const httpParams: HttpParams = new HttpParams().set('color', 'color');

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - initialAmountMin filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.initialAmountMin = 3;
    const httpParams: HttpParams = new HttpParams().set('initialAmountMin', 3);

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - initialAmountMax filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.initialAmountMax = 3;
    const httpParams: HttpParams = new HttpParams().set('initialAmountMax', 3);

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - intensityMin filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.intensityMin = 3;
    const httpParams: HttpParams = new HttpParams().set('intensityMin', 3);

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - intensityMax filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.intensityMax = 3;
    const httpParams: HttpParams = new HttpParams().set('intensityMax', 3);

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - remainingAmountMin filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.remainingAmountMin = 3;
    const httpParams: HttpParams = new HttpParams().set('remainingAmountMin', 3);

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - remainingAmountMax filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.remainingAmountMax = 3;
    const httpParams: HttpParams = new HttpParams().set('remainingAmountMax', 3);

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - singleAmountMin filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.singleAmountMin = 3;
    const httpParams: HttpParams = new HttpParams().set('singleAmountMin', 3);

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should handle element deleted - singleAmountMax filter', () => {
    component['resetWoolFilter']();
    component.woolFilter.singleAmountMax = 3;
    const httpParams: HttpParams = new HttpParams().set('singleAmountMax', 3);

    component.handleElementDeleted();

    expect(component.loading).toBeFalse();
    expect(getSpy).toHaveBeenCalledWith('/api/inventory', { params: httpParams });
  });

  it('should remove buttons', () => {
    component.buttonsVisible = true;
    component.removeButtons();
    expect(component.buttonsVisible).toBeFalse();
  });

  it('should toggle buttons', () => {
    component.toggleButtons();
    expect(component.buttonsVisible).toBeTrue();
  });

});
