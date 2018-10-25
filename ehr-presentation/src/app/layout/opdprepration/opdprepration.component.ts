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
    name: string,
    type: string
  }

  interface Dosage{
    id: string,
    value: string,
  }

  interface Frequency{
    id: string,
    frequency: string,
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

  interface Hospitals{
    id: string;
    name: string;
  }

  export interface addedMedicineData {
    datetd:any;
    medicinetd:any;
    dosagetd:any;
    unittd:any;
    daystd:any;
    actiontd:any;
  }


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
  
  

  //investigationDt = new FormControl(new Date());

  //date = new FormControl(new Date());
  //serializedDate = new FormControl((new Date()).toISOString());

  displayedColumns: string[] = [ 'datetd' , 'medicinetd' , 'dosagetd' , 'unittd', 'daystd' , 'actiontd'];
  //dataSource = this.ELEMENT_DATAS;
  dataSource = [];

  displayedColumnsReport: string[] = [ 'datetd' , 'reportdtd', 'actiontd'];
  transactions: Transaction[] = [
    {item: 'Beach ball', cost: 4},
    {item: 'Towel', cost: 5},
   
  ];

  addedMeddata = [];
  addedInvestigations = [];

  pcode;
  presciptionHealthForm : FormGroup;
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
        dosageCtrl: new FormControl(''),
        dosageFilterCtrl: new FormControl(''),
        instructionCtrl: new FormControl(''),
        instructionFilterCtrl: new FormControl(''),
        investigationDt: new FormControl(new Date().toISOString()),
        reportsCtrl: new FormControl(''),
        reportsFilterCtrl: new FormControl(''),
        daysCtrl: new FormControl(''),
        finalsummryCtrl: new FormControl(''),
        sickCtrl: new FormControl(''),
        sickdaysCtrl: new FormControl({value: '', disabled: true}),
        approvalCtrl: new FormControl(''),
        admitCtrl: new FormControl(''),
        observCtrl: new FormControl(''),
        isReffHospital: new FormControl(''),
        reffHospitalCtrl: new FormControl({value: '', disabled: true}),
        reffHospitalFilterCtrl: new FormControl('')
      });

      this.presciptionHealthForm = new FormGroup({
        hdnpatientID: new FormControl(''),
        patientID: new FormControl({value: '', disabled: true}),
        prescpID: new FormControl({value: '', disabled: true}),
        patientType: new FormControl({value: '', disabled: true}),
        patientName: new FormControl({value: '', disabled: true}),
        patientAge: new FormControl({value: '', disabled: true}),
        pulse: new FormControl(''),
        tempratute: new FormControl(''),
        anaemia: new FormControl(''),
        bp: new FormControl(''),
        jaundice: new FormControl(''),
        odema: new FormControl(''),
        height: new FormControl(''),
        weight: new FormControl('')
      
      });

    this.pcode = this.datashareService.getData();
   

    let response;
          let pdata;
          this.patientService.getPatientByCode(this.pcode).then(data => {
            response = data;
            if(response.msg_status==200) {
              pdata = response.result ; 
             /* this.PatientID = pdata.patient_code;
              this.PatientName = pdata.patient_name;
              this.PatientType = pdata.patient_type;
              this.PatientAge = response.age;*/

              this.presciptionHealthForm.patchValue({
                hdnpatientID: pdata.patient_code,
                patientID: pdata.patient_code,
                prescpID: response.prescriptionID,
                patientType: pdata.patient_type,
                patientName: pdata.patient_name,
                patientAge: response.age
               
              });
           }
            else{
              
            }
           },
             error => {
               console.log("There is some error on submitting...");
           });
      

    }



    version = VERSION;
 
    private relations: Relation[] = [];
    private symptoms: Symptoms[] = [];
    private diagnosis: Diagnosis[] = [];
    private medicines: Medicine[] = [];
    private dosages: Dosage[] = [];
    private frequency: Frequency[] = [];

    instructions: Instruction[] = [
      {id: "1" , name: "OD"},
      {id: "1" , name: "BD"},
      {id: "1" , name: "TDS"},
      {id: "1" , name: "IV"}
    ];


    medreports: Reports[] = [];
    refferHospitals: Hospitals[] = [];


    public filteredMedicines: ReplaySubject<Medicine[]> = new ReplaySubject<Medicine[]>(1);
    public filteredDosages: ReplaySubject<Dosage[]> = new ReplaySubject<Dosage[]>(1);
    public filteredFrequency: ReplaySubject<Frequency[]> = new ReplaySubject<Frequency[]>(1);

    public filterRelations: ReplaySubject<Relation[]> = new ReplaySubject<Relation[]>(1);
    public filteredRelationsMulti: ReplaySubject<Relation[]> = new ReplaySubject<Relation[]>(1);

    public filteredInstruction: ReplaySubject<Frequency[]> = new ReplaySubject<Frequency[]>(1);
    public filteredReports: ReplaySubject<Reports[]> = new ReplaySubject<Reports[]>(1);
    public filteredHospitals: ReplaySubject<Hospitals[]> = new ReplaySubject<Hospitals[]>(1);
    


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


        
        this.getIvestigations();
        this.filteredReports.next(this.medreports.slice());
        this.presciptionForm.get('reportsFilterCtrl').valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterMedReports();
          });

        this.getHospitals();
        this.filteredHospitals.next(this.refferHospitals.slice());
        this.presciptionForm.get('reffHospitalFilterCtrl').valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterHospital();
          });


          
    }
  
    validateRecomChkBox(event,tag){
      if(tag == "ADMIT"){
        this.presciptionForm.patchValue({
          observCtrl: false
         });
      }
      if(tag == "OBSERVATION"){
        this.presciptionForm.patchValue({
          admitCtrl: false
         });
      }
    }

    enableSickDay(event){
      if(event.checked){
      
        this.presciptionForm.controls['sickdaysCtrl'].enable(); 
      }
      else{
        this.presciptionForm.patchValue({
          sickdaysCtrl: ''
        });
        this.presciptionForm.controls['sickdaysCtrl'].disable(); 
      }
    }

    enableReffHospital(event){
      if(event.checked){
      
        this.presciptionForm.controls['reffHospitalCtrl'].enable(); 
      }
      else{
        this.presciptionForm.patchValue({
          reffHospitalCtrl: ''
        });
        this.presciptionForm.controls['reffHospitalCtrl'].disable(); 
      }
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

    
    private filterDosage() {
      if (!this.dosages) {
        return;
      }
      // get the search keyword
      let search =  this.presciptionForm.get('dosageFilterCtrl').value;
      if (!search) {
        this.filteredDosages.next(this.dosages.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredDosages.next(
        this.dosages.filter(dosages => dosages.value.toLowerCase().indexOf(search) > -1)
      );
    }



    private filterInstruction() {
      if (!this.frequency) {
        return;
      }
      // get the search keyword
      let search =  this.presciptionForm.get('instructionFilterCtrl').value;
      if (!search) {
        this.filteredInstruction.next(this.frequency.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredInstruction.next(
        this.frequency.filter(frequency => frequency.frequency.toLowerCase().indexOf(search) > -1)
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

    private  filterHospital(){
      if (!this.refferHospitals) {
        return;
      }
      // get the search keyword
      let search =  this.presciptionForm.get('reffHospitalFilterCtrl').value;
      if (!search) {
        this.filteredHospitals.next(this.refferHospitals.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredHospitals.next(
        this.refferHospitals.filter(reffhospital => reffhospital.name.toLowerCase().indexOf(search) > -1)
      );
    }


    addMedicine() {
    
      let date = this.presciptionForm.get('date').value;
      let medicine = this.presciptionForm.get('medicineCtrl').value;
      let dosage = this.presciptionForm.get('dosageCtrl').value;
      let frequency = this.presciptionForm.get('instructionCtrl').value;
      let days = this.presciptionForm.get('daysCtrl').value;
    
  
    let data = {datetd: date, medicinetd:medicine, dosagetd:dosage, unittd: frequency , daystd:days , actiontd: 'x' };
    this.addedMeddata.push(data);
    

    
   // this.dataSource = this.ELEMENT_DATAS;
  }

  addInvestigation(){
    let date = this.presciptionForm.get('investigationDt').value;
    let report = this.presciptionForm.get('reportsCtrl').value;
    let data = {invdate: date, reports:report, action: 'x' };
    this.addedInvestigations.push(data);
  }

  removeData(i){
    this.addedMeddata.splice(i, 1);
  }

  removeMedReports(i){
    this.addedInvestigations.splice(i, 1);
  }

    onSubmit(){
     console.log(this.presciptionForm.value);
     console.log(this.addedMeddata);
     console.log(this.addedInvestigations);
     console.log(this.presciptionHealthForm.value);




    let response;
    this.symptomdiseaseService.insertToOPD(this.presciptionHealthForm.value,this.presciptionForm.value,this.addedMeddata,this.addedInvestigations).then(data => {
      response = data;
    
      if(response.msg_status==200) {
      
      

      }
      else{
     
      }
     },
       error => {
         console.log("There is some error on submitting...");
     });

    }
    


    getIvestigations(){
      let dataval;
      let reportlist;
      this.symptomdiseaseService.getInvestigations().then(data => {
        dataval = data;
        reportlist = dataval.result;
        var count = Object.keys(dataval.result).length;
                 let resultObj;
                 for(let i = 0; i<count; i++){
                  resultObj = {
                      'name':dataval.result[i].investigation_name,
                      'id': dataval.result[i].investigation_id
                  }
                  this.medreports.push(resultObj);
              }
              this.filteredReports.next(this.medreports.slice());

               
      },
      error => {
       console.log("There is some error in Investigation List...");
     });
    }

    getHospitals(){
      let dataval;
      let hospitallist;
      this.commonService.getHospitals().then(data => {
        dataval = data;
        hospitallist = dataval.result;
        var count = Object.keys(dataval.result).length;
                 let resultObj;
                 for(let i = 0; i<count; i++){
                  resultObj = {
                      'name':dataval.result[i].hospital_name,
                      'id': dataval.result[i].hospital_id
                  }
                  this.refferHospitals.push(resultObj);
              }
              this.filteredHospitals.next(this.refferHospitals.slice());

               
      },
      error => {
       console.log("There is some error in Investigation List...");
     });
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
                      'id': dataval.result[i].medicine_id	,
                      'type' : dataval.result[i].medicine_type
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

    getOtherDependent(obj){
      this.getDosage(obj);
      this.getFrequency(obj);
    }

    getDosage(obj){
      let dataval;
      let dosagelist;
      this.dosages = [];
      this.symptomdiseaseService.getDosageByMedicine(obj.value).then(data => {
        dataval = data;
        dosagelist = dataval.result;
        var count = Object.keys(dataval.result).length;
                 let resultObj;
                 for(let i = 0; i<count; i++){
                  resultObj = {
                      'id': dataval.result[i].dosage_id	,
                      'value' : dataval.result[i].value
                  }
                  this.dosages.push(resultObj);
              }
             
      this.filteredDosages.next(this.dosages.slice());
      this.presciptionForm.get('dosageFilterCtrl').valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterDosage();
        });

               
      },
      error => {
       console.log("There is some error in Dosage List...");
     });
    }


    getFrequency(obj){
      let dataval;
      let frequencylist;
      this.frequency = [];
      this.symptomdiseaseService.getFrequencyByMedicine(obj.value).then(data => {
        dataval = data;
        frequencylist = dataval.result;
        var count = Object.keys(dataval.result).length;
                 let resultObj;
                 for(let i = 0; i<count; i++){
                  resultObj = {
                      'id': dataval.result[i].frequency_master_id	,
                      'frequency' : dataval.result[i].frequency
                  }
                  this.frequency.push(resultObj);
              }
             
              this.filteredInstruction.next(this.frequency.slice());
              this.presciptionForm.get('instructionFilterCtrl').valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                  this.filterInstruction();
                });
               
      },
      error => {
       console.log("There is some error in Frequency List...");
     });
    }




    gotoList(){
      this.router.navigateByUrl('panel/todaysreg');
    }
    
}
