import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import 'hammerjs';

import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TokeninterceptorService } from './service/tokeninterceptor.service';
import { GlobalconstantService } from './service/globalconstant.service';
import { AuthService } from './service/auth.service';



import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';


import {MatCardModule} from '@angular/material/card';
import { AppheaderComponent } from './layouts/appheader/appheader.component';
import { AppsidebarComponent } from './layouts/appsidebar/appsidebar.component';






@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AppheaderComponent,
    AppsidebarComponent
    
    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatCardModule,
    AppRoutingModule
    
  ],
  providers: [GlobalconstantService,AuthService,ErrorHandler,
      {
      provide: HTTP_INTERCEPTORS,
      useClass: TokeninterceptorService,
      multi: true
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

  constructor(router: Router) {}

}
