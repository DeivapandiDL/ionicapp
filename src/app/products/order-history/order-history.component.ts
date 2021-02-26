import { Component, OnInit } from '@angular/core';
import { AppserviceService } from 'src/app/services/appservice.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  custDetails:any=[];

  // ionViewWillEnter(){
  //   this.ngOnInit();
  // }

  constructor(private appService:AppserviceService,private cookieService: CookieService,private router:Router) {
    // let obj = JSON.parse(sessionStorage.getItem('userDetails'));
    let obj = JSON.parse(this.cookieService.get('userDetails'));
  console.log('object details:::::',obj);
  this.custDetails.push(obj);
   }
   productList:any = [];

  ngOnInit() {
    console.log("every time on routing not binded");
    this.getCustomerProduct();
  }

  ngAfterViewInit(){
    console.log("afterviewInit");
  }
  list:string = 'list';
  getCustomerProduct(){
    let id = this.custDetails[0].id ? this.custDetails[0].id: '';
    this.appService.getCustomerProduct(id).subscribe(data =>{
      if(data){
        this.productList = data;
        console.log(this.productList);
      }
    });  
  }

  view(list){
    this.list = list;
  }


}
