import { Component, Input } from '@angular/core';
import { Wool } from 'src/app/data/Wool';

@Component({
  selector: 'app-wool-list-item',
  templateUrl: './wool-list-item.component.html',
  styleUrls: ['./wool-list-item.component.css']
})
export class WoolListItemComponent {
  @Input()
  wool!: Wool;
  expanded: boolean = false;

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  getWoolImage(): string {
    if (this.wool.images?.length > 0) {
      return this.wool.images[0].imageBase64
    }
    return '';
  }
}
