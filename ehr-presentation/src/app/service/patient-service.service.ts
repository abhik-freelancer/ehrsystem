import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalconstantService } from './globalconstant.service';


@Injectable({
  providedIn: 'root'
})
export class PatientServiceService {

  constructor(public http: HttpClient,private global:GlobalconstantService) { }
  GetPatientListAll(){
  return this.http.get(this.global.ListPatient);
  }
}
