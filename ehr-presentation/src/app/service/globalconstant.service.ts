import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalconstantService {

  constructor() { }

  private APIURL = "http://192.168.2.16:8088/ehrsystem/ehrsrvc/";
  //private APIURL = "http://192.168.2.10/ehrsystem/ehrsrvc/";
 // private APIURL = "http://127.0.0.1/ehrsystem/ehrsrvc/";
  private APIKEY = "24ecdccb1258eaacfd441e012ac034392403c692";

  // URL INFO
  //public signin = this.APIURL+"login/getLogin" ;

  public signin = this.APIURL+"login/getLogin";
  public ListPatient = this.APIURL+"patient/getAllPatient";
  public patientdetail_URL = this.APIURL+"patient/getPatientDetail";
  public registerPatient_URL = this.APIURL+"patient/registerPatient";
  public searchPatient_URL = this.APIURL+"patient/searchPatient";


  getApiURL(){
    return this.APIURL;
  }
 
  getAPiKey(){
    return this.APIKEY;
  }

  public getToken(): string {
    return localStorage.getItem("token");
  }

}