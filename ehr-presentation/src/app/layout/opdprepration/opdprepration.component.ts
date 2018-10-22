import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild , ViewEncapsulation } from '@angular/core';

import { ReplaySubject } from 'rxjs';
import { MatSelect, VERSION } from '@angular/material';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CommonService } from './../../service/common.service';
import { SymptomdiseaseService } from './../../service/symptomdisease.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DatashareService } from './../../service/datashare.service';
import { PatientService } from './../../service/patient.service';
import { Router } from '@angular/router';







  export interface Transaction {
    item: string;
    cost: number;
  }

  export interface PeriodicElement {
    name: string;
    position: any;
    weight: any;
    symbol: string;
  }


  interface Symptoms{
    id: string,
    name: string
  }

  interface Diagnosis{
    id: string,
    name: string
  }

  interface Medicine{
    id: string,
    name: string
  }

  interface Relation{
    id: string;
    name: string;
  }

  interface Instruction{
    id: string;
    name: string;
  }

  interface Reports{
    id: string;
    name: string;
  }

  const ELEMENT_DATA: PeriodicElement[] = [
    {position: '08-10-2018', name: 'Calpol', weight:'BD', symbol: '5 Days'},
    {position: '08-10-2018', name: 'Boroline', weight:'Apply Locally', symbol: '3 Days'},
    {position: '08-10-2018', name: 'ABC Syrup', weight:'10 ml', symbol: ''},
    {position: '08-10-2018', name: 'Inject 1', weight:'IV stat', symbol: ''},
   
  ];

@Component({
  selector: 'app-opdprepration',
  templateUrl: './opdprepration.component.html',
  styleUrls: ['./opdprepration.component.css'],
   encapsulation: ViewEncapsulation.None
})
export class OpdpreprationComponent implements OnInit, OnDestroy {

  patientData ;

  PatientID = null;
  PatientName = null;
  PatientType = null;
  PatientAge = null;
  
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  displayedColumns: string[] = [ 'datetd' , 'medicinetd' , 'dosagetd' , 'unittd', 'daystd' , 'actiontd'];
  displayedColumnsReport: string[] = [ 'datetd' , 'reportdtd', 'actiontd'];
  transactions: Transaction[] = [
    {item: 'Beach ball', cost: 4},
    {item: 'Towel', cost: 5},
   
  ];

  pcode;
  presciptionForm : FormGroup;

  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;

    constructor(private router:Router, private commonService:CommonService, private symptomdiseaseService:SymptomdiseaseService , private datashareService:DatashareService , private patientService:PatientService ) {
     
      this.presciptionForm = new FormGroup({
        symptomsMultiCtrl: new FormControl(''),
        symptomsMultiFilterCtrl: new FormControl(''),
        diagnosisMultiCtrl: new FormControl(''),
        diagnosisMultiFilterCtrl: new FormControl(''),
        date: new FormControl(new Date().toISOString()),
        medicineCtrl: new FormControl(''),
        medicineFilterCtrl: new FormControl(''),
        instructionCtrl: new FormControl(''),
        instructionFilterCtrl: new FormControl(''),
        reportsCtrl: new FormControl(''),
        reportsFilterCtrl: new FormControl(''),
        daysCtrl: new FormControl(''),
        finalsummryCtrl: new FormControl(''),
        sickCtrl: new FormControl(''),
        sickdaysCtrl: new FormControl(''),
        approvalCtrl: new FormControl(''),
        admobservCtrl: new FormControl('')
       
      
      });

    this.pcode = this.datashareService.getData();
   

    let response;
          let pdata;
          this.patientService.getPatientByCode(this.pcode).then(data => {
            response = data;
            if(response.msg_status==200) {
              pdata = response.result ; 
              this.PatientID = pdata.patient_code;
              this.PatientName = pdata.patient_name;
              this.PatientType = pdata.patient_type;
              this.PatientAge = response.age;
           }
            else{
              
            }
           },
             error => {
               console.log("There is some error on submitting...");
           });
      

    }



    version = VERSION;
    /*
    public medicineCtrl: FormControl = new FormControl();
    public medicineFilterCtrl: FormControl = new FormControl();

    public bankMultiCtrl: FormControl = new FormControl();
    public bankMultiFilterCtrl: FormControl = new FormControl();

    
    public relationMultiCtrl: FormControl = new FormControl();
    public relationMultiFilterCtrl: FormControl = new FormControl();

        
    public symptomsMultiCtrl: FormControl = new FormControl();
    public symptomsMultiFilterCtrl: FormControl = new FormControl();

    public diagnosisMultiCtrl: FormControl = new FormControl();
    public diagnosisMultiFilterCtrl: FormControl = new FormControl();


    */
         
    private relations: Relation[] = [];
    private symptoms: Symptoms[] = [];
    private diagnosis: Diagnosis[] = [];
    private medicines: Medicine[] = [];

    instructions: Instruction[] = [
      {id: "1" , name: "OD"},
      {id: "1" , name: "BD"},
      {id: "1" , name: "TDS"},
      {id: "1" , name: "IV"}
    ];


    medreports: Reports[] = [
      {id: "1" , name: "Blood glucose test"},
      {id: "1" , name: "X-Ray Test"}
    ];


    public filteredMedicines: ReplaySubject<Medicine[]> = new ReplaySubject<Medicine[]>(1);

    public filterRelations: ReplaySubject<Relation[]> = new ReplaySubject<Relation[]>(1);
    public filteredRelationsMulti: ReplaySubject<Relation[]> = new ReplaySubject<Relation[]>(1);

    public filteredInstruction: ReplaySubject<Instruction[]> = new ReplaySubject<Instruction[]>(1);
    public filteredReports: ReplaySubject<Instruction[]> = new ReplaySubject<Instruction[]>(1);
    


    public filterSymptom: ReplaySubject<Symptoms[]> = new ReplaySubject<Symptoms[]>(1);
    public filteredSymptomMulti: ReplaySubject<Symptoms[]> = new ReplaySubject<Symptoms[]>(1);

    public filterDiagnosis: ReplaySubject<Diagnosis[]> = new ReplaySubject<Diagnosis[]>(1);
    public filteredDiagnosisMulti: ReplaySubject<Diagnosis[]> = new ReplaySubject<Diagnosis[]>(1);
  
    @ViewChild('singleSelect') singleSelect: MatSelect; 
    @ViewChild('multiSelect') multiSelect: MatSelect;
  
    /** Subject that emits when the component has been destroyed. */
    private _onDestroy = new Subject<void>();
  
    ngOnInit() {
     
        this.getSymptoms();
        this.filteredSymptomMulti.next(this.symptoms.slice());
        this.presciptionForm.get('symptomsMultiFilterCtrl').valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterSymptomsMulti();
        });


        this.filteredInstruction.next(this.instructions.slice());
        this.presciptionForm.get('instructionFilterCtrl').valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterInstruction();
          });

        this.filteredReports.next(this.medreports.slice());
        this.presciptionForm.get('filteredReports').valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterMedReports();
          });


          
    }
  
  
    ngOnDestroy() {
      this._onDestroy.next();
      this._onDestroy.complete();
    }
  
   
  
  private filterSymptomsMulti() {
      if (!this.symptoms) {
        return;
      }
      // get the search keyword
      let search =  this.presciptionForm.get('symptomsMultiFilterCtrl').value;
      if (!search) {
        this.filteredSymptomMulti.next(this.symptoms.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredSymptomMulti.next(
        this.symptoms.filter(symptom => symptom.name.toLowerCase().indexOf(search) > -1)
      );
    }

    private filterDiagnosisMulti() {
      if (!this.diagnosis) {
        return;
      }
      // get the search keyword
      let search =  this.presciptionForm.get('diagnosisMultiFilterCtrl').value;
      if (!search) {
        this.filteredDiagnosisMulti.next(this.diagnosis.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredDiagnosisMulti.next(
        this.diagnosis.filter(diagnos => diagnos.name.toLowerCase().indexOf(search) > -1)
      );
    }


    private filterMedicines() {
      if (!this.medicines) {
        return;
      }
      // get the search keyword
      let search =  this.presciptionForm.get('medicineFilterCtrl').value;
      if (!search) {
        this.filteredMedicines.next(this.medicines.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredMedicines.next(
        this.medicines.filter(medicine => medicine.name.toLowerCase().indexOf(search) > -1)
      );
    }

    private filterInstruction() {
      if (!this.instructions) {
        return;
      }
      // get the search keyword
      let search =  this.presciptionForm.get('instructionFilterCtrl').value;
      if (!search) {
        this.filteredInstruction.next(this.instructions.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredInstruction.next(
        this.instructions.filter(instruction => instruction.name.toLowerCase().indexOf(search) > -1)
      );
    }

    private filterMedReports() {
      if (!this.medreports) {
        return;
      }
      // get the search keyword
      let search =  this.presciptionForm.get('reportsFilterCtrl').value;
      if (!search) {
        this.filteredReports.next(this.medreports.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredReports.next(
        this.medreports.filter(medreport => medreport.name.toLowerCase().indexOf(search) > -1)
      );
    }


    addMedicine() {
      console.log("Medicine add");
    }

    onSubmit(){
      console.log(this.presciptionForm.value);
    }
    



    getSymptoms(){
      let dataval;
      let symptomlist;
      this.symptomdiseaseService.getSymptoms().then(data => {
        dataval = data;
        symptomlist = dataval.result;
        var count = Object.keys(dataval.result).length;
                 let resultObj;
                 for(let i = 0; i<count; i++){
                  resultObj = {
                      'name':dataval.result[i].symptom,
                      'id': dataval.result[i].symptom_id
                  }
                  this.symptoms.push(resultObj);
              }
              this.filteredSymptomMulti.next(this.symptoms.slice());

               
      },
      error => {
       console.log("There is some error in Relation List...");
     });
    }


    getDiseaseList(obj){
      let dataval;
      let diagnosislist;
      this.diagnosis = [];
      this.symptomdiseaseService.getDiseasesBySymptom(obj.value).then(data => {
        dataval = data;
        diagnosislist = dataval.result;
        var count = Object.keys(dataval.result).length;
                 let resultObj;
                 for(let i = 0; i<count; i++){
                  resultObj = {
                      'name':dataval.result[i].diagonosis_name,
                      'id': dataval.result[i].diagonosis_id	
                  }
                  this.diagnosis.push(resultObj);
              }
              this.filteredDiagnosisMulti.next(this.diagnosis.slice());
              this.presciptionForm.get('diagnosisMultiFilterCtrl').valueChanges
              .pipe(takeUntil(this._onDestroy))
              .subscribe(() => {
                this.filterDiagnosisMulti();
              });

               
      },
      error => {
       console.log("There is some error in Diagnosis List...");
     });
    }

    getMedicine(obj){
      console.log(obj);
    
      let dataval;
      let medicinelist;
      this.medicines = [];
      this.symptomdiseaseService.getMedicineByDisease(obj.value).then(data => {
        dataval = data;
        medicinelist = dataval.result;
        var count = Object.keys(dataval.result).length;
                 let resultObj;
                 for(let i = 0; i<count; i++){
                  resultObj = {
                      'name':dataval.result[i].medicine_name,
                      'id': dataval.result[i].medicine_id	
                  }
                  this.medicines.push(resultObj);
              }
             
      this.filteredMedicines.next(this.medicines.slice());
      this.presciptionForm.get('medicineFilterCtrl').valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterMedicines();
        });

               
      },
      error => {
       console.log("There is some error in Medicine List...");
     });
    }


    gotoList(){
      this.router.navigateByUrl('panel/todaysreg');
    }
    
}
