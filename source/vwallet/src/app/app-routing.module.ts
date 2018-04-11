import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'setup', loadChildren: 'app/setup/setup.module#SetupModule'},
  { path: 'mining', loadChildren: 'app/mining/mining.module#MiningModule'},
  { path: 'verification', loadChildren: 'app/verification/verification.module#VerificationModule'},
  { path: 'voting', loadChildren: 'app/voting/voting.module#VotingModule'},
  { path: 'wallet', loadChildren: 'app/wallet/wallet.module#WalletModule'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: true}) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
