import { Component, OnInit,Inject } from '@angular/core';


import { CommonService } from '../../../service/common.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { PatientService } from '../../../service/patient.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-patientadddialog',
  templateUrl: './patientadddialog.component.html',
  styleUrls: ['./patientadddialog.component.css']
})


export class PatientadddialogComponent implements OnInit {

  bloodGroupList = [];
  patientTypeList = [];
  relationsList = [];
  estateList = [];
  patientAddForm: FormGroup;
  registerButtonActive = true;
  loaderActive = false;

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  
  constructor(public dialogRef: MatDialogRef<PatientadddialogComponent> , private commonService:CommonService,private patientService:PatientService ,  @Inject(MAT_DIALOG_DATA) public data: "d") { 

    this.patientAddForm = new FormGroup({
      pcodeCtrl: new FormControl(''),
      pnameCtrl: new FormControl(''),
      dobCtrl: new FormControl(''),
      genderCtrl : new FormControl(''),
      mobileCtrl: new FormControl(''),
      alternatemblCtrl: new FormControl(''),
      aadharCtrl: new FormControl(''),
      bldgrpCtrl: new FormControl(''),
      patienttypeCtrl: new FormControl(''),
      associateCtrl: new FormControl(''),
      relationCtrl: new FormControl(''),
      linenoCtrl: new FormControl(''),
      divisionCtrl: new FormControl(''),
      challannoCtrl: new FormControl(''),
      estateCtrl: new FormControl('')
     
 });

  }

  ngOnInit() {
    this.getBloodGroup();
    this.getRelations();
    this.getEstates();
    this.getPatientType();
   
  }

  onNoClick(): void {
    let data = {
      "from":"Close"
    }
    this.dialogRef.close();
  }

  getBloodGroup(){
    let dataval;
    let bldgrouplist;
    this.commonService.getBloodGroup().then(data => {
      dataval = data;
      bldgrouplist = dataval.result;
      this.bloodGroupList.push(bldgrouplist);
    },
    error => {
     console.log("There is some error in Blood Group List...");
   });
  }

  getPatientType(){
    let dataval;
    let patienttypelist;
    this.commonService.getPatientType().then(data => {
      dataval = data;
      patienttypelist = dataval.result;
      this.patientTypeList.push(patienttypelist);
    },
    error => {
     console.log("There is some error in Estate List...");
   });
  }

  getRelations(){
    let dataval;
    let relationlist;
    this.commonService.getRelations().then(data => {
      dataval = data;
      relationlist = dataval.result;
      this.relationsList.push(relationlist);
    },
    error => {
     console.log("There is some error in Relation List...");
   });
  }

  getEstates(){
    let dataval;
    let estatelist;
    this.commonService.getEstates().then(data => {
      dataval = data;
      estatelist = dataval.result;
      this.estateList.push(estatelist);
    },
    error => {
     console.log("There is some error in Estate List...");
   });
  }


  enableAssociate(isrequred){
    if(isrequred == 1){
      this.patientAddForm.controls['associateCtrl'].enable(); 
    }
    else{
      this.patientAddForm.controls['associateCtrl'].disable(); 

      this.patientAddForm.patchValue({
        hdnPatientID: null
      });
  

    }
  }


  onSubmit(){
    this.registerButtonActive = false;
    this.loaderActive = true;

    let response;

  //  console.log(this.patientAddForm.value);
    this.patientService.addNewPatient(this.patientAddForm.value).then(data => {
      response = data;
      if(response.msg_status==200){
        let data = {
        "from" : "Save",
         "patientcode" : this.patientAddForm.get("pcodeCtrl").value,
         "patientname" : this.patientAddForm.get("pnameCtrl").value,
         "dob" : new Date(this.patientAddForm.get("dobCtrl").value).toLocaleDateString(),
         "gender" : this.patientAddForm.get("genderCtrl").value,
         "division" : this.patientAddForm.get("divisionCtrl").value,
         "challan" : this.patientAddForm.get("challannoCtrl").value,
         "line" : this.patientAddForm.get("linenoCtrl").value,
         "mobile" : this.patientAddForm.get("mobileCtrl").value,
         "aadhar" : this.patientAddForm.get("aadharCtrl").value
        }
        this.dialogRef.close(data);

      }
      else{
        this.registerButtonActive = true;
        this.loaderActive = false;
      }
     },
       error => {
         console.log("There is some error on submitting...");
     });

  }

}
