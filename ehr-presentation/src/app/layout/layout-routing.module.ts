import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';


const routes: Routes = [ 
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'forms', loadChildren: './form/form.module#FormModule' },
            { path: 'reg', loadChildren: './patientreg/patientreg.module#PatientregModule' },
            { path: 'registration', loadChildren: './patienregistration/patienregistration.module#PatienregistrationModule' },
            { path: 'todaysreg' , loadChildren:'./todaysregistration/todaysregistration.module#TodaysregistrationModule'},
            { path: 'opd', loadChildren:'./opdprepration/opdprepration.module#OpdpreprationModule'},
            {path:'sickapproval',loadChildren:'./sickleaveapproval/sickleaveapproval.module#sickleaveapprovalModule'}
        
            
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
