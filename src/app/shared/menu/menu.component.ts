import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppserviceService } from 'src/app/services/appservice.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  loginCred:string = "";
  public selectedIndex = 0;
  public appPages = [
    {
      title: "Home",
      url: "/home",
      id:""
    }
    
  ];
  isItemAvailable = false;
  items = [];
  tempCountSet:any = [];
  constructor(private router:Router,private cookieService:CookieService,private appService:AppserviceService) { 
    this.getUserAuth();
    let temp = JSON.parse(sessionStorage.getItem("getProductCount"));
    if(temp){
      this.tempCountSet = temp;
    }
    console.log(this.tempCountSet);
  }
  menuItem:any = [];
  getProductCount:any = [];
  count:number = 0;
  tempcount:any = [];
  userDetailsAuth:any = {};
  subCategory:any = [];
  profileDropdown:boolean = false;
  adminDropdown:boolean = false;
  ngOnInit() {
    this.appService.userAdd.subscribe(data => {
      console.log(data);
      if(data.role=='admin'){
        this.adminDropdown=true;
        console.log(data.role);
      }
      if(data && Object.keys(data).length > 0){ 
      this.userDetailsAuth = data;
      this.loginCred = this.userDetailsAuth.name;
      console.log(this.loginCred);
      }
    });
    this.getProducts();
    this.getCategory();
    this.getSubcategory();
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
      this.getProductCountDetails();
      this.getCart();
  }
  closeDropdown(){
    this.profileDropdown = false;
  }

  toggleLoginMenu() {
    this.profileDropdown = !this.profileDropdown;
  }

  toggleDropdownCheckout(){
    this.showDropdown = !this.showDropdown;
  }

getUserAuth(){
  // let obj = JSON.parse(sessionStorage.getItem('userDetails'));
  let obj = JSON.parse(this.cookieService.get('userDetails'));
  console.log(this.cookieService.get('userDetails'))
  if(obj){ 
  this.userDetailsAuth = obj;
  console.log(this.userDetailsAuth);
  if(this.userDetailsAuth.role=='admin'){
    this.adminDropdown=true;
    console.log(this.userDetailsAuth.role);
  }
  if(Object.keys(this.userDetailsAuth).length > 0){
    this.loginCred = this.userDetailsAuth.name;
  }
  
}
}





logout(){
  this.profileDropdown = false;
  this.adminDropdown=false;
  this.loginCred = "";
  sessionStorage.removeItem('userDetails');
  this.appService.userAuth([]);
  this.router.navigate(['/login']);
}
profileEdit(){
  console.log(this.userDetailsAuth)
this.profileDropdown = !this.profileDropdown;
}

  //get cart details
getCart(){
  this.appService.getCart().subscribe(data => {
    console.log(data);
  });
}

  getProductCountDetails(){
    if(this.getProductCount.length > 0){ 
      console.log(this.getProductCount);
    }
    else{
      let datacount = this.tempCountSet;
      if(datacount){ 
      this.getProductCount = datacount;
      this.count = this.getProductCount.map(a => a.count).reduce(function(a, b)
        {
          return a + b;
        });
      }
    }
    let tempCountPrice = []
    this.productList.forEach(element => {
      this.getProductCount.forEach(count => {
        if(element.productID == count.productId)  
        {
          element.quantity = count.count;
          element.productTotalRate = element.productRate * element.quantity;
          tempCountPrice.push(element)
        }
      });
    });

    this.totalPrice = tempCountPrice.map(a => a.productTotalRate).reduce(function(a, b)
        {
          return a + b;
        });
        console.log(this.totalPrice);

  }

  getCategory(){
    this.appService.getCategoryList().subscribe(data =>{
      this.menuItem = data;
      this.menuItem.forEach(item => {
        this.appPages.push({
          title: item.catName,
          url: "/products",
          id:item.catID
        })
      });
      console.log('menu list', this.appPages);
    })
  }

  getSubcategory(){
    this.appService.getSubCategory().subscribe(data => {
      if(data){
        this.subCategory = data;
      }
    })
  }

  gotoSubcat(){
    
  }


  getMenu(i,id,name,url){
    this.selectedIndex = i;
   
    let menu = {'id':id,'name':name}
    console.log(menu);
    sessionStorage.setItem("productMenu",JSON.stringify(menu));
    this.appService.changeMenu(menu);
    if(name != 'Home'){ 
    this.router.navigate(['/'+url], { queryParams: { name: name}});
    // this.router.navigate(['products/product-details'], { queryParams: { name: name}});
    }
    else if(name == 'Home'){ 
      this.router.navigate(['/'+url], { queryParams: {}});
      // this.router.navigate(['products/product-details'], { queryParams: { name: name}});
      }
  }
  productList:any = [];
  getProducts(){
    this.appService.getProductList().subscribe((data) => {
        if(data){
          this.productList = data;
        }
    });
}


     initializeItems(){
         this.items = this.productList;
     }

     getItems(ev: any) {
         // Reset items back to all of the items
         this.initializeItems();

         // set val to the value of the searchbar
         const val = ev.target.value;

         // if the value is an empty string don't filter the items
         if (val && val.trim() !== '') {
             this.isItemAvailable = true;
             this.items = this.items.filter((item) => {
                 return (item.productName.toLowerCase().indexOf(val.toLowerCase()) > -1);
             })
         } else {
             this.isItemAvailable = false;
         }
     }

  loginCredFun(){
    this.profileDropdown = false;
    this.router.navigate(['/login']);
  }
  showDropdown:boolean = false;
  showDataCart:any = [];
  totalPrice:number = 0;
  addtoCart(){
    this.showDataCart = [];
    this.showDropdown = !this.showDropdown;
    this.productList.forEach(element => {
      this.getProductCount.forEach(count => {
        if(element.productID == count.productId)  
        {
          element.quantity = count.count;
          element.productTotalRate = element.productRate * element.quantity;
          this.showDataCart.push(element);
        }
      });
    });
    this.totalPrice = this.showDataCart.map(a => a.productTotalRate).reduce(function(a, b)
        {
          return a + b;
        });
    console.log(this.showDataCart);
  }

  gotoProduct(pr){
    let product = {'id':pr.productID, 'name':pr.productName}
    this.appService.product = product;
    this.isItemAvailable = false;
    sessionStorage.setItem("productData",JSON.stringify(product));
    this.router.navigate(['products/product-details']);
  }

  tempcountCart:any = [];
  countClick(cart,nos){
    if(nos == 0){ 
    if(cart.quantity > 1){
      cart.quantity = cart.quantity - 1;
    }
    else if(cart.quantity == 1){
      this.showDataCart.forEach((count,index) => {
        if(count.productID == cart.productID)  
        {
          this.showDataCart.splice(index,1);
          cart.quantity = 0;
        }
      });
    }
  }
  else if(nos == 1){
    cart.quantity = cart.quantity + 1;
  }
  
  let product = {'count':cart.quantity,'productId':cart.productID}
  this.appService.changeCount(product);
  if(this.getProductCount.length > 0){
    this.tempcountCart = this.getProductCount.filter(data => {return data.productId == product.productId});
    console.log(this.tempcountCart);
    if(this.tempcountCart.length == 0){
      this.getProductCount.push(product);
    }
    else if(this.tempcountCart.length > 0){
      this.getProductCount.forEach((element,index) => {
        if(element.productId == this.tempcountCart[0].productId){
          if(product.count == 0)
          {
            this.getProductCount.splice(index, 1);
          }
          else{
            element.count = product.count;
          }
          
        }
      });
    }
   }
   else if(this.getProductCount.length == 0){
     this.getProductCount.push(product);
   }
   this.tempcountCart = [];
  sessionStorage.setItem("getProductCount",JSON.stringify(this.getProductCount));
  setTimeout(() =>{
    this.getProductCountDetails();
  },500);
}

gotoCheckout(){
  this.showDropdown = false;
  this.router.navigate(['products/checkout']); 
}

gotoProductPage(){
  this.showDropdown = false;
  this.router.navigate(['products']); 
}


  

}
