import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule, MatSidenavModule, MatListModule ,MatMenuModule , MatNativeDateModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatTableModule,
    FlexLayoutModule
  ],
  declarations: [],
  
  exports: [
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatCardModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatTableModule,
    FlexLayoutModule
  ]
})
export class AppMaterialModule { }
