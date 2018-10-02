import { Component, OnInit ,ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

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
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];



@Component({
  selector: 'app-patientreg',
  templateUrl: './patientreg.component.html',
  styleUrls: ['./patientreg.component.css']
})


export class PatientregComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  
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

