import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalconstantService {

  constructor() { }

  private APIURL = "http://192.168.2.16:8088/ehrsystem/ehrsrvc/";
  //private APIURL = "http://192.168.2.10/ehrsystem/ehrsrvc/";
  //private APIURL = "http://127.0.0.1:8011/ehrsystem/ehrsrvc/";
  //private APIURL = "http://127.0.0.1/ehrsystem/ehrsrvc/";
  private APIKEY = "24ecdccb1258eaacfd441e012ac034392403c692";

  // URL INFO
  //public signin = this.APIURL+"login/getLogin" ;

  public signin = this.APIURL+"login/getLogin";

  //Patient
  public ListPatient = this.APIURL+"patient/getAllPatient";
  public patientdetail_URL = this.APIURL+"patient/getPatientDetail";
  public registerPatient_URL = this.APIURL+"registration/registerPatient";
  public addnewPatient_URL = this.APIURL+"patient/addNewPatient";
  public searchPatient_URL = this.APIURL+"patient/searchPatient";
  public patientBycode_URL = this.APIURL+"patient/getPatientByCode";

  public todaysReg_URL = this.APIURL+"registration/getTodaysRegistration";
  public isregisterdToday_URL = this.APIURL+"registration/isRegisteredToday";
 

  // Blood Group
  public bloodgrpList_URL = this.APIURL+"master/getBloodGroup";
  public patienttypeList_URL = this.APIURL+"master/getPatientType";

  // Relations
  public relationList_URL = this.APIURL+"master/getRelations";
  public hospitalList_URL = this.APIURL+"master/getHospitals";
  public estateList_URL = this.APIURL+"estate/getEstate";

  public investigationlist_URL = this.APIURL+"master/getInvestigations";
  public symptomlist_URL = this.APIURL+"symptoms/getSymptoms";
  public diseaselist_URL = this.APIURL+"disease/getDiseaseBySymptoms";
  public medicinelist_URL = this.APIURL+"medicine/getMedicineBySymptoms";
  public dosageByMedlist_URL = this.APIURL+"medicine/getDosageByMedicine";
  public frequencyByMedlist_URL = this.APIURL+"medicine/getFrequencyByMedicine";

  public insertOPD_URL = this.APIURL+"opd/insertIntoOpd";

  public todaysRegDoct_URL = this.APIURL+"registration/getTodaysRegDoct";

  //sick leave approval
  public sickApprovalList_URL = this.APIURL +"patient/getSickApprovedList";
  public sickApprovalUpdate_URL = this.APIURL +"patient/updateSickLeaveApprovalStatus";
  public sickApprovalCount_URL = this.APIURL+"patient/getSickLeaveApproveCount";

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