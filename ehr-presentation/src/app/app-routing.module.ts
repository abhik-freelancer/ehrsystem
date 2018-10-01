import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';



const appRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: '', component: LoginComponent},
  { path: 'hero/:id', component: LoginComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
