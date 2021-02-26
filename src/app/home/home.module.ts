import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { TooltipModule } from 'ng2-tooltip-directive';
import { CookieService } from 'ngx-cookie-service';
import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TooltipModule
  ],
  declarations: [HomePage],
  providers: [CookieService]
})
export class HomePageModule {}
