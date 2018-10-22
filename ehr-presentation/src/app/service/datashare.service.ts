import {Component, Injectable } from '@angular/core';

// Name Service
export interface myData {
  name:string;
}


@Injectable({
  providedIn: 'root'
})
export class DatashareService {
  sharedData:string = "String from myService";
  constructor() { }

  sharingData: myData={name:"nyks"};
  saveData(str){
    console.log('save data function called' + str + this.sharingData.name);
    this.sharingData.name=str; 
  }
  getData()
  {
    console.log('get data function called');
    return this.sharingData.name;
  }

}
