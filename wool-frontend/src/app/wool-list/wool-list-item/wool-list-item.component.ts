import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Wool } from 'src/app/data/Wool';
import { DialogService } from 'src/app/service/dialog.service';
import { getHttpUrl } from 'src/app/util';

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

  constructor(
    private readonly http: HttpClient, 
    private readonly router: Router, 
    private dialogService: DialogService
  ) { }

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
    this.dialogService.openDialog({
      headline: 'Eintrag löschen',
      text: 'Das Löschen des Eintrags ist dauerhaft. Fortfahren?',
      type: 'info',
    });
    this.dialogService.dialogComponentRef!.instance.onYesClick.subscribe(() => {
      const inventoryUrl = getHttpUrl('/api/inventory/');
      this.http.delete<Wool>(inventoryUrl + this.wool.id)
        .subscribe(() => {
          this.elementDeletedEmitter.next();
        });
      this.dialogService.closeDialog();
    });

    this.dialogService.dialogComponentRef!.instance.onNoClick.subscribe(() => {
      this.dialogService.closeDialog();
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
