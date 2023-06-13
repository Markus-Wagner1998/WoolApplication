import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WoolListComponent } from './wool-list/wool-list.component';
import { WoolListItemComponent } from './wool-list/wool-list-item/wool-list-item.component';

@NgModule({
  declarations: [
    AppComponent,
    WoolListComponent,
    WoolListItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
