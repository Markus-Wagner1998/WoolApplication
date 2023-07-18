import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWoolComponent } from './add-wool.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { InputAutocompleteComponent } from '../input-autocomplete/input-autocomplete.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { Wool } from '../data/Wool';

describe('AddWoolComponent', () => {
  let component: AddWoolComponent;
  let fixture: ComponentFixture<AddWoolComponent>;
  let http: HttpClient;
  let route: ActivatedRoute;
  let router: Router;
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
      imports: [HttpClientModule, AppRoutingModule, FormsModule],
      declarations: [AddWoolComponent, InputAutocompleteComponent, LoadingSpinnerComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(AddWoolComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    spyOn(http, 'get').and.returnValue(of(mockWool));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load information based on queryParams', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppRoutingModule, FormsModule],
      declarations: [AddWoolComponent, InputAutocompleteComponent, LoadingSpinnerComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ inventoryId: '1000' }),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(AddWoolComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    spyOn(http, 'get').and.returnValue(of(mockWool));
    fixture.detectChanges();

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.wool).toEqual(mockWool)
  });

  it('should load no information for empty queryParams', () => {
    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.wool).toEqual({
      id: 0,
      name: '',
      color: '',
      brand: '',
      intensity: undefined,
      initialAmount: undefined,
      remainingAmount: undefined,
      singleAmount: undefined,
      tags: [],
      images: [],
    })
  });

  it('should not submit form for incomplete wool', () => {
    spyOn(window, "alert");
    component.submitForm();
    expect(window.alert).toHaveBeenCalledWith('Not all fields were filled');
  });

  it('should submit form as create', async () => {
    component.wool = mockWool;
    component.wool.id = 0;
    const postSpy = spyOn(http, 'post').and.returnValue(of({ status: 200, data: mockWool }));
    const navigateSpy = spyOn(router, 'navigate');
    component.submitForm();
    expect(postSpy).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/'], {
      queryParams: {
        inventoryId: undefined,
      },
      queryParamsHandling: 'merge',
    })
  });

  it('should submit form as update', () => {
    const putSpy = spyOn(http, 'put').and.returnValue(of({ status: 200, data: mockWool }));
    const navigateSpy = spyOn(router, 'navigate').and.stub();
    component.wool = mockWool;
    component.wool.id = 1000;
    component.submitForm();
    expect(component.loading).toBeFalse();
    expect(putSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/'], {
      queryParams: {
        inventoryId: undefined,
      },
      queryParamsHandling: 'merge',
    })
  });

  it('should store image as b64', () => {
    const readImageSpy = spyOn(component, 'readImageBase64').and.stub();
    component.storeImage({
      target: {
        files: ['stuff'],
      },
    } as any as Event);
    expect(readImageSpy).toHaveBeenCalled();
  });

  it('should get image source correctly, existing image', () => {
    component.wool = mockWool;
    component.wool.images = [{
      id: 1,
      imageBase64: 'base64',
    }];
    expect(component.getImageSource()).toEqual('base64');
  });

  it('should get image source correctly, no images', () => {
    component.wool = mockWool;
    component.wool.images = [];
    expect(component.getImageSource()).toEqual('http://placehold.it/180');
  });

  it('should get submit button text - update', () => {
    component.wool = mockWool;
    component.wool.id = 1000;
    expect(component.getSubmitButtonText()).toEqual('Wolle updaten');
  });

  it('should get submit button text - create', () => {
    component.wool = mockWool;
    component.wool.id = 0;
    expect(component.getSubmitButtonText()).toEqual('Wolle hinzufügen');
  });

});
