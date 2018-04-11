import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';

import { VerificationComponent } from './verification.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';

import { SharedModule } from '../shared/shared.module';
import { VerificationRoutingModule } from './verification-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StatusBarComponent } from './status-bar/status-bar.component';

@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,
    FormsModule,
    SharedModule.forRoot(),
    NgbModule,
    ReactiveFormsModule,
    VerificationRoutingModule
  ],
  declarations: [
    VerificationComponent,
    MenuComponent,
    DashboardComponent,
    SettingsComponent,
    SidebarComponent,
    StatusBarComponent
  ],
  exports: []
})

export class VerificationModule { }
