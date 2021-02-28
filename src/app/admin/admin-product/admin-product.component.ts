import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppserviceService } from 'src/app/services/appservice.service';
import { Router } from '@angular/router';
import { ImageCroppedEvent, base64ToFile,ImageCropperComponent, CropperPosition} from 'ngx-image-cropper';

import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss'],
})
export class AdminProductComponent implements OnInit {
  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy'
    // other options are here...
  };

  myDateInit: boolean = true;
  model: IMyDateModel = null;
  registerProduct: FormGroup;
  submitted = false;
  getProduct:any = {};
  uploadedFiles: Array < File > ;
  constructor(private cookieService:CookieService,private formBuilder: FormBuilder,private router:Router,private http:HttpClient, private appservice:AppserviceService) { }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperHeight: any = ''; cropperWidth: any = '';
getCropper:Blob;
lastCroppedImage: any;
lastCropperPosition: CropperPosition;

  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }
  fileUpload:any;
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
    
      console.log(this.croppedImage);

  }
  imageLoaded(image: HTMLImageElement) {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
  
  
  minDate:Date = new Date();

  ngOnInit() {
    if (this.myDateInit) {
        // this.model = {isRange: false, singleDate: {date: { 
        //                                                     year: 2019, 
        //                                                     month: 5, 
        //                                                     day: 14 
        //                                                   }}};
    }
    else {
        // Initialize to today with javascript date object
        this.model = {isRange: false, singleDate: {jsDate: new Date()}};
    }
    if(this.appservice.adminProductId != ''){
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
      expiryDate:['',Validators.required],
      productOfferPercent: ['', Validators.required],
      // image:['']
      
  });
  this.getCategoryList();
  this.getSubCategory();
  }

  getProductEdit(id){
    this.appservice.getProductDetails(id).subscribe(data =>{
      console.log(data);
      this.getProduct = data[0];
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
  imageUrl: string = "";


  getImageupload(){
    console.log(this.croppedImage);
    // this.appservice.productImageUpload(this.croppedImage).subscribe(data => {
    //   console.log(data);
    // });
  }


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
     this.upload();
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
        //  this.registerProduct.value.productImage='';
         this.registerProduct.value.productImage = this.croppedImage;
         this.registerProduct.value.expiryDate = this.registerProduct.value.expiryDate.singleDate.jsDate;
         this.appservice.getAddProductDetails(this.registerProduct.value).subscribe(data => {
          console.log('product details:::',data);
          console.log('product values',this.registerProduct.value);
          if(data == 'true'){
            this.router.navigate(['admin/AdminProductList']);
          }
          
      })
      this.onReset();
     }
 
     createNewCategory(){
      this.router.navigate(['admin/createcategory']);
     }

     createNewSubCategory(){
      this.router.navigate(['admin/createsubcategory']);
     }




     onReset() {
         this.submitted = false;
         this.registerProduct.reset();
     }

}
