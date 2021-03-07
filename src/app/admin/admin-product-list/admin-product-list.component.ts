import { Component, OnInit } from '@angular/core';
import { AppserviceService } from 'src/app/services/appservice.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss'],
})
export class AdminProductListComponent implements OnInit {

  constructor(private cookieService:CookieService,private appService: AppserviceService,private router:Router) { }
  getProducts:any = [];
  ngOnInit() {
    this.getProductList();
  }

  getProductList(){
    this.appService.getProductList().subscribe(data =>{
      if(data){
        this.getProducts = data;
        console.log(this.getProducts);
      }
    })
  }

  sort(colName) {
    console.log(colName);
    this.getProducts.sort((a, b) =>
      a[colName] > b[colName] ? 1 : a[colName] < b[colName] ? -1 : 0
    );
  }
deleteId:number;
deletedProductName:string;
DeleteProduct(id,name){ 
  this.deleteId = id;
  this.deletedProductName = name;
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this imaginary file!",
    type: 'warning',
    showConfirmButton: true,
    showCancelButton: true     
  })
  .then((willDelete) => {
      if(willDelete.value){
           this.deleteproductApp();
      }else{
        
      }
    console.log(willDelete)
  });
}

deleteproductApp(){
  this.appService.deleteproduct(this.deleteId).subscribe(data => {
    console.log(data);
    if(Object.keys(data).length > 0) { 
      swal("You have deleted "+this.deletedProductName);
      this.refreshProduct();
    }
  })
}



refreshProduct(){
  this.deletedProductName = "";
  this.deleteId = 0;
  setTimeout(() =>{
    this.getProductList();
  },1000);
}

EditProduct(id){
this.appService.adminProductId = id;
setTimeout(() => {
  this.router.navigate(['/admin/EditProduct']);
},100);

}
}
