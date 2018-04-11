import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MiningComponent }   from './mining.component';
import { HistoryComponent } from './history/history.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: MiningComponent,
    children: [
      { path: '', redirectTo:'dashboard', pathMatch:'full' },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'history', component: HistoryComponent}
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class MiningRoutingModule {}
