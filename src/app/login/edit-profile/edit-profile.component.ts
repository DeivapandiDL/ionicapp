import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AppserviceService } from '../../services/appservice.service'; 
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError,BehaviorSubject } from 'rxjs';
import { Router, RouterModule, Routes,NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  loginSignUp:number = 0;
  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;
  loginSubmitted = false;
  userDetailsAuth:any=[];
  constructor(
    private router:Router,private http:HttpClient,
  private formBuilder: FormBuilder,private appService:AppserviceService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
  });
  this.getUserAuth();
  }

  getUserAuth(){
    this.userDetailsAuth = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(this.userDetailsAuth);
  
  }
  get f() { return this.registerForm.controls; }
  onSubmit() {
    this.submitted = true; 
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    let cust = JSON.stringify(this.registerForm.value);
    this.appService.updateCustomer(this.userDetailsAuth).subscribe(
       (data) => {
           console.log(data);
       })
   }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
}



}
