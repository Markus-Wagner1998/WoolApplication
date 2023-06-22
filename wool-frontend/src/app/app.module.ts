import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WoolListComponent } from './wool-list/wool-list.component';
import { WoolListItemComponent } from './wool-list/wool-list-item/wool-list-item.component';
import { AddWoolComponent } from './add-wool/add-wool.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    WoolListComponent,
    WoolListItemComponent,
    AddWoolComponent
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