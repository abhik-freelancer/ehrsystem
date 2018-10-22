import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalconstantService } from './globalconstant.service';

@Injectable({
  providedIn: 'root'
})
export class SymptomdiseaseService {

  constructor(public http: HttpClient,private global:GlobalconstantService) {}

  getSymptoms() {
    return new Promise(resolve => {
       this.http.get(this.global.symptomlist_URL).subscribe(data => {
         resolve(data);
       }, err => {
         console.log(err);
       });
    });
  }

  getDiseasesBySymptom(symptoms){
    let datas = JSON.stringify({symptom:symptoms});
    return new Promise(resolve => {
      this.http.post(this.global.diseaselist_URL,datas).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
   });
  }

  getMedicineByDisease(medicine){
    let datas = JSON.stringify({medicine:medicine});
    return new Promise(resolve => {
      this.http.post(this.global.medicinelist_URL,datas).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
   });
  }

}
