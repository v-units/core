import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VerificationComponent }   from './verification.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: VerificationComponent,
    children: [
      { path: '', redirectTo:'dashboard', pathMatch:'full' },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'settings', component: SettingsComponent}
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class VerificationRoutingModule {}
