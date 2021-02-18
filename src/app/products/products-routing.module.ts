import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsPage } from './products.page';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsPage
  },
  {
    path:'product-details',
    component: ProductDetailsComponent
  },
  {
    path:'checkout',
    component:CheckoutComponent
  },
  {
    path:'order-success',
    component:OrderSuccessComponent
  },
  {
    path:'order-history',
    component:OrderHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsPageRoutingModule {}
