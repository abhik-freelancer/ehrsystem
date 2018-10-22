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


interface PatientCode{
  id: string,
  code: string
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
      patientAadhar: new FormControl('')
      });

      
     this.FieldsearchForm = new FormGroup({
      patientNameCtrl: new FormControl(''),
      patientDOBCtrl: new FormControl(new Date().toISOString()),
      patientMobileCtrl: new FormControl('')
      });

    this.patientTblRegForm = new FormGroup({
      regpcodeCtrl : new FormControl(''),
    });



   }
  
   private patientcode: PatientCode[] = [];
   public filteredMedicines: ReplaySubject<PatientCode[]> = new ReplaySubject<PatientCode[]>(1);
   private _onDestroy = new Subject<void>();
/*
   private _filterStates(value: string): Patient[] {
    const filterValue = value.toLowerCase();

    return this.patients.filter(patient => patient.name.toLowerCase().indexOf(filterValue) === 0);
  }
*/


ngOnInit() {
  this.getTodaysRegistration();

  this.filteredMedicines.next(this.patientcode.slice());
        this.IDsearchForm.get('filteredMedicines').valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterPatientCode();
          });

}


ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}

private filterPatientCode() {
  if (!this.patientcode) {
    return;
  }
  // get the search keyword
  let search =  this.IDsearchForm.get('pcodeFilterCtrl').value;
  if (!search) {
    this.filteredMedicines.next(this.patientcode.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filteredMedicines.next(
    this.patientcode.filter(patientcd => patientcd.code.toLowerCase().indexOf(search) > -1)
  );
}


 
  enableAdvanceSearch(event) {

    this.isCheked = !this.isCheked;

    if(this.isCheked==true){
      this.enableAdvancesearch = true;
      this.disableInputField = true;
      this.IDsearchForm.controls['patientID'].disable(); 
      this.IDsearchForm.controls['patientAadhar'].disable(); 
      /*
      this.IDsearchForm = new FormGroup({
        patientID: new FormControl({value:'',disabled: true}),
        patientAadhar: new FormControl({value:'',disabled: true})
        });
        */
    }
    else{
      this.enableAdvancesearch = false;
      /*
      this.IDsearchForm = new FormGroup({
        patientID: new FormControl({value:'',disabled: false}),
        patientAadhar: new FormControl({value:'',disabled: false})
        });
        */

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

  searchPatient() {
    this.searchLoader = true;
   // this.registerButtonActive = true;
    this.displayp = 'none';
    
   // this.loaderActive = false;
    
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
  


 


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  

}
