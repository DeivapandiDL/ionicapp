import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminProductListComponent } from './admin-product-list/admin-product-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { EditproductComponent } from './editproduct/editproduct.component';
const routes: Routes = [
  {
    path: '',
    component: AdminPage,
  },
  {
    path: 'addProduct',
    component: AdminProductComponent,
  },
  {
    path: 'AdminProductList',
    component: AdminProductListComponent
  },
  {
    path:'customer-list',
    component:CustomerListComponent
  },
  {
    path: 'EditProduct',
    component: EditproductComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
