import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Wool } from 'src/app/data/Wool';

@Component({
  selector: 'app-wool-list-item',
  templateUrl: './wool-list-item.component.html',
  styleUrls: ['./wool-list-item.component.css']
})
export class WoolListItemComponent {
  @Input()
  wool!: Wool;
  @Output()
  elementDeletedEmitter: EventEmitter<void> = new EventEmitter();
  expanded: boolean = false;

  constructor(private readonly http: HttpClient, private router: Router) {}

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  getWoolImage(): string {
    if (this.wool.images?.length > 0) {
      return this.wool.images[0].imageBase64
    }
    return '';
  }

  deleteWool(event: Event): void {
    this.http.delete<Wool>('http://192.168.178.99:8080/inventory/' + this.wool.id)
      .subscribe(() => {
        this.elementDeletedEmitter.next();
      });
    event.stopPropagation();
  }

  editWool(event: Event): void {
      this.router.navigate(
        ['add'],
        {
          queryParams: {
            inventoryId: this.wool.id,
          },
          queryParamsHandling: 'merge',
        },
      );
    event.stopPropagation();
  }
}
