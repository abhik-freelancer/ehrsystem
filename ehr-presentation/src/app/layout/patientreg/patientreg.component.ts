import { Component, OnInit ,ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { PatientService } from '../../service/patient.service';



export interface Patient {
 
  name: string;
  emplcode: string;
} 

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Mithilesh Routh', weight: 1236547891, symbol: 'Permanent'},
  {position: 2, name: 'Aayush Kumar', weight: 3214587965, symbol: 'Dependent'},
  
];



@Component({
  selector: 'app-patientreg',
  templateUrl: './patientreg.component.html',
  styleUrls: ['./patientreg.component.css']
})


export class PatientregComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  private  patientlst:  Array<object> = [];
  
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  patientCtrl = new FormControl();
  filteredStates: Observable<Patient[]>;

  patients: Patient[] = [
    {
      name: 'Mithilesh Routh',
      emplcode: 'E0001',
     
    
    },
    {
      name: 'Abhik Ghosh',
      emplcode: 'E0001/SO',
    
    },
    {
      name: 'Shibu Sankar',
      emplcode: 'E0002',
     
    
    },
    {
      name: 'Suman Mukherjee ',
      emplcode: 'E0003',
     
    }
  ];

  constructor(private patientService:PatientService) {
    
    this.filteredStates = this.patientCtrl.valueChanges
      .pipe(
        startWith(''),
        map(patient => patient ? this._filterStates(patient) : this.patients.slice())
      );
   }
   patientLst: string[];
   selected = null;

   private _filterStates(value: string): Patient[] {
    const filterValue = value.toLowerCase();

    return this.patients.filter(patient => patient.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
    this.getContacts();
  }
  public  getContacts(){
    this.patientService.GetPatientListAll().subscribe((data:  Array<object>) => {
        this.patientlst  =  data;
        console.log(data);
    });
}
  
}

