import { Component, OnInit } from '@angular/core';
import { AppserviceService } from 'src/app/services/appservice.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  getProductCount:any = [];
  userDetailsAuth:any = {};
  goToLogin:boolean = false;
  constructor(private cookieService: CookieService,private appService:AppserviceService,private router:Router) { 
    this.getProductCount = JSON.parse(sessionStorage.getItem("getProductCount"));
    this.getUserAuth()
  }

  ngOnInit() {
    this.getProducts();
  }

  getUserAuth(){
    let obj = JSON.parse(this.cookieService.get('userDetails'));
    if(obj){ 
    this.userDetailsAuth = obj;
    console.log(this.userDetailsAuth);
    if(Object.keys(this.userDetailsAuth).length > 0){
     
    }
  }
  }


  

  

  
  productList:any = [];
  getProducts(){
    this.appService.getProductList().subscribe((data) => {
        if(data){
          this.productList = data;
          this.getQuantity();
        }
    });
}
showDataCart:any = [];
totalPrice:number = 0;
getQuantity(){
  this.showDataCart = [];
    this.productList.forEach(element => {
      this.getProductCount.forEach(count => {
        if(element.productID == count.productId && count.count > 0)  
        {
          element.quantity = count.count;
          
          if(element.productImage){
            element.imgURL = element.productImage;
            element.categoryID = element.categoryID;
          }
          element.productTotalRate = element.productRate * element.quantity;
          this.showDataCart.push(element);
        }
      });
    });
    console.log(this.showDataCart);

    this.totalPrice = this.showDataCart.map(a => a.productTotalRate).reduce(function(a, b)
        {
          return a + b;
        });

}


proceedtoCheckout(){
  let obj = [];
  if(Object.keys(this.userDetailsAuth).length > 0){
    this.showDataCart.forEach(element => {
      element.customerID = this.userDetailsAuth.id;
      obj.push({'productName':element.productName,'productDesc':element.productDescription,'productID':element.productID,'productImage':element.imgURL,'categoryID':element.categoryID,'customerID':this.userDetailsAuth.id,'productQuantity':element.quantity,'productPrice':element.productRate,'totalPrice':element.productTotalRate})
    });
    console.log(obj);
    console.log(this.showDataCart);
    this.addCart(obj);
  }
  else{
    // this.goToLogin = true;
    swal({
      title: "Login Necessary",
      // text: "Once deleted, you will not be able to recover this imaginary file!",
      type: 'warning',
      showConfirmButton: true,
      showCancelButton: false    
    })
    .then((willDelete) => {
        // if(willDelete.value){
        // }else{
          
        // }
        this.router.navigate(['login']);
      console.log(willDelete)
    });
  }
}

  //get cart details
  addCart(obj){
    this.appService.addCart(obj).subscribe(data => {
      console.log(data);
      swal({
        title: "Order Placed Successfully",
        type: 'success',
        showConfirmButton: true,
        showCancelButton: false     
      })
      .then((willDelete) => {
          if(willDelete.value){
            sessionStorage.removeItem("getProductCount");
            this.appService.changeCount([]);
            this.router.navigate(['/products/order-history']);
          }else{
            
          }
        console.log(willDelete)
      });
      
    });
  }

  tempcountCart:any = [];
  countClick(cart,nos){
    
    if(nos == 0){ 
    if(cart.quantity > 1){
      cart.quantity = cart.quantity - 1;
    }
    else if(cart.quantity == 1){
      this.showDataCart.forEach((count,index) => {
        if(count.productID == cart.productID)  
        {
          this.showDataCart.splice(index,1);
          cart.quantity = 0;
        }
      });
    }
  }
  else if(nos == 1){
    cart.quantity = cart.quantity + 1;
  }
  
  let product = {'count':cart.quantity,'productId':cart.productID}
  this.appService.changeCount(product);
  if(this.getProductCount.length > 0){
    this.tempcountCart = this.getProductCount.filter(data => {return data.productId == product.productId});
    console.log(this.tempcountCart);
    if(this.tempcountCart.length == 0){
      this.getProductCount.push(product);
    }
    else if(this.tempcountCart.length > 0){
      this.getProductCount.forEach((element,index) => {
        if(element.productId == this.tempcountCart[0].productId){
          if(product.count == 0)
          {
            this.getProductCount.splice(index, 1);
          }
          else{
            element.count = product.count;
          }
          
        }
      });
    }
   }
   else if(this.getProductCount.length == 0){
     this.getProductCount.push(product);
   }
   this.tempcountCart = [];
  sessionStorage.setItem("getProductCount",JSON.stringify(this.getProductCount));
  setTimeout(() =>{
    this.getProductCountDetails();
  },500);
}
count:any;
getProductCountDetails(){
  if(this.getProductCount.length > 0){ 
    console.log(this.getProductCount);
  }
  else{
    let datacount = JSON.parse(sessionStorage.getItem("getProductCount"));
    if(datacount && datacount.length > 0){ 
    this.getProductCount = datacount;
    this.count = this.getProductCount.map(a => a.count).reduce(function(a, b)
      {
        return a + b;
      });
    }
  }
  let tempCountPrice = []
  this.productList.forEach(element => {
    this.getProductCount.forEach(count => {
      if(element.productID == count.productId)  
      {
        element.quantity = count.count;
        element.productTotalRate = element.productRate * element.quantity;
        tempCountPrice.push(element)
      }
    });
  });

  this.totalPrice = tempCountPrice.map(a => a.productTotalRate).reduce(function(a, b)
      {
        return a + b;
      });
      console.log(this.totalPrice);

}



}
