import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;

  constructor(private authService:AuthService) {

    this.loginForm = new FormGroup({
      employeeid: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required)
     
    });

   }

  ngOnInit() {
  }



  onSubmit(formVal) {
    console.log("Form Submit");
    console.log(formVal.employeeid);
    console.log(formVal.password);


 
    let response;
    this.authService.signInVerification(formVal).then(data => {
      response = data;
      console.log(data);
    },
       error => {
         console.log("There is some error on login...");
     });


  }


}
