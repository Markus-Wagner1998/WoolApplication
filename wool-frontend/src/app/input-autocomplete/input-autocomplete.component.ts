import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getHttpUrl } from '../util';

@Component({
  selector: 'app-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.css']
})
export class InputAutocompleteComponent {
  showAutocomplete: boolean = false;
  autocompleteOptions: string[] = [];
  selectedIndex: number = -1;

  @Input() dataType: string = '';

  @Input() data: any;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly http: HttpClient) { }

  onInput() {
    const dataUrl = getHttpUrl('/api/data/');
    if (this.dataType && this.data) {
      this.http.get<string[]>(dataUrl + this.dataType + '/' + this.data)
        .subscribe((returnData?: string[]) => {
          if (returnData) {
            this.autocompleteOptions = returnData;
            this.showAutocomplete = true;
          }
        });
    } else {
      this.autocompleteOptions = [];
    }
    this.dataChange.emit(this.data);
  }

  onOptionClick(value: any): void {
    this.data = value;
    this.dataChange.emit(this.data);
    this.showAutocomplete = false;
  }

  async removeAutocomplete(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.showAutocomplete = false;
  }

  handleArrowDown(): void {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.autocompleteOptions.length - 1);
  }

  handleArrowUp(): void {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
  }

  handleEnter(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      if (this.selectedIndex >= 0 && this.selectedIndex < this.autocompleteOptions.length) {
        this.data = this.autocompleteOptions[this.selectedIndex];
        this.showAutocomplete = false;
      }
      event.preventDefault();
    }
  }

  isSelected(index: number): boolean {
    return this.selectedIndex === index;
  }

}
