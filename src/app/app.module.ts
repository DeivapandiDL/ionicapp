import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CommonModule } from '@angular/common';  
import { HttpClientModule } from '@angular/common/http';
import { FilterPipe } from '../app/search-pipe/filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClickOutsideDirective } from 'src/app/outsideclick.directive';
import { AppserviceService } from 'src/app/services/appservice.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuComponent } from './shared/menu/menu.component';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [AppComponent,MenuComponent,FilterPipe,FooterComponent,ClickOutsideDirective],
  entryComponents: [],
  imports: [BrowserModule,CommonModule, IonicModule.forRoot(), 
    AppRoutingModule,ReactiveFormsModule,FormsModule,HttpClientModule,NgxPaginationModule],
  providers: [
    StatusBar,
    SplashScreen,
    AppserviceService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
