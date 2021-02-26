import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';
import { IonicModule } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { ProductsPageRoutingModule } from './products-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductsPage } from './products.page';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CheckoutComponent } from './checkout/checkout.component'; 
import { TooltipModule } from 'ng2-tooltip-directive';
import { OrderSuccessComponent } from './order-success/order-success.component';
import {OrderHistoryComponent } from './order-history/order-history.component';
import { WishlistComponent } from './wishlist/wishlist.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    TooltipModule,
    NgxPaginationModule,
    
  ],
  declarations: [ProductsPage,
    ProductDetailsComponent,
    CheckoutComponent,
    OrderSuccessComponent,
    FilterPipe,
    OrderHistoryComponent,
    WishlistComponent
  ],
  providers:[CookieService]
})
export class ProductsPageModule {}
