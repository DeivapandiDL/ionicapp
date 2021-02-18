import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
    path: 'editProfile',
    component: EditProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
