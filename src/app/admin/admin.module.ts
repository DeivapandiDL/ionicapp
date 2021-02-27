import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { IonicModule } from '@ionic/angular';
import { FilterPipe } from './filter.pipe';
import { TooltipModule } from 'ng2-tooltip-directive';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AdminPageRoutingModule } from './admin-routing.module';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminProductListComponent } from './admin-product-list/admin-product-list.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { EditproductComponent } from './editproduct/editproduct.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { CreateSubCategoryComponent } from './create-sub-category/create-sub-category.component';
import { AdminPage } from './admin.page';
// import { MyDatePickerModule } from 'mydatepicker';
// import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [
    // BrowserModule,
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    TooltipModule,
    ImageCropperModule
  ],
  declarations: [
    AdminPage,
    AdminProductComponent,
    AdminProductListComponent,
    FilterPipe,
    CreateCategoryComponent,
    EditproductComponent,
    CreateSubCategoryComponent,
    CustomerListComponent],
  providers: [CookieService]
})
export class AdminPageModule {}