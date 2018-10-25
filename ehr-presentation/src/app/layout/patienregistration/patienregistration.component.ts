import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild , ViewEncapsulation , Inject , NgZone } from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { PatientService } from '../../service/patient.service';
import { GlobalconstantService } from '../../service/globalconstant.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatDialogConfig} from '@angular/material';
import { TodayspatientreglistComponent } from './../components/todayspatientreglist/todayspatientreglist.component';
import { RegistrationService } from '../../service/registration.service';
import { PatientadddialogComponent } from '../components/patientadddialog/patientadddialog.component';
import * as jwt_decode from "jwt-decode";
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { MatSelect, VERSION } from '@angular/material';
import { isObject } from 'rxjs/internal/util/isObject';



interface PatientCode{
  id: string,
  code: string
}

interface PatientAadhar{
  id: string,
  aadhar: string ,
  name: string
}

@Component({
  selector: 'app-patienregistration',
  templateUrl: './patienregistration.component.html',
  styleUrls: ['./patienregistration.component.css']
})

export class PatienregistrationComponent implements OnInit ,OnDestroy {
  version = VERSION;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // error Initialization
  isRegAlreadyDone_Err:boolean = false;
  validation_Err:boolean = false;
  isRegAlreadyDone = false;
  basicSearchValidErr = false;
  advSearchValidErr = false;


  patientRegForm: FormGroup;
  IDsearchForm: FormGroup;
  FieldsearchForm: FormGroup;
  patientTblRegForm: FormGroup;
  //registerButtonActive:boolean = true;
  loaderActive:boolean = false;
  searchLoader:boolean = false;
  registerBtnEnable:boolean = true;

  
  isCheked = false;
  enableAdvancesearch = false;
  disableInputField = false;
  enableregister = false;
  displayp = 'none';

  resetSelect = "";
  resetSelect2 = "";

  private  patientlst:  Array<object> = [];
  displayedColSecond: string[] = [];
  dataSource: MatTableDataSource<any>;

  todaysRegTblColumn: string[] = [
    'action',
    'patient_code',
    'patient_name',
    'birthdate',
    'gender', 
    'division_number' ,
    'challan_number' ,
    'line_number' ,
    'mobile_one',
    'adhar'
  ];





  // patient detail info initilization

  patientName:string = "";
  patientGender:string = "";
  patientDOB:Date;
  patientBloodGrp:string = "";
  patientType:string = "";
  patientRelation:string = "";
  patientLineNo:string = "";
  patientDivisionNo:string = "";
  patientChallanNo:string = "";
  patientEstate:string = "";
  
  tblPatientID:string = "";
  tblPatientName:string = "";
  tblPatientDOB;
  tblPatientGender:string = "";
  tblPatientDivision:string = "";
  tblPatientChallan:string = "";
  tblPatientLine:string = "";
  tblPatientMbl:string = "";
  tblPatientAadhar:string = "";

  date = new Date();
  serializedDate = new FormControl((new Date()).toISOString());
  patientCtrl = new FormControl();
  listofPatient = [];
  todaysregistrationList = [];
  patientLst: string[];
  selected = null;
  @ViewChild('singleSelect') singleSelect: MatSelect; 
  
  

  constructor(private zone:NgZone,private patientService:PatientService,private _global:GlobalconstantService,public dialog: MatDialog,private registerService: RegistrationService ) {
   
     this.patientRegForm = new FormGroup({
          searchpatientCtrl: new FormControl(''),
          hdnPatientID: new FormControl(''),
          regdate: new FormControl(''),
          patienname : new FormControl(''),
          patientmobileno: new FormControl(''),
          patientid: new FormControl(''),
          patientName: new FormControl(''),
          patientGender: new FormControl(''),
          patientDOB: new FormControl(''),
          patientBloodGrp: new FormControl(''),
          patientType: new FormControl(''),
          patientRelation: new FormControl(''),
          patientLineNo: new FormControl(''),
          patientDivisionNo: new FormControl(''),
          patientChallanNo: new FormControl(''),
          patientEstate: new FormControl('')
     });


     this.IDsearchForm = new FormGroup({
      patientID: new FormControl(''),
      pcodeFilterCtrl: new FormControl(''),
      patientAadhar: new FormControl(''),
      aadharFilterCtrl: new FormControl('')
      });

      
     this.FieldsearchForm = new FormGroup({
      patientNameCtrl: new FormControl(''),
      patientDOBCtrl: new FormControl(new Date()),
      patientMobileCtrl: new FormControl(''),
      patientNameFilterCtrl: new FormControl('')
      });

    this.patientTblRegForm = new FormGroup({
      regpcodeCtrl : new FormControl(''),
    });



   }
  
   private patientcodes: PatientCode[] = [];
   public filteredPatientCode: ReplaySubject<PatientCode[]> = new ReplaySubject<PatientCode[]>(1);


   private aadharnumbers: PatientAadhar[] = [];
   public filteredPatientAadhar: ReplaySubject<PatientAadhar[]> = new ReplaySubject<PatientAadhar[]>(1);

   public filteredPatientName: ReplaySubject<PatientAadhar[]> = new ReplaySubject<PatientAadhar[]>(1);

   private _onDestroy = new Subject<void>();
/*
   private _filterStates(value: string): Patient[] {
    const filterValue = value.toLowerCase();

    return this.patients.filter(patient => patient.name.toLowerCase().indexOf(filterValue) === 0);
  }
*/

ngOnInit() {
  this.getTodaysRegistration();
  this.getPatientCode();

  /*
  this.IDsearchForm.get('patientAadhar').valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.IDsearchForm.patchValue({
      patientID: this.resetSelect
    });

  });
  */

  this.IDsearchForm.get('patientID').valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.IDsearchForm.patchValue({
      patientAadhar: this.resetSelect
    });

  });

}


ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}



 
  enableAdvanceSearch(event) {

    this.isCheked = !this.isCheked;

    if(this.isCheked==true){
      this.enableAdvancesearch = true;
      this.disableInputField = true;
      this.IDsearchForm.controls['patientID'].disable(); 
      this.IDsearchForm.controls['patientAadhar'].disable(); 
     
        this.IDsearchForm.patchValue({
          patientID: this.resetSelect,
          patientAadhar: this.resetSelect
        });
      
    }
    else{
      this.enableAdvancesearch = false;
     
       this.IDsearchForm.controls['patientID'].enable(); 
       this.IDsearchForm.controls['patientAadhar'].enable(); 
    }

  

}








  getPatientDetail(patient){
    this.patientRegForm.patchValue({
      hdnPatientID: patient.patient_id,
      patientName: patient.patient_name,
      patientGender: patient.gender,
     // patientDOB: new FormControl(''),
      patientBloodGrp: patient.blood_group,
      patientType: patient.patient_type,
     // patientRelation: new FormControl(''),
      patientLineNo: patient.line_number,
      patientDivisionNo: patient.division_number,
      patientChallanNo: patient.challan_number,
      patientEstate: patient.Estate
    });

  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }


  getTodaysRegistration() {
    let dataval;
    let regdata;
    this.registerService.getTodaysRegistration().then(data => {
      dataval = data;
      regdata = dataval.todaysreg_data;
      this.todaysregistrationList.push(regdata);
      this.todaysRegTblColumn = [
                          'action',
                          'patient_code',
                          'patient_name',
                          'birthdate',
                          'gender', 
                          'division_number' ,
                          'challan_number' ,
                          'line_number' ,
                          'mobile_one',
                          'adhar'
                          ];
      this.dataSource = new MatTableDataSource(this.todaysregistrationList[0]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
    error => {
     console.log("error in todays registration list");
   });
  }

/*
  onSubmit(){

    this.registerButtonActive = false;
    this.loaderActive = true;

    let response;
    console.log(this.patientRegForm.value);
    this.patientService.registerPatient(this.patientRegForm.value).then(data => {
      response = data;
      if(response.msg_status==200){
        
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
*/


searchPatient(){
  let response;
  let isExist = false;

  let searchData;
  let searchType;
  if ( this.enableAdvancesearch ) {
    this.validateAdvanceSearch();
     searchData = this.FieldsearchForm.value;
     searchType = 'ADV';
  } else {

    this.validateBasicSearch();
    searchData = this.IDsearchForm.value;
    searchType = 'BASIC';
    
  }
  this.patientService.checkIsRegisteredToday(searchData,searchType).then(data => {
    response = data;
    isExist = response.isexist ;

    if(!isExist){
    this.isRegAlreadyDone_Err = false;
    this.searchLoader = true;
    this.displayp = 'none';

    let response;
    let pdata;
   
    this.patientService.searchPatient(searchData, searchType).then(data => {
      
      response = data;
      this.searchLoader = false;
      if (response.msg_status === 200 && response.patient!="") {
         
         //this.registerButtonActive = true;
         //this.enableregister = true;
         this.displayp = 'table-row';
 
         this.displayedColSecond = [
           'reg-action' ,
           'reg-patientid' ,
           'reg-patientname' ,
           'reg-patientdob' ,
           'reg-patientgender' ,
           'reg-patientdivision' ,
           'reg-patientchallan' ,
           'reg-patientline' ,
           'reg-patientmobile' ,
           'reg-patientaadhar' 
           ];
 
           this.tblPatientID = null;
           this.tblPatientName = null;
           this.tblPatientDOB = null;
           this.tblPatientGender = null;
           this.tblPatientDivision = null;
           this.tblPatientChallan = null;
           this.tblPatientLine = null;
           this.tblPatientMbl = null;
           this.tblPatientAadhar = null;

           this.zone.run(() => { // <== added
           pdata = response.patient;
 
          this.tblPatientID = pdata.patient_code;
          this.tblPatientName = pdata.patient_name;
          this.tblPatientDOB = pdata.pdob;
          this.tblPatientGender = pdata.gender;
          this.tblPatientDivision = pdata.division_number;
          this.tblPatientChallan = pdata.challan_number;
          this.tblPatientLine = pdata.line_number;
          this.tblPatientMbl = pdata.mobile_one;
          this.tblPatientAadhar = pdata.adhar;
 
     
          this.patientTblRegForm.patchValue({
            regpcodeCtrl: pdata.patient_code
          });

          this.enableregister = true;
       });
        
       } 
       else {}
      },
        error => {
          console.log('There is some error on submitting...');
      });
    }
    else{
      this.displayp = 'none';
      this.isRegAlreadyDone_Err = true;
    }

   },
    error => {
     console.log('There is some error on submitting...');
    });
   
  
 
 }


 validateBasicSearch(){
  this.basicSearchValidErr = false;
  this.advSearchValidErr = false;
  if(!this.IDsearchForm.get("patientID").value && !this.IDsearchForm.get("patientAadhar").value){

    this.basicSearchValidErr = true;
    return false;
  }
  return true;

 }

 validateAdvanceSearch(){
  this.basicSearchValidErr = false;
  this.advSearchValidErr = false;
  if(!this.FieldsearchForm.get("patientNameCtrl").value || !this.FieldsearchForm.get("patientDOBCtrl").value || !this.FieldsearchForm.get("patientMobileCtrl").value){

    this.advSearchValidErr = true;
    return false;
  }
  return true;

 }

 /*
  searchPatient() {

    this.searchLoader = true;
   // this.registerButtonActive = true;
    this.displayp = 'none';

   
    
   // this.loaderActive = false;
    console.log(this.IDsearchForm.value);

    let searchData;
    let searchType;
    if ( this.enableAdvancesearch ) {
       searchData = this.FieldsearchForm.value;
       searchType = 'ADV';
    } else {
      console.log(this.IDsearchForm.value);
      searchData = this.IDsearchForm.value;
      searchType = 'BASIC';
    }

    console.log("Exist " + this.isRegAlreadyDone);

    let response;
    let pdata;
  
    this.patientService.searchPatient(searchData, searchType).then(data => {
      response = data;
      this.searchLoader = false;
      
      if (response.msg_status === 200 && pdata!="") {
        
        //this.registerButtonActive = true;
        //this.enableregister = true;
        this.displayp = 'table-row';

        this.displayedColSecond = [
          'reg-action' ,
          'reg-patientid' ,
          'reg-patientname' ,
          'reg-patientdob' ,
          'reg-patientgender' ,
          'reg-patientdivision' ,
          'reg-patientchallan' ,
          'reg-patientline' ,
          'reg-patientmobile' ,
          'reg-patientaadhar' 
          ];

          this.tblPatientID = null;
          this.tblPatientName = null;
          this.tblPatientDOB = null;
          this.tblPatientGender = null;
          this.tblPatientDivision = null;
          this.tblPatientChallan = null;
          this.tblPatientLine = null;
          this.tblPatientMbl = null;
          this.tblPatientAadhar = null;
        this.zone.run(() => { // <== added
          pdata = response.patient;

        this.tblPatientID = pdata.patient_code;
        this.tblPatientName = pdata.patient_name;
        this.tblPatientDOB = pdata.birthdate;
        this.tblPatientGender = pdata.gender;
        this.tblPatientDivision = pdata.division_number;
        this.tblPatientChallan = pdata.challan_number;
        this.tblPatientLine = pdata.line_number;
        this.tblPatientMbl = pdata.mobile_one;
        this.tblPatientAadhar = pdata.adhar;

        console.log("PID1 "+this.tblPatientID);
        console.log("PID2 "+this.tblPatientName);
        console.log("PID3 "+this.tblPatientDOB);
        console.log("PID4 "+this.tblPatientGender);
        console.log("PID5 "+this.tblPatientDivision);
        console.log("PID6 "+this.tblPatientChallan);
        console.log("PID7 "+this.tblPatientLine);
        console.log("PID8 "+this.tblPatientMbl);
        console.log("PID9 "+this.tblPatientAadhar);

        this.patientTblRegForm.patchValue({
          regpcodeCtrl: pdata.patient_code
         
        });
        
        this.enableregister = true;
      });
       
      } else {
      //  this.enableregister = false;
      //  this.registerButtonActive = true;
       // this.loaderActive = false;
      }
     },
       error => {
         console.log('There is some error on submitting...');
     });
  }
*/

  




  registerPtc() {
    //this.registerButtonActive = false;
    //this.loaderActive = true;
    this.registerBtnEnable = false;

    const pcode = this.patientTblRegForm.get("regpcodeCtrl").value;
    let response;
    this.registerService.registerPatient(pcode).then(data => {
      response = data;
      this.registerBtnEnable = true;
      if(response.msg_status==200) {
       // location.reload();
        //this.getTodaysRegistration();
        this.todaysregistrationList = [];
        this.getTodaysRegistration();

        //this.registerButtonActive = true;
       // this.loaderActive = false;
        this.enableregister = false;
        
      
        this.tblPatientID = null;
        this.tblPatientName = null;
        this.tblPatientDOB = null;
        this.tblPatientGender = null;
        this.tblPatientDivision = null;
        this.tblPatientChallan = null;
        this.tblPatientLine = null;
        this.tblPatientMbl = null;
        this.tblPatientAadhar = null;
        this.displayp = 'none';

        

      }
      else{
      //  this.registerButtonActive = true;
        this.loaderActive = false;
      }
     },
       error => {
         console.log("There is some error on submitting...");
     });
    
  }


  openDialog() {
    const dialogRef = this.dialog.open(PatientadddialogComponent, {
      width: '900px',
      data: ''
    });
  
    dialogRef.afterClosed().subscribe(result => {
    
      if(result.from=="Save"){
        this.displayedColSecond = [
          'reg-action' ,
          'reg-patientid' ,
          'reg-patientname' ,
          'reg-patientdob' ,
          'reg-patientgender' ,
          'reg-patientdivision' ,
          'reg-patientchallan' ,
          'reg-patientline' ,
          'reg-patientmobile' ,
          'reg-patientaadhar' 
          ];
      this.enableregister = true;
      this.displayp = 'table-row';
  
    
       
        this.tblPatientID = result.patientcode;
        this.tblPatientName = result.patientname;
        this.tblPatientDOB = result.dob;
        this.tblPatientGender = result.gender;
        this.tblPatientDivision = result.division;
        this.tblPatientChallan = result.challan;
        this.tblPatientLine = result.line;
        this.tblPatientMbl = result.mobile;
        this.tblPatientAadhar = result.aadhar;
  
  
        this.patientTblRegForm.patchValue({
          regpcodeCtrl: result.patientcode
        });
      }

    });
  }
  



  getPatientCode(){
    let dataval;
    let patientlist;
    this.patientService.getPatientList().then(data => {
      dataval = data;
      patientlist = dataval.patient;
      var count = Object.keys(dataval.patient).length;
               let resultObj;
               let aadharObj;
               for(let i = 0; i<count; i++){
                resultObj = {
                    'code':dataval.patient[i].patient_code,
                    'id': dataval.patient[i].patient_id
                }

                

                aadharObj = {
                  'aadhar':dataval.patient[i].adhar,
                  'id': dataval.patient[i].patient_id,
                  'name': dataval.patient[i].patient_name
                }
                this.patientcodes.push(resultObj);
                this.aadharnumbers.push(aadharObj);
            }
           
          this.filteredPatientCode.next(this.patientcodes.slice());
          this.filteredPatientAadhar.next(this.aadharnumbers.slice());
          this.filteredPatientName.next(this.aadharnumbers.slice());

          this.IDsearchForm.get('pcodeFilterCtrl').valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterPatientCode();
          });

          this.IDsearchForm.get('aadharFilterCtrl').valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
             this.filterPatientAadhar();
          });

        

          this.FieldsearchForm.get('patientNameFilterCtrl').valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterPatientName();
          });
             
    },
    error => {
     console.log("There is some error in Relation List...");
   });
  }

  private filterPatientCode() {
    if (!this.patientcodes) {
      return;
    }
    // get the search keyword
    let search =  this.IDsearchForm.get('pcodeFilterCtrl').value;
    if (!search) {
      this.filteredPatientCode.next(this.patientcodes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredPatientCode.next(
      this.patientcodes.filter(patientcd => patientcd.code.toLowerCase().indexOf(search) > -1)
    );
  }
  
  private filterPatientAadhar() {
    if (!this.aadharnumbers) {
      return;
    }
    // get the search keyword
    let search =  this.IDsearchForm.get('aadharFilterCtrl').value;
    if (!search) {
      this.filteredPatientAadhar.next(this.aadharnumbers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredPatientAadhar.next(
      this.aadharnumbers.filter(aadharmno => aadharmno.aadhar.toLowerCase().indexOf(search) > -1)
    );
  }
  
  private filterPatientName() {
    if (!this.aadharnumbers) {
      return;
    }
    // get the search keyword
    let search =  this.FieldsearchForm.get('patientNameFilterCtrl').value;
    if (!search) {
      this.filteredPatientName.next(this.aadharnumbers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredPatientName.next(
      this.aadharnumbers.filter(aadharmno => aadharmno.name.toLowerCase().indexOf(search) > -1)
    );
  }

  removeError(){
    this.isRegAlreadyDone_Err = false;
    this.validation_Err = false;
    this.basicSearchValidErr = false;
    this.advSearchValidErr = false;
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  

}
