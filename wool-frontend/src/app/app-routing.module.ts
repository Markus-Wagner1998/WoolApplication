import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WoolListComponent } from './wool-list/wool-list.component';
import { AddWoolComponent } from './add-wool/add-wool.component';

const routes: Routes = [
  { path: '', component: WoolListComponent },
  { path: 'add', component: AddWoolComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
