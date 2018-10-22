import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AppMaterialModule } from '../../app-material/app-material.module';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { OpdpreprationRoutingModule } from './opdprepration-routing.module';
import { OpdpreprationComponent } from './opdprepration.component';



@NgModule({
  imports: [
    CommonModule,
    OpdpreprationRoutingModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule
    
    
  ],
  providers:[],
  declarations: [OpdpreprationComponent],
  entryComponents : []
})
export class OpdpreprationModule { }
