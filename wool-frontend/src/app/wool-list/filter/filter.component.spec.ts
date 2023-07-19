import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { InputAutocompleteComponent } from 'src/app/input-autocomplete/input-autocomplete.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppRoutingModule, HttpClientModule, FormsModule],
      declarations: [FilterComponent, InputAutocompleteComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ name: 'name' }),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate').and.stub();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.woolFilter.name).toEqual('name');
  });

  it('should navigate to list', () => {
    component.navigateToList();
    expect(navigateSpy).toHaveBeenCalledWith(['/'], {
      queryParams: {
        name: 'name',
        brand: undefined,
        color: undefined,
        initialAmountMin: undefined,
        initialAmountMax: undefined,
        intensityMin: undefined,
        intensityMax: undefined,
        remainingAmountMin: undefined,
        remainingAmountMax: undefined,
        singleAmountMin: undefined,
        singleAmountMax: undefined,
      },
    })
  });

  it('should reset filtes', () => {
    component.resetFilters();
    expect(navigateSpy).toHaveBeenCalledWith(['/'], {
      queryParams: { },
      queryParamsHandling: '',
    })
  });

});
