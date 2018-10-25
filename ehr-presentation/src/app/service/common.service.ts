import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalconstantService } from './globalconstant.service';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(public http: HttpClient,private global:GlobalconstantService) {}

  getBloodGroup() {
    return new Promise(resolve => {
       this.http.get(this.global.bloodgrpList_URL).subscribe(data => {
         resolve(data);
       }, err => {
         console.log(err);
       });
    });
  }

  getPatientType() {
    return new Promise(resolve => {
       this.http.get(this.global.patienttypeList_URL).subscribe(data => {
         resolve(data);
       }, err => {
         console.log(err);
       });
    });
  }

  getRelations() {
    return new Promise(resolve => {
       this.http.get(this.global.relationList_URL).subscribe(data => {
         resolve(data);
       }, err => {
         console.log(err);
       });
    });
  }

  getEstates() {
    return new Promise(resolve => {
       this.http.get(this.global.estateList_URL).subscribe(data => {
         resolve(data);
       }, err => {
         console.log(err);
       });
    });
  }
  
  getHospitals(){
    return new Promise(resolve => {
      this.http.get(this.global.hospitalList_URL).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
   });
  }


}
