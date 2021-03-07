import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppserviceService } from 'src/app/services/appservice.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  userDetailsAuth:any = {};
  constructor(private router:Router,private cookieService: CookieService,private appservice:AppserviceService) {
    let obj = JSON.parse(this.cookieService.get('userDetails'));
  console.log(this.cookieService.get('userDetails'))
  if(obj){ 
  this.userDetailsAuth = obj;
   }
  }
  productLists:any =[];
  ngOnInit() {
    this.getWishlist();
  }


  getWishlist(){
    this.appservice.getWishlist(this.userDetailsAuth.id).subscribe(data =>{
      if(data){
        this.productLists = data;
        console.log(this.productLists)
      }
    });
  }


  gotoProductDesc(name,id){
    let product = {'id':id, 'name':name}
    this.appservice.product = product;
    sessionStorage.setItem("productData",JSON.stringify(product));
    // this.router.navigate(['products/product-details']);
        this.router.navigate(['products/product-details'], { queryParams: { name: name}});
  }


}
