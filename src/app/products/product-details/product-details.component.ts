import { Component, OnInit } from '@angular/core';
import { AppserviceService } from '../../services/appservice.service'; 
import * as CryptoJS from 'crypto-js';
import { Router,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  previousUrl:string;
  constructor(private appService:AppserviceService,private router:Router) {
    router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe((event: NavigationEnd) => {
    console.log('prev:', event.url);
    this.previousUrl = event.url;
  });
   }
  getProduct:any = {};
productId:string = "";
getProductList:any = [];
cartNumber:number = 1;
getProductStoreCount:any = [];

  ngOnInit() {
    let productCount = JSON.parse(sessionStorage.getItem("getProductCount"));
    if(productCount){
    this.getProductStoreCount = productCount;  
    }
    console.log(this.getProductStoreCount);
    if(Object.keys(this.appService.product).length > 0){
      this.getProduct = this.appService.product;
    }
    else{
      this.getProduct = JSON.parse(sessionStorage.getItem("productData"));
    }
    setTimeout(()=>{
      this.getProductDetails(this.getProduct.id);
    },500);
  }

  getProductDetails(id){
    this.appService.getProductDetails(id).subscribe(data =>{
      console.log(data);
      this.getProductList = data[0];
      if(this.getProductStoreCount.length > 0){
       let temparray = this.getProductStoreCount.filter(data => {return data.productId == this.getProductList.productID});
       this.cartNumber = temparray[0].count;
       console.log(this.cartNumber);
      }
    })
  }
tempcount:any = [];
tempNO:number = 0;
productArr:any = {};
  countClick(nos){
    this.productArr = {};
    this.tempNO = this.tempNO + 1;
    console.log(this.tempNO);
    if(nos == 0){ 
    if(this.cartNumber > 1){
      this.cartNumber = this.cartNumber - 1;
    }
  }
  else if(nos == 1){
    this.cartNumber = this.cartNumber + 1;
  }
  this.productArr = {'count':this.cartNumber,'productId':this.getProductList.productID};
  var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.getProductStoreCount), 'thamdeva').toString();
  sessionStorage.setItem("getProductCount::::::::::",ciphertext);
  console.log(ciphertext);
// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, 'thamdeva');
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
 
console.log(decryptedData);
  
}

addToCart(){
  this.appService.changeCount(this.productArr);
  if(this.getProductStoreCount.length > 0){
    this.tempcount = this.getProductStoreCount.filter(data => {return data.productId == this.productArr.productId});
    console.log(this.tempcount);
    if(this.tempcount.length == 0){
      this.getProductStoreCount.push(this.productArr);
    }
    else if(this.tempcount.length > 0){
      this.getProductStoreCount.forEach(element => {
        if(element.productId == this.tempcount[0].productId){
          element.count = this.productArr.count;
        }
      });
    }
   }
   else if(this.getProductStoreCount.length == 0){
     this.getProductStoreCount.push(this.productArr);
   }
   this.tempcount = [];
   sessionStorage.setItem("getProductCount",JSON.stringify(this.getProductStoreCount));
}




}
