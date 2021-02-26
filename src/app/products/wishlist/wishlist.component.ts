import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AppserviceService } from 'src/app/services/appservice.service';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  userDetailsAuth:any = {};
  constructor(private cookieService: CookieService,private appservice:AppserviceService) {
    let obj = JSON.parse(this.cookieService.get('userDetails'));
  console.log(this.cookieService.get('userDetails'))
  if(obj){ 
  this.userDetailsAuth = obj;
   }
  }

  ngOnInit() {
    this.getWishlist();
  }


  getWishlist(){
    this.appservice.getWishlist(this.userDetailsAuth.id).subscribe(data =>{
      console.log("as of now get wishlist is working fine "+data);
    })
  }
}
