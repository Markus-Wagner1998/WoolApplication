import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWoolComponent } from './add-wool.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { InputAutocompleteComponent } from '../input-autocomplete/input-autocomplete.component';
import { FormsModule } from '@angular/forms';

describe('AddWoolComponent', () => {
  let component: AddWoolComponent;
  let fixture: ComponentFixture<AddWoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppRoutingModule, FormsModule],
      declarations: [AddWoolComponent, InputAutocompleteComponent]
    });
    fixture = TestBed.createComponent(AddWoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
