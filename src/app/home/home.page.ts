import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxCarousel } from 'ngx-carousel';
import { AppserviceService } from 'src/app/services/appservice.service';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  datas:any = [1,2,3,4,5,6,7,8,9,10]
  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  sliderBanner:any = [];
  getProductCount:any = [];
  productArr:any = {};
  tempcount:any [];
  count:number = 0;
  userDetailsAuth:any = {};
  userLogin:boolean = false;
  purchaseProduct:any = [];
  @ViewChild("sliderWidth", { static: false }) sliderWidth: ElementRef;
  constructor(private cookieService: CookieService, private formBuilder: FormBuilder, private appService: AppserviceService, private router:Router) {
    let pr = JSON.parse(sessionStorage.getItem("getProductCount"));
    this.getUserAuth();
    if(pr){ 
    this.getProductCount = pr;
    }
   }
   getUserAuth(){
    let obj = JSON.parse(this.cookieService.get('userDetails'));
    if(obj){ 
    this.userDetailsAuth = obj;
    console.log(this.userDetailsAuth);
    if(Object.keys(this.userDetailsAuth).length > 0){
      this.userLogin = true;
      this.getCustomerProduct();
    }
  }
  }
  getCustomerProduct(){
    let id = this.userDetailsAuth.id ? this.userDetailsAuth.id: '';
    this.appService.getCustomerProduct(id).subscribe(data =>{
      if(data){
        this.purchaseProduct = data;
        console.log(this.purchaseProduct);
        this.widthContainer = this.purchaseProduct.length * 280;
        this.getSliderInterval = setInterval(() =>{
          this.getSliderPrev(1)
        },6000)
      }
    })  
  }


  ngOnInit() {
    this.appService.productCountChange.subscribe(count => {
      this.tempcount = [];
      if(Object.keys(count).length > 0){ 
      if(this.getProductCount.length > 0){
       this.tempcount = this.getProductCount.filter(data => {return data.productId == count.productId});
       console.log(this.tempcount);
       if(this.tempcount.length == 0){
         this.getProductCount.push(count);
       }
       else if(this.tempcount.length > 0){
         this.getProductCount.forEach(element => {
           if(element.productId == this.tempcount[0].productId){
             element.count = count.count;
           }
         });
       }
       
      }
      else if(this.getProductCount.length == 0){
        this.getProductCount.push(count);
      }
      console.log(this.getProductCount);
      this.count = this.getProductCount.map(a => a.count).reduce(function(a, b)
        {
          return a + b;
        });
        console.log(this.count);
      }
      this.tempcount = [];
      });

    this.registerForm = this.formBuilder.group({
        title: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
    });
    this.getProducts();
    this.getUserDetails();
}


widthContainer:any;
getSliderInterval:any;
myStartFunction(){
  this.getSliderInterval = setInterval(() =>{
    this.getSliderPrev(1)
  },6000)
}

myStopFunction() {
  clearInterval(this.getSliderInterval);
  console.log("mouse enter detected");
}



marginDataSet:any = {};
tempcountSlider:number = 0;
sliderWidthSet:number = 280;
tempTrans:number;
getSliderPrev(nos){
if(nos == 1){
  if(this.tempcountSlider <= this.purchaseProduct.length - 4){
    this.tempcountSlider = this.tempcountSlider + 1;
    this.tempTrans = this.tempcountSlider * this.sliderWidthSet;
    this.marginDataSet = {
      '-ms-transform': 'translateX(-'+this.tempTrans+'px)',
    'transform': 'translateX(-'+this.tempTrans+'px)'
    };
  }
  else{
      this.marginDataSet = {
       '-ms-transform': 'translateX(0px)',
      'transform': 'translateX(0px)'
      };
      this.tempcountSlider = 0;
  }
}
else if (nos == 0){
  if(this.tempcountSlider > 0){
    this.tempTrans = this.tempTrans - this.sliderWidthSet;
    this.tempcountSlider = this.tempcountSlider - 1;
    this.marginDataSet = {
      '-ms-transform': 'translateX(-'+this.tempTrans+'px)',
    'transform': 'translateX(-'+this.tempTrans+'px)'
    };
  }
}
}






productList:any = [];


getProducts(){
    this.appService.getProducts().subscribe((data) => {
        if(data){
          this.productList = data;
          console.log(this.productList);
          this.getProductQuantity();
          this.getWishlist();
        }
        this.getBannerSlider();
    });
}

getUserDetails(){
    this.appService.getList().subscribe((data) => {
        console.log(data);
    });
}
getBannerSlider(){
        this.sliderBanner =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 1,
          caption:"Welcome to SPKFARMS"
        },
        {
          id: 2,
          caption:"Welcome to SPKFARMS"
        },
        {
          id: 3,
          caption:"Welcome to SPKFARMS"
        },
        {
          id: 4,
          caption:"Welcome to SPKFARMS"
        }
      ]
    };
}

//Move to Next slide
slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }

  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,    
    autoplay: 2000
  };

  

// convenience getter for easy access to form fields
get f() { return this.registerForm.controls; }

onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
}

onReset() {
    this.submitted = false;
    this.registerForm.reset();
}

//pdt seperate display 
gotoProductDesc(name,id){
  let product = {'id':id, 'name':name}
  this.appService.product = product;
  sessionStorage.setItem("productData",JSON.stringify(product));
  this.router.navigate(['products/product-details']);
}


// product quantity add or remove
getProductQuantity(){
  if(this.getProductCount.length > 0){ 
    this.productList.forEach(cat => {
      cat.subcategory.forEach(subcat => {
      subcat.product.forEach(product =>{
        product.quantityBool = false;
        product.quantity = 0;
          this.getProductCount.forEach(prcount => {
            if(product.productID == prcount.productId && prcount.count > 0){
              product.quantityBool = true;
              product.quantity = prcount.count;
            }
          });
    });
  });
    });
  }
}

countClick(prid,count,nos){
  this.productArr = {};
  if(nos == 0){ 
  // if(count > 1){
    count = count - 1;
  // }
}
else if(nos == 1){
  count = count + 1;
}
this.productArr = {'count':count,'productId':prid};
this.addToCartToCheckout();
}





addToCartToCheckout(){
  this.appService.changeCount(this.productArr);
   sessionStorage.setItem("getProductCount",JSON.stringify(this.getProductCount));
   this.getProductQuantity();
}


openCount(prId){
  this.productList.forEach(cat => {
    cat.subcategory.forEach(subcat => {
    subcat.product.forEach(product =>{
      if(product.productID == prId){
        product.quantityBool = true;
        this.countClick(product.productID,product.quantity,1);
      }
    });
  })
  });
}
getWishlistData:any = [];
getWishlist(){
  this.appService.getWishlist(this.userDetailsAuth.id).subscribe(data =>{
    console.log("data wishlist");
    console.log(data);
    this.getWishlistData = data;
    this.productList.forEach(cat => {
      cat.subcategory.forEach(subcat => {
      subcat.product.forEach(product =>{
        product.wishlist = false;
        this.getWishlistData.forEach(wish =>{
        if((product.productID == wish.productID) && (wish.customerID == this.userDetailsAuth.id)){
          product.wishlist = true;
          debugger;
          console.log(product);
        }
      });
      });
    });
  });
  })
}


addWishlist(id){
  if(!this.userLogin){
    console.log(id);
    swal({
      title: "Login Necessary",
      type: 'warning',
      showConfirmButton: true,
      showCancelButton: false    
    })
    .then((willDelete) => {
    });
    return;
  }
  else{
    let obj = {
      productID:id,
      customerID:this.userDetailsAuth.id
    }
    this.appService.postWishlist(obj).subscribe(data => {
      console.log(data);
      this.getWishlist();
    })

  } 
}

deleteWishlist(id){
  this.appService.deleteWishlist(id).subscribe(data => {
    console.log(data);
    this.getWishlist();
  })
}





}
