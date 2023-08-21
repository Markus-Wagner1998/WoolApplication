import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAutocompleteComponent } from './input-autocomplete.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { getHttpUrl } from '../util';

describe('InputAutocompleteComponent', () => {
  let component: InputAutocompleteComponent;
  let fixture: ComponentFixture<InputAutocompleteComponent>;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppRoutingModule, FormsModule],
      declarations: [InputAutocompleteComponent]
    });
    fixture = TestBed.createComponent(InputAutocompleteComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process inputs - with valid data and datatype', () => {
    component.dataType = 'type';
    component.data = 'data';
    const getSpy = spyOn(http, 'get').and.returnValue(of(['v1', 'v2']));

    component.onInput();

    expect(getSpy).toHaveBeenCalledOnceWith(getHttpUrl('/api/data/type/data'));
    expect(component.autocompleteOptions).toEqual(['v1', 'v2']);
  });

  it('should process inputs - invalid data', () => {
    component.dataType = 'type';
    component.data = '';
    const getSpy = spyOn(http, 'get').and.returnValue(of(['v1', 'v2']));

    component.onInput();

    expect(getSpy).not.toHaveBeenCalled();
    expect(component.autocompleteOptions).toEqual([]);
  });

  it('should process inputs - invalid datatype', () => {
    component.dataType = '';
    component.data = 'data';
    const getSpy = spyOn(http, 'get').and.returnValue(of(['v1', 'v2']));

    component.onInput();

    expect(getSpy).not.toHaveBeenCalled();
    expect(component.autocompleteOptions).toEqual([]);
  });

  it('should handle option click', () => {
    component.showAutocomplete = true;

    component.onOptionClick('option');

    expect(component.data).toEqual('option');
    expect(component.showAutocomplete).toBeFalse();
  });

  it('should remove autocomplete', async () => {
    component.showAutocomplete = true;

    await component.removeAutocomplete();

    expect(component.showAutocomplete).toBeFalse();
  });

});
