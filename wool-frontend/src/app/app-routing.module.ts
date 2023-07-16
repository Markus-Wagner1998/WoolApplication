import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WoolListComponent } from './wool-list/wool-list.component';
import { AddWoolComponent } from './add-wool/add-wool.component';
import { FilterComponent } from './wool-list/filter/filter.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './authentication/authenticaiton.guard';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: WoolListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddWoolComponent, canActivate: [AuthGuard] },
  { path: 'filter', component: FilterComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
