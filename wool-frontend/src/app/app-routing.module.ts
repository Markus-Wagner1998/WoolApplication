import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WoolListComponent } from './wool-list/wool-list.component';
import { AddWoolComponent } from './add-wool/add-wool.component';
import { FilterComponent } from './wool-list/filter/filter.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: WoolListComponent },
  { path: 'add', component: AddWoolComponent },
  { path: 'filter', component: FilterComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
