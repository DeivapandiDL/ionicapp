import { Component, OnInit } from '@angular/core';
import { AppserviceService } from 'src/app/services/appservice.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
 
  constructor(private cookieService:CookieService,private router:Router,private appservice:AppserviceService) { }

  ngOnInit() {
    this.getCategoryDetails();
  }

  categoryList:any = [];

  getCategoryDetails(){
    this.appservice.getCategoryList().subscribe(data =>{
      if(data){
        console.log(data);
        this.categoryList = data;
      }
    })
  }

  catName:string = '';
  catBoolean:boolean = false;
  catAlreadyExistBoolean:boolean = false;
  categorySubmit(){
console.log(this.catName);
if(this.catName == ''){
  this.catBoolean = true;
  return false;
}
else {
  let temp = this.categoryList.filter(data => {return data.catName.toLowerCase() == this.catName.toLowerCase()});
  if(temp.length > 0){
    this.catAlreadyExistBoolean = true;
    setTimeout(() => {
      this.catAlreadyExistBoolean = false;
    },3000);
  }
  else if(temp.length == 0){
    let obj = {
      catName:this.catName
    }
    this.appservice.createCategory(obj).subscribe(data => {
      console.log(data)
      swal({
        title: "Category created Successfully",
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
    this.catName = '';
}


}
