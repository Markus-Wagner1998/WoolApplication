import { Component, OnInit } from '@angular/core';
import { Wool, InventoryImage } from '../data/Wool';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-wool',
  templateUrl: './add-wool.component.html',
  styleUrls: ['./add-wool.component.css']
})
export class AddWoolComponent implements OnInit{
  wool: Wool = {
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
  };
  loading: boolean = true;

  constructor(private readonly http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const inventoryUrl = environment.apiUrl + '/inventory/';
    this.route.queryParams.subscribe(
      params => {
        if (params['inventoryId']) {
          this.http.get<Wool>(inventoryUrl + params['inventoryId'])
            .subscribe((data?: Wool) => {
              if (data) {
                this.wool = data;
                this.loading = false;
              }
            })
        } else {
          this.loading = false;
        }
      }
    )
  }

  submitForm(): void {
    if (!this.validateWool()) {
      alert('Not all fields were filled');
    } else {
      this.loading = true;
      if (this.wool.id > 0) {
        this.updateWool();
      } else {
        this.createWool();
      }
      this.loading = false;
    }
  }

  storeImage(event: Event): void {
    let eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files && eventTarget.files[0]) {
      this.readImageBase64(eventTarget.files[0], this.wool.images);
    }
  }

  getImageSource(): string {
    if (this.wool.images.length > 0) {
      return this.wool.images[0].imageBase64;
    } else {
      return 'http://placehold.it/180';
    }
  }

  getSubmitButtonText(): string {
    return this.wool.id > 0 ? 'Wolle updaten' : 'Wolle hinzufügen';
  }

  getHeadingText(): string{
    return this.wool.id > 0 ? 'Wolle bearbeiten' : 'Neue Wolle';
  }

  private validateWool(): boolean {
    return this.wool.name.length > 0 
      && this.wool.color.length > 0
      && this.wool.brand.length > 0
      && !!this.wool.intensity
      && !!this.wool.initialAmount
      && !!this.wool.remainingAmount
      && !!this.wool.singleAmount
      && this.wool.intensity > 0;
  }

  private createWool(): void {
    const inventoryUrl = environment.apiUrl + '/inventory';
    this.http.post<Wool>(inventoryUrl, this.wool)
      .subscribe((data: Wool) => {
        this.wool = data;
        this.router.navigate(['/'], {
          queryParams: {
            inventoryId: undefined,
          },
          queryParamsHandling: 'merge',
        });
      });
  }

  private updateWool(): void {
    const inventoryUrl = environment.apiUrl + '/inventory/';
    this.http.put<Wool>(inventoryUrl + this.wool.id, this.wool)
      .subscribe((data: Wool) => {
        this.wool = data;
        this.router.navigate(['/'], {
          queryParams: {
            inventoryId: undefined,
          },
          queryParamsHandling: 'merge',
        });
      });
  }

  private readImageBase64(file: File, inventoryImages: InventoryImage[]): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = reader.result;
      if (typeof res === 'string') {
        inventoryImages[0] = {
          id: 0,
          imageBase64: res,
        }
      }
    }
    reader.readAsDataURL(file);
  }
}
