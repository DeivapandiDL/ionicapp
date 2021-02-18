import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { IonicModule } from '@ionic/angular';
import { FilterPipe } from 'src/filter.pipe';
import { TooltipModule } from 'ng2-tooltip-directive';

import { AdminPageRoutingModule } from './admin-routing.module';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminProductListComponent } from './admin-product-list/admin-product-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { EditproductComponent } from './editproduct/editproduct.component';
import { AdminPage } from './admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TooltipModule
  ],
  declarations: [AdminPage,AdminProductComponent,AdminProductListComponent,FilterPipe,EditproductComponent,CustomerListComponent]
})
export class AdminPageModule {}
