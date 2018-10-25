import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalconstantService } from './globalconstant.service';
import { Observable }     from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(public http: HttpClient,private global:GlobalconstantService) { }

  getTodaysRegistration(){
    return new Promise(resolve => {
        this.http.get(this.global.todaysReg_URL).subscribe(data => {
          resolve(data);
         
        }, err => {
          console.log(err);
        });
      });
    
  }

  registerPatient(pcode){
    let myData = JSON.stringify({values:pcode});
     return new Promise(resolve => {
        this.http.post(this.global.registerPatient_URL,myData).subscribe(data => {
          resolve(data);
         
        }, err => {
          console.log(err);
        });
      });
  }

  getTodaysRegForDoc(type,serve){
    let myData = JSON.stringify({type:type,serve:serve});
    return new Promise(resolve => {
        this.http.post(this.global.todaysRegDoct_URL,myData).subscribe(data => {
          resolve(data);
         
        }, err => {
          console.log(err);
        });
      });
    
  }

  sickApprove(opdid,status){
   
    let myData = JSON.stringify({opd_prescription_id:opdid,sick_leave_apprv:status});
     return new Promise(resolve => {
        this.http.post(this.global.sickApprovalUpdate_URL,myData).subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
      });
  }
  
}
