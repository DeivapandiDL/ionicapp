import { Component, OnInit } from '@angular/core';
import { AppserviceService } from 'src/app/services/appservice.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  custDetails:any=[];
  constructor(private cookieService:CookieService,private appService:AppserviceService,private router:Router) {
    this.getCustList();
   }

  ngOnInit() {}

  getCustList(){
    
    this.appService.getList().subscribe(data =>{
      if(data){
        this.custDetails = data;
        console.log(this.custDetails);
      }
    })
  
  }

}
