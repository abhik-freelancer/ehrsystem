import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppMaterialModule } from '../../app-material/app-material.module';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { PatienregistrationRoutingModule } from './patienregistration-routing.module';
import { PatienregistrationComponent } from './patienregistration.component';
import { TodayspatientreglistComponent } from '../components/todayspatientreglist/todayspatientreglist.component';
import { PatientadddialogComponent } from '../components/patientadddialog/patientadddialog.component';









@NgModule({
  imports: [
    CommonModule,
    PatienregistrationRoutingModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  providers:[],
  declarations: [PatienregistrationComponent,TodayspatientreglistComponent,PatientadddialogComponent],
  entryComponents : [TodayspatientreglistComponent,PatientadddialogComponent]
})
export class PatienregistrationModule { }
