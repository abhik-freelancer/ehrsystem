
import {Component, OnInit, ViewChild ,  ViewEncapsulation } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { CommonService } from '../../service/common.service';
import { MatTabChangeEvent } from '@angular/material';
import { RegistrationService } from '../../service/registration.service';
import { DatashareService } from '../../service/datashare.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-todaysregistration',
  templateUrl: './todaysregistration.component.html',
  styleUrls: ['./todaysregistration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TodaysregistrationComponent implements OnInit {
  openReglistBlock = true;
  openVisitedBlock = false;
  dataSource;
  todaysregistrationListCount = [];
  todaysregistrationList = [];
  patientTypeList = [];
  recordsFound = false;
  isButtonActive = true;

  allcount = 0;
  pwcount = 0;
  twcount = 0;
  depcount = 0;
  nwcount = 0;
  

  displayedColumns: string[] = [
  'action',
  'patient_code',
  'patient_name',
  'birthdate',
  'gender', 
  'division_number' ,
  'challan_number' ,
  'line_number' ,
  'mobile_one',
  'adhar'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  tabLoadTimes: Date[] = [];
  constructor(private commonService:CommonService ,private registerService: RegistrationService , private datashareService:DatashareService , private router:Router) {
    console.log("Data service " + this.datashareService.sharedData);
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  firstTab(e){
    //console.log("fgdsf"+e);
  }
  ngOnInit() {
    this.isButtonActive = true;
   this.getTodaysRegForDoc("ALL","N");
   this.getTodaysRegForDocCount("ALL","N");
   this.getTodaysRegForDocCount("P/W","N");
   this.getTodaysRegForDocCount("T/W","N");
   this.getTodaysRegForDocCount("Dep","N");
   this.getTodaysRegForDocCount("N/W","N");
 
  }



  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.openReglistBlock = true;
    let tabindx;
    tabindx = tabChangeEvent.index;
    if(tabindx == 0){
      this.getTodaysRegForDoc("ALL","N");
    }
    else if(tabindx == 1){
      this.getTodaysRegForDoc("P/W","N");
    }
    else if(tabindx == 2){
      this.getTodaysRegForDoc("T/W","N");
    }
    else if(tabindx == 3){
      this.getTodaysRegForDoc("Dep","N");
    }
    else if(tabindx == 4){
      this.getTodaysRegForDoc("N/W","N");
    }
    else if(tabindx == 5){
     this.openReglistBlock = false;
    }
    
}



  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
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



  getTodaysRegForDoc(type,serve) {
    this.todaysregistrationList = [];
    this.recordsFound  = false;
    let dataval;
    let regdata;
    this.registerService.getTodaysRegForDoc(type,serve).then(data => {
      dataval = data;
      regdata = dataval.todaysreg_data;
     
      this.todaysregistrationList.push(regdata);
      const tcount = this.todaysregistrationList[0].length;
     if(tcount > 0){
       this.recordsFound = true;
     }
      this.dataSource = new MatTableDataSource(this.todaysregistrationList[0]);
      
    },
    error => {
     console.log("error in todays registration list");
   });
  }
  getTodaysRegForDocCount(type,serve) {
    this.todaysregistrationListCount = [];
    let dataval;
    let regdata;
    this.registerService.getTodaysRegForDoc(type,serve).then(data => {
      dataval = data;
      regdata = dataval.todaysreg_data;
      this.todaysregistrationListCount = [];
      this.todaysregistrationListCount.push(regdata);
      let tcount =  0;
      tcount = this.todaysregistrationListCount[0].length;

      if(type == "ALL"){
        this.allcount = tcount ;
      }
      else if(type == "P/W"){
        this.pwcount = tcount ;
      }
      else if(type == "T/W"){
       this.twcount = tcount ;
      }
      else if(type == "Dep"){
        this.depcount = tcount ; 
      }
      else if(type == "N/W"){
        this.nwcount = tcount ;
      }

    },
    error => {
     console.log("error in todays registration list");
   });
  }


  getPresciption(p){
    this.isButtonActive = false;
    console.log("Presciption Val :: " + p);
    this.datashareService.saveData(p);
    this.router.navigate(['/panel/opd']);
  }

}




