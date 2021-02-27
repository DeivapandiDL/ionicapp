import { Component, OnInit } from '@angular/core';
import { AppserviceService } from 'src/app/services/appservice.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-sub-category',
  templateUrl: './create-sub-category.component.html',
  styleUrls: ['./create-sub-category.component.scss'],
})
export class CreateSubCategoryComponent implements OnInit {
  constructor(private cookieService:CookieService,private router:Router,private appservice:AppserviceService) { }

  ngOnInit() {
    this.getCategoryDetails();
    this.getSubCategory();
  }

  catID:string = '';
  categoryList:any = [];
  subCategoryList:any = [];

  getSubCategory(){
    this.appservice.getSubCategory().subscribe(data =>{
      if(data){
        console.log(data);
        this.subCategoryList = data;
      }
    })
  }

  getCategoryDetails(){
    this.appservice.getCategoryList().subscribe(data =>{
      if(data){
        console.log(data);
        this.categoryList = data;
      }
    })
  }

  subCatName:string = '';
  catBoolean:boolean = false;
  subCatBoolean:boolean = false;
  subcatAlreadyExistBoolean:boolean = false;

  getCatId(){
    this.catBoolean = true;
    if(this.catID != ''){
      this.catBoolean = false;
    }
  }

  getSubCatName(){
    this.subCatBoolean = true;
    if(this.subCatName != ''){
      this.subCatBoolean = false;
    }
  }



  subcategorySubmit(){
    this.catBoolean = false;
  this.subCatBoolean = false;
if(this.subCatName == '' && this.catID == ''){
  this.catBoolean = true;
  this.subCatBoolean = true;
  return false;
}
else if(this.subCatName == '')
{
  this.subCatBoolean = true;
  return false;
}
else if (this.catID == '')
{
  this.catBoolean = true;
  return false;
}
else {
  let temp = this.subCategoryList.filter(data => {return data.subCatName.toLowerCase() == this.subCatName.toLowerCase()});
  if(temp.length > 0){
    this.subcatAlreadyExistBoolean = true;
    setTimeout(() => {
      this.subcatAlreadyExistBoolean = false;
    },3000);
  }
  else if(temp.length == 0){
    let obj = {
      catID:this.catID,
      subCatName:this.subCatName
    }
    this.appservice.createSubCategory(obj).subscribe(data => {
      console.log(data)
      swal({
        title: "Sub Category created Successfully",
        type: 'success',
        showConfirmButton: true,
        showCancelButton: false    
      })
      .then((willDelete) => {
        this.router.navigate(['admin/addProduct']);
        console.log(willDelete);
      });
    })
      
  }
}
  }
  onReset() {
    this.subCatName = '';
}
}