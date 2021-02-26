import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../services/appservice.service'; 
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  getProductCount:any = [];
  list:string = 'grid';
  userDetailsAuth:any = {};
  constructor(private cookieService:CookieService,private appService:AppserviceService,private router:Router) {
    let pr = JSON.parse(sessionStorage.getItem("getProductCount"));
    if(pr){ 
    this.getProductCount = pr;
    // this.removeZeroCount();
    }
    this.getUserAuth();
   }
   userLogin:boolean = false;
   getUserAuth(){
    let obj = JSON.parse(this.cookieService.get('userDetails'));
    if(obj){ 
    this.userDetailsAuth = obj;
    console.log(this.userDetailsAuth);
    if(Object.keys(this.userDetailsAuth).length > 0){
      this.userLogin = true;
    }
  }
  }
  menuId:any = {};
  menuName:string = "";
  productList:any = [];
  count:number = 0;
  tempcount:any = [];
  cartIDNo:number = 0;
  productListData:any = [];
  ngOnInit() {
  
    this.appService.productCountChange.subscribe(count => {
      if(Object.keys(count).length > 0){ 
      this.getProductclickCount(count);
      }
      });

    this.appService.menuChange.subscribe(menu => {
    this.menuId = menu;
    this.getCategoryProduct();
    });
    this.getCategoryProduct();
    this.getProducts();
  }

  getProductclickCount(count){
    this.tempcount = [];
    if(this.getProductCount.length > 0){
      this.tempcount = this.getProductCount.filter(data => {return data.productId == count.productId});
      console.log(this.tempcount);
      if(this.tempcount.length == 0){
        this.getProductCount.push(count);
      }
      else if(this.tempcount.length > 0){
        this.getProductCount.forEach(element => {
          if(element.productId == this.tempcount[0].productId){
            element.count = count.count;
          }
        });
      }
      
     }
     else if(this.getProductCount.length == 0){
       this.getProductCount.push(count);
     }
     sessionStorage.setItem("getProductCount",JSON.stringify(this.getProductCount));
     this.tempcount = [];
     this.getProductQuantity();
     }
     
  

  view(list){
    this.list = list;
  }
  priceSort(event){
    console.log(event.target.value);
    if(event.target.value != '' && event.target.value == 'low'){ 
      this.productList.forEach(subcat => {
      subcat.product.sort((a, b) =>  parseFloat(a.productRate) - parseFloat(b.productRate));
      });
    }
    if(event.target.value != '' && event.target.value == 'high'){ 
      this.productList.forEach(subcat => {
      subcat.product.sort((a, b) =>  parseFloat(b.productRate) - parseFloat(a.productRate));
      });
    }
  }

  getWishlistData:any = [];
getWishlist(){
  this.appService.getWishlist(this.userDetailsAuth.id).subscribe(data =>{
    console.log("data wishlist");
    console.log(data);
    this.getWishlistData = data;
    console.log(this.productList);
      this.productList.forEach(subcat => {
      subcat.product.forEach(product =>{
        product.wishlist = false;
        this.getWishlistData.forEach(wish =>{
        if((product.productID == wish.productID) && (wish.customerID == this.userDetailsAuth.id)){
          product.wishlist = true;
          console.log(product);
        }
      });
    });
  });
  })
}

  addWishlist(id){
    if(!this.userLogin){
      console.log(id);
      swal({
        title: "Login Necessary",
        type: 'warning',
        showConfirmButton: true,
        showCancelButton: false    
      })
      .then((willDelete) => {
      });
      return;
    }
    else{
      let obj = {
        productID:id,
        customerID:this.userDetailsAuth.id
      }
      this.appService.postWishlist(obj).subscribe(data => {
        console.log(data);
        this.getWishlist();
      })
  
    } 
  }
  
  deleteWishlist(id){
    this.appService.deleteWishlist(id).subscribe(data => {
      console.log(data);
      this.getWishlist();
    })
  }

  getProducts(){
    this.appService.getProductList().subscribe((data) => {
        if(data){
          this.productListData = data;
        }
    });
}



cartNumber:number = 1;
productArr:any = {};
  
  gotoProductDesc(name,id){
    let product = {'id':id, 'name':name}
    this.appService.product = product;
    sessionStorage.setItem("productData",JSON.stringify(product));
    // this.router.navigate(['products/product-details']);
        this.router.navigate(['products/product-details'], { queryParams: { name: name}});
  }

  getCategoryProduct(){
    if(Object.keys(this.menuId).length > 0){ 
      this.menuName = this.menuId.name;
    }
    else{
      this.menuId = JSON.parse(sessionStorage.getItem("productMenu"));
    }
    setTimeout(() =>{
    this.appService.getCategoryProduct(this.menuId.id).subscribe(data =>{
      console.log(data);
      this.productList = data;
      this.getProductQuantity();
      this.getWishlist();
    })
  });
  }
  subcatSetID:number = 0;
  subcatSetIDBoolean:boolean = true;
  getAll(id){
    let data = [];
    this.subcatSetIDBoolean = true;
    this.subcatSetID = id;
    data = this.productList.filter(data => {return data.subCatID == id});
    if(data.length > 0){
      if(data[0].product.length > 0){
        this.subcatSetIDBoolean = true;
      }
      else{
        this.subcatSetIDBoolean = false;
      }
    }
  }


  getProductQuantity(){
    if(this.getProductCount.length > 0){ 
      this.productList.forEach(subcat => {
        subcat.product.forEach(product =>{
          product.quantityBool = false;
          product.quantity = 0;
        this.getProductCount.forEach(prcount => {
          if(product.productID == prcount.productId && prcount.count > 0){
            product.quantityBool = true;
            product.quantity = prcount.count;
          }
        });
      })
      });
    }
    console.log(this.productList);
  }


  countClick(prid,count,nos){
    this.productArr = {};
    if(nos == 0){ 
    // if(count > 1){
      count = count - 1;
    // }
  }
  else if(nos == 1){
    count = count + 1;
  }
  this.productArr = {'count':count,'productId':prid};
  this.addToCartToCheckout();
}


 


  addToCartToCheckout(){
    this.appService.changeCount(this.productArr);
     this.getProductclickCount(this.productArr);
  }


  openCount(prId){
    this.productList.forEach(subcat => {
      subcat.product.forEach(product =>{
        if(product.productID == prId){
          product.quantityBool = true;
          this.countClick(product.productID,product.quantity,1);
        }
    })
    });
  }







}
