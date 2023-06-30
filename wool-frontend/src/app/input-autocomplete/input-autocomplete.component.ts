import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-input-autocomplete',
  templateUrl: './input-autocomplete.component.html',
  styleUrls: ['./input-autocomplete.component.css']
})
export class InputAutocompleteComponent {
  showAutocomplete: boolean = false;
  autocompleteOptions: string[] = [];

  @Input() dataType: string = '';

  @Input() data: any;
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly http: HttpClient) {

  }

  onInput() {
    const dataUrl = environment.apiUrl + '/data/';
    if (this.dataType && this.data) {
      this.http.get<string[]>(dataUrl + this.dataType + '/' + this.data)
        .subscribe((returnData?: string[]) => {
          if (returnData) {
            this.autocompleteOptions = returnData;
          }
        });
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

}
