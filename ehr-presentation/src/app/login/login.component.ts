import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  loginButtonActive:boolean = true;
  loaderActive:boolean = false;
  invalidErr:boolean = false;
  invalidErrMsg:string = "";

  constructor(private authService:AuthService,private router:Router) {

    this.loginForm = new FormGroup({
      username: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
     
    });

   }

  ngOnInit() {
  }



  onSubmit(formVal) {
    

    if(this.isLoginFormValid(formVal)){
    this.loginButtonActive = false;
    this.loaderActive = true;
    let response;
    this.authService.signInVerification(formVal).then(data => {
     
    response = data;
    if(response.msg_status==100){
      this.router.navigate(['/dashboard']);
     }
     else{
      this.invalidErr = true;
      this.invalidErrMsg = response.msg_data;
      this.loginButtonActive = true;
      this.loaderActive = false;

     }
    },
       error => {
        console.log("Error from login attempt");
     });
    }




  }

  isLoginFormValid(formVal){
    let isFormValidate:boolean = true;
    if(formVal.username=="" || formVal.username == null){
      isFormValidate = false;
    }
    if(formVal.password=="" || formVal.password == null){
      isFormValidate = false;
    }
    return isFormValidate;
  }


}
