import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VotingComponent }   from './voting.component';
import { HistoryComponent } from './history/history.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: VotingComponent,
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

export class VotingRoutingModule {}
