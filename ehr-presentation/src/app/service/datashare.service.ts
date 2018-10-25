import {Component, Injectable } from '@angular/core';

// Name Service
export interface myData {
  name : string;
  regid : string;
}


@Injectable({
  providedIn: 'root'
})
export class DatashareService {
  sharedData:string = "String from myService";
  constructor() { }

  sharingData: myData= {
     name:"",
     regid:""
    };
  saveData(str){
    this.sharingData.name=str; 

  }
  getData()
  {
    console.log('get data function called');
    return this.sharingData.name;
  }

}
