import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AppserviceService } from '../services/appservice.service'; 
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { Router, RouterModule, Routes,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    loginSignUp:number = 0;
  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;
  loginSubmitted = false;
  postData = {
    name: ''    };
    customer:any={};


  constructor(private router:Router,private cookieService:CookieService,private http:HttpClient,private formBuilder: FormBuilder,private appService:AppserviceService) {
    this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        console.log(event.url);
      });
   }


  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
  });
    
  this.loginForm = this.formBuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
  })

  }
  
     // convenience getter for easy access to form fields
     get f() { return this.registerForm.controls; }
     get l() { return this.loginForm.controls;}
     loginBoolean:boolean=false;
     loginCredentials:any = [];
     onLoginSubmit(){
        this.loginSubmitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        console.log(JSON.stringify(this.loginForm.value));
        var count=0;
         
        this.appService.getLoginDetails(this.loginForm.value).subscribe(data => {
            if(data){
                this.loginCredentials = data;
                if(this.loginCredentials.length > 0){
                    this.appService.userAuth(this.loginCredentials[0]);
                    // sessionStorage.setItem('userDetails',JSON.stringify(this.loginCredentials[0]));
                    this.cookieService.set('userDetails',JSON.stringify(this.loginCredentials[0]));
                    this.router.navigate(['/home']);
                }
                else{
                    this.loginBoolean = true;
                }
            }
        })
        // this.http.post('http://localhost:3000/checkCustomer',this.loginForm.value).subscribe(
        //     (data) => {
        //         console.log(data);
        //         if(data=='match'){
        //             this.router.navigate(['/home'])
        //         }
        //         else{
        //             this.loginBoolean=true;
        //         }
        //     })
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
     
     onSubmit() {
         this.submitted = true; 
         // stop here if form is invalid
         if (this.registerForm.invalid) {
             return;
         }
         
         // display form values on success
        //  this.customer={"name":"vxcvxcvxcv","phone":"116519115626","email":"cvx@dfs","password":"116519115626","confirmpassword":"116519115626","acceptTerms":'true'};
         console.log(JSON.stringify(this.registerForm.value));
         this.customer=JSON.stringify(this.registerForm.value);
        //  alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
        //  this.appService.createCustomer(this.customer).subscribe(data=>{
        //      console.log(data);
        //  })


         this.http.post('http://localhost:3000/addCustomer',this.registerForm.value).subscribe(
            (data: any[]) => {
                console.log(data);
            })
            this.onReset();
        }
         
 
     onReset() {
         this.submitted = false;
         this.registerForm.reset();
     }
     MustMatch(controlName: string, matchingControlName: string) {
      return (formGroup: FormGroup) => {
          const control = formGroup.controls[controlName];
          const matchingControl = formGroup.controls[matchingControlName];
  
          if (matchingControl.errors && !matchingControl.errors.mustMatch) {
              // return if another validator has already found an error on the matchingControl
              return;
          }
  
          // set error on matchingControl if validation fails
          if (control.value !== matchingControl.value) {
              matchingControl.setErrors({ mustMatch: true });
          } else {
              matchingControl.setErrors(null);
          }
      }
  }

  login(){
      this.loginSignUp = 0;
  }

  signup(){
      this.loginSignUp = 1;
  }




}
