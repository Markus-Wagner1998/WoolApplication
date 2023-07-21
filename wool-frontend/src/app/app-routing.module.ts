import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WoolListComponent } from './wool-list/wool-list.component';
import { AddWoolComponent } from './add-wool/add-wool.component';
import { FilterComponent } from './wool-list/filter/filter.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './authentication/authentication.guard';
import { RegisterComponent } from './register/register.component';
import { AccountGuard } from './authentication/account.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: WoolListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddWoolComponent, canActivate: [AuthGuard] },
  { path: 'filter', component: FilterComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AccountGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AccountGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
