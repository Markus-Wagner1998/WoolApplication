import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Wool, WoolFilter } from '../data/Wool';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-wool-list',
  templateUrl: './wool-list.component.html',
  styleUrls: ['./wool-list.component.css']
})
export class WoolListComponent implements OnInit{
  wools: Wool[] = [];
  woolFilter: WoolFilter = {
    name: undefined,
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
  };
  loading: boolean = true;
  buttonsVisible: boolean = false;

  constructor(
    public readonly authenticationService: AuthenticationService,
    private readonly http: HttpClient, 
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.applyFilter();
  }

  handleElementDeleted() {
    this.getWoolList();
  }

  showButtonsOnComputer(event: Event): void {
    if (event instanceof TouchEvent) {
      return;
    }
    this.buttonsVisible = true;
  }

  removeButtons(): void {
    this.buttonsVisible = false;
  }

  toggleButtons(): void {
    this.buttonsVisible = !this.buttonsVisible;
  }

  private resetWoolFilter(): void {
    this.woolFilter = {
      name: undefined,
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
    };
  }

  private getWoolList(): void {
    this.loading = true;
    const inventoryUrl = '/api/inventory';
    const params = {
      params: this.getHttpParams(), 
    }
    this.http
      .get<Wool[]>(inventoryUrl, params)
        .subscribe((data: Wool[]) => {
          this.wools = data
          this.loading = false;
        });
  }

  private applyFilter(): void {
    this.route.queryParams.subscribe((params) => {
      this.resetWoolFilter();
      this.woolFilter = {
        ...this.woolFilter,
        ...params,
      };
      this.getWoolList();
    });
  }

  private getHttpParams(): HttpParams {
    let httpParams: HttpParams = new HttpParams();
    if (this.woolFilter.name) {
      httpParams = httpParams.set('name', this.woolFilter.name)
    }
    if (this.woolFilter.brand) {
      httpParams = httpParams.set('brand', this.woolFilter.brand)
    }
    if (this.woolFilter.color) {
      httpParams = httpParams.set('color', this.woolFilter.color)
    }
    if (this.woolFilter.initialAmountMin) {
      httpParams = httpParams.set('initialAmountMin', this.woolFilter.initialAmountMin)
    }
    if (this.woolFilter.initialAmountMax) {
      httpParams = httpParams.set('initialAmountMax', this.woolFilter.initialAmountMax)
    }
    if (this.woolFilter.intensityMin) {
      httpParams = httpParams.set('intensityMin', this.woolFilter.intensityMin)
    }
    if (this.woolFilter.intensityMax) {
      httpParams = httpParams.set('intensityMax', this.woolFilter.intensityMax)
    }
    if (this.woolFilter.remainingAmountMin) {
      httpParams = httpParams.set('remainingAmountMin', this.woolFilter.remainingAmountMin)
    }
    if (this.woolFilter.remainingAmountMax) {
      httpParams = httpParams.set('remainingAmountMax', this.woolFilter.remainingAmountMax)
    }
    if (this.woolFilter.singleAmountMin) {
      httpParams = httpParams.set('singleAmountMin', this.woolFilter.singleAmountMin)
    }
    if (this.woolFilter.singleAmountMax) {
      httpParams = httpParams.set('singleAmountMax', this.woolFilter.singleAmountMax)
    }
    return httpParams;
  }

}