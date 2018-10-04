import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalconstantService } from './globalconstant.service';
import { Observable }     from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


export class PatientsCls {
  public patient_name: string;
  public patient_code: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(public http: HttpClient,private global:GlobalconstantService) {

   }
   GetPatientListAll(){
    return this.http.get(this.global.ListPatient);
    }


    getPatientList(){
  
    
       return new Promise(resolve => {
          this.http.get(this.global.ListPatient).subscribe(data => {
            resolve(data);
           
          }, err => {
            console.log(err);
          });
        });
    }

    getPatientLists(hospitalid){
      let myData = JSON.stringify({hospital_id: hospitalid});
       return new Promise(resolve => {
          this.http.post(this.global.ListPatient,myData).subscribe(data => {
            resolve(data);
           
          }, err => {
            console.log(err);
          });
        });
      
    }

    getPatientDetailById(patientid){
      let hospitalid = 1; // will come from global file // need to change
      let myData = JSON.stringify({hospital_id: hospitalid,patient_id:patientid});
       return new Promise(resolve => {
          this.http.post(this.global.patientdetail_URL,myData).subscribe(data => {
            resolve(data);
           
          }, err => {
            console.log(err);
          });
        });
      
    }


    registerPatient(formValue){
      let hospitalid = 1; // will come from global file // need to change
      let myData = JSON.stringify({hospital_id: hospitalid,values:formValue});
       return new Promise(resolve => {
          this.http.post(this.global.registerPatient_URL,myData).subscribe(data => {
            resolve(data);
           
          }, err => {
            console.log(err);
          });
        });
    }

   
}
