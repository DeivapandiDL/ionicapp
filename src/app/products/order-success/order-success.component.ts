import { Component, OnInit } from '@angular/core';
import { AppserviceService } from 'src/app/services/appservice.service';
import { Router, RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss'],
})
export class OrderSuccessComponent implements OnInit {
  custDetails:any=[];

  constructor(private appService:AppserviceService,private router:Router) {
    this.getUserAuth();
   }

  ngOnInit() {}

  getUserAuth(){
    let obj = JSON.parse(sessionStorage.getItem('userDetails'));
  console.log('object details:::::',obj);
  this.custDetails.push(obj);
  }

}
