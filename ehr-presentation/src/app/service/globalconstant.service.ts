import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalconstantService {

  constructor() { }

  private APIURL = "http://192.168.2.17:8088/ehrsystem/ehrsrvc/";
  //private APIURL = "http://192.168.2.10/ehrsystem/ehrsrvc/";
  private APIKEY = "24ecdccb1258eaacfd441e012ac034392403c692";

  // URL INFO
  //public signin = this.APIURL+"login/getLogin" ;

  public signin = this.APIURL+"login/getLogin";



  getApiURL(){
    return this.APIURL;
  }
 
  getAPiKey(){
    return this.APIKEY;
  }

  getToken(){
    return "acccc";
  }

}
