import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface Patient {
 
  name: string;
  emplcode: string;
} 

@Component({
  selector: 'app-patientreg',
  templateUrl: './patientreg.component.html',
  styleUrls: ['./patientreg.component.css']
})


export class PatientregComponent implements OnInit {
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  patientCtrl = new FormControl();
  filteredStates: Observable<Patient[]>;

  patients: Patient[] = [
    {
      name: 'Mithilesh Routh',
      emplcode: '0001',
     
    
    },
    {
      name: 'Abhik Ghosh',
      emplcode: '0002',
    
    },
    {
      name: 'Shibu Sankar',
      emplcode: '0003',
     
    
    },
    {
      name: 'Suman Mukherjee ',
      emplcode: '0004',
     
    }
  ];

  constructor() {
    this.filteredStates = this.patientCtrl.valueChanges
      .pipe(
        startWith(''),
        map(patient => patient ? this._filterStates(patient) : this.patients.slice())
      );
   }

   private _filterStates(value: string): Patient[] {
    const filterValue = value.toLowerCase();

    return this.patients.filter(patient => patient.name.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit() {
  }
  
}
