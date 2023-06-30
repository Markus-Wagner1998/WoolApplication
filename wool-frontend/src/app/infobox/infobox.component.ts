import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})
export class InfoboxComponent {
  @Input()
  headline: string = '';

  @Input()
  text: string = '';

  @Input()
  type: 'info' | 'warn' | 'error' = 'error';

  @Output()
  onNoClick: EventEmitter<void> = new EventEmitter();

  @Output()
  onYesClick: EventEmitter<void> = new EventEmitter();

}
