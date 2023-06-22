import { Component, OnInit } from '@angular/core';
import { Wool, InventoryImage } from '../data/Wool';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

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
    intensity: 0,
    initialAmount: 0,
    remainingAmount: 0,
    singleAmount: 0,
    tags: [],
    images: [],
  };

  constructor(private readonly http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        if (params['inventoryId']) {
          this.http.get<Wool>('http://192.168.178.99:8080/inventory/' + params['inventoryId'])
            .subscribe((data?: Wool) => {
              if (data) {
                this.wool = data;
              }
            })
        }
      }
    )
  }

  submitForm(): void {
    if (!this.validateWool()) {
      alert('Not all fields were filled');
    }
    if (this.wool.id > 0) {
      this.updateWool();
    } else {
      this.createWool();
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

  private validateWool(): boolean {
    return this.wool.name.length > 0 
      && this.wool.color.length > 0
      && this.wool.brand.length > 0
      && this.wool.intensity > 0;
  }

  private createWool(): void {
    this.http.post<Wool>('http://192.168.178.99:8080/inventory', this.wool)
      .subscribe((data: Wool) => {
        this.wool = data;
        this.navigateAfterUpload();
      });
  }

  private updateWool(): void {
    this.http.put<Wool>('http://192.168.178.99:8080/inventory/' + this.wool.id, this.wool)
      .subscribe((data: Wool) => {
        this.wool = data;
        this.navigateAfterUpload();
      });
  }

  private navigateAfterUpload(): void {
      this.router.navigate(
        [],
        {
          relativeTo: this.route,
          queryParams: {
            inventoryId: this.wool.id,
          },
          queryParamsHandling: 'merge',
        },
      );
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
