import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WoolListComponent } from './wool-list/wool-list.component';
import { WoolListItemComponent } from './wool-list/wool-list-item/wool-list-item.component';
import { AddWoolComponent } from './add-wool/add-wool.component';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { FilterComponent } from './wool-list/filter/filter.component';
import { InfoboxComponent } from './infobox/infobox.component';
import { InputAutocompleteComponent } from './input-autocomplete/input-autocomplete.component';

@NgModule({
  declarations: [
    AppComponent,
    WoolListComponent,
    WoolListItemComponent,
    AddWoolComponent,
    LoadingSpinnerComponent,
    FilterComponent,
    InfoboxComponent,
    InputAutocompleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
