import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { LoginPageRoutingModule } from './login-routing.module';
import {EditProfileComponent} from './edit-profile/edit-profile.component';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LoginPage,EditProfileComponent],
  providers: [CookieService]
})
export class LoginPageModule {}
