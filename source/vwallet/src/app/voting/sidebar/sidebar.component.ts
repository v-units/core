import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';
import { Router } from '@angular/router';

import { ApiService } from '../../shared/services/api.service';
import { GlobalService } from '../../shared/services/global.service';
import { ModalService } from '../../shared/services/modal.service';

import { WalletInfo } from '../../shared/classes/wallet-info';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private globalService: GlobalService, private apiService: ApiService, private router: Router, private modalService: NgbModal, private genericModalService: ModalService) { }
  public dashboardActive: boolean;
  public votingActive: boolean;
  public verificationActive: boolean;
  public miningActive: boolean;

  ngOnInit() {
    this.dashboardActive = true;
    this.miningActive = false;
    this.votingActive = false;
    this.verificationActive = false;
  }

  public loadDashboard() {
    let currentNetwork = this.globalService.getNetwork();
    if (currentNetwork === "Main") {
      this.globalService.setCoinName("Value Units");
      this.globalService.setCoinUnit("VU");
    } else if (currentNetwork === "TestNet"){
      this.globalService.setCoinName("Test Value Units");
      this.globalService.setCoinUnit("TVU");
    }

    this.dashboardActive = true;
    this.miningActive = false;
    this.votingActive = false;
    this.verificationActive = false;
    this.router.navigate(['/wallet']);
  }

  public loadMining() {
    let currentNetwork = this.globalService.getNetwork();
    if (currentNetwork === "Main") {
      this.globalService.setCoinName("Value Units");
      this.globalService.setCoinUnit("VU");
    } else if (currentNetwork === "TestNet"){
      this.globalService.setCoinName("Test Value Units");
      this.globalService.setCoinUnit("TVU");
    }

    this.miningActive = true;
    this.dashboardActive = false;
    this.votingActive = false;
    this.verificationActive = false;
    this.router.navigate(['/mining']);
  }

  public loadVoting() {
    let currentNetwork = this.globalService.getNetwork();
    if (currentNetwork === "Main") {
      this.globalService.setCoinName("Value Units");
      this.globalService.setCoinUnit("VU");
    } else if (currentNetwork === "TestNet"){
      this.globalService.setCoinName("Test Value Units");
      this.globalService.setCoinUnit("TVU");
    }

    this.votingActive = true;
    this.miningActive = false;
    this.dashboardActive = false;
    this.verificationActive = false;
    this.router.navigate(['/voting']);
  }

  public loadVerification() {
    let currentNetwork = this.globalService.getNetwork();
    if (currentNetwork === "Main") {
      this.globalService.setCoinName("Value Units");
      this.globalService.setCoinUnit("VU");
    } else if (currentNetwork === "TestNet"){
      this.globalService.setCoinName("Test Value Units");
      this.globalService.setCoinUnit("TVU");
    }

    this.verificationActive = true;
    this.votingActive = false;
    this.miningActive = false;
    this.dashboardActive = false;
    this.router.navigate(['/verification']);
  }

  public logOut() {
    const modalRef = this.modalService.open(LogoutConfirmationComponent);
  }
}
