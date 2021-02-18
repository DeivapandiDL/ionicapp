import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppserviceService } from 'src/app/services/appservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.scss'],
})
export class EditproductComponent implements OnInit {
  registerProduct: FormGroup;
  submitted = false;
  getProduct:any = {};
  uploadedFiles: Array < File > ;
  constructor(private formBuilder: FormBuilder,private router:Router,private http:HttpClient, private appservice:AppserviceService) { }

  ngOnInit() {
    if(this.appservice.adminProductId != ''){
      console.log(this.appservice.adminProductId);
      this.getProductEdit(this.appservice.adminProductId);
    }

    this.registerProduct = this.formBuilder.group({
      productName: ['', Validators.required],
      categoryID : ['', Validators.required],
      subcategoryID: ['', Validators.required],
      productCount: ['', Validators.required],
      productImage: ['', Validators.required],
      productDescription: ['', Validators.required],
      productRateSymbol: ['', Validators.required],
      productRate: ['', Validators.required],
      productOfferPercent: ['', Validators.required],
      
  });
  this.getCategoryList();
  this.getSubCategory();
  }
  editProductBoolean:boolean = false;
  getProductEdit(id){
    this.appservice.getProductDetails(id).subscribe(data =>{
      console.log(data);
      if(data){ 
      this.getProduct = data[0];
      this.editProductBoolean = true;
      }
    })
  }

numberOnly(event):boolean{
  const charCode=event.which ? event.which : event.keyCode;
  if(charCode > 31 && (charCode < 48 || charCode > 57)){
    return false;
  }
  return true;
}
textOnly(event){
  return(
    (event.charCode > 64 && event.charCode <91) ||
    (event.charCode > 96 && event.charCode <123)
  )   
}

  catList:any=[];
  subCatList:any=[];
  subTemp:any=[];
  subTempBoolean:boolean=true;
  getCategoryList(){
    this.appservice.getCategoryList().subscribe(data => {
      console.log('category details:::',data);
      this.catList=data;
  })

  }

  catSelect(event){
    this.subTemp=[];
    this.subTempBoolean=true;
    console.log(event.target.value);
    this.subCatList.forEach(element => {
      if(event.target.value==element.catID){
        this.subTemp.push(element);
      }
    });
    if(this.subTemp.length>0){
      this.subTempBoolean=false;
    }
    
  }
  getSubCategory(){
    this.appservice.getSubCategory().subscribe(data => {
      console.log('category details:::',data);
      this.subCatList=data;
  })

  }

  fileToUpload: any;
  imageUrl: any;



     get f() { return this.registerProduct.controls; }
     fileChange(element, file: FileList) {

      this.fileToUpload = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      console.log(this.imageUrl);
    }
    reader.readAsDataURL(this.fileToUpload);
      this.uploadedFiles = element.target.files;
      console.log('file upload',this.uploadedFiles);
    //  this.upload();
  }




cat='';
  upload() {
    this.cat=this.registerProduct.value.categoryID;

      let formData = new FormData();
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        console.log(this.registerProduct.value.categoryID);
          formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
          console.log('inside upload function this.uploadedFiles[i]',this.uploadedFiles[i]);
      // console.log('inside upload function this.uploadedFiles[i].name', this.uploadedFiles[i].name);
      }
      this.appservice.uploadImg(formData).subscribe((response) => {
              console.log('response received is ', response);
          })
  }
   

     pdtSubmit() {
         this.submitted = true;
 
         // stop here if form is invalid
         if (this.registerProduct.invalid) {
             return;
         } 
         // display form values on success
         this.registerProduct.value.productImage=this.uploadedFiles[0].name;
        //  console.log('uploadedFiles details:::',this.uploadedFiles);
        //  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerProduct.value, null, 4));
         this.appservice.getAddProductDetails(this.registerProduct.value).subscribe(data => {
          console.log('product details:::',data);
          if(data == 'true'){
            this.router.navigate(['admin/AdminProductList']);
          }
          
      })
      this.onReset();
     }
 
     onReset() {
         this.submitted = false;
         this.registerProduct.reset();
     }

}

