import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppMaterialModule } from '../../app-material/app-material.module';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { PatienregistrationRoutingModule } from './patienregistration-routing.module';
import { PatienregistrationComponent } from './patienregistration.component';







@NgModule({
  imports: [
    CommonModule,
    PatienregistrationRoutingModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
    
  ],
  declarations: [PatienregistrationComponent]
})
export class PatienregistrationModule { }
