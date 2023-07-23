import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WoolFilter } from 'src/app/data/Wool';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css', '../../app.component.css']
})
export class FilterComponent {
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

  constructor(private readonly router: Router, 
    private readonly route: ActivatedRoute) {
      this.applyFilter();
  }

  navigateToList(): void {
    this.router.navigate(['/'], {
      queryParams: this.woolFilter
    });
  }

  resetFilters(): void {
    this.router.navigate(['/'], {
      queryParams: {},
      queryParamsHandling: '',
    });
  }

  private applyFilter(): void {
    this.route.queryParams.subscribe((params) => {
      this.woolFilter = {
        ...this.woolFilter,
        ...params,
      };
    });
  }

}
