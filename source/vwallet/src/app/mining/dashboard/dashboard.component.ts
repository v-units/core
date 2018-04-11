import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../shared/services/api.service';
import { GlobalService } from '../../shared/services/global.service';
import { ModalService } from '../../shared/services/modal.service';
import { WalletInfo } from '../../shared/classes/wallet-info';
import { MiningStarting } from '../../shared/classes/mining-starting';
import { MiningStoping } from '../../shared/classes/mining-stoping';
import { TransactionInfo } from '../../shared/classes/transaction-info';

import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  constructor(private apiService: ApiService, private globalService: GlobalService, private modalService: NgbModal, private genericModalService: ModalService) {}

  public status: string;
  public isMining: boolean;
  public isStartDisabled : boolean;
  public isStopDisabled : boolean;
  public isIdentified: boolean;
  private walletInfoSubscription: Subscription;

  ngOnInit() {
    this.status = 'Inactive';    
    this.isMining = false;
    this.isIdentified = false;
    this.isStartDisabled = true;
    this.isStopDisabled = true;
    this.startSubscriptions();
  };

  ngOnDestroy() {
    this.cancelSubscriptions();
  };

  private cancelSubscriptions() {
    if (this.walletInfoSubscription) {
      this.walletInfoSubscription.unsubscribe();
    }
  };

  private startSubscriptions() {
    this.getWalletInfo();
  }

  private getWalletInfo() {
    let walletInfo = new WalletInfo(this.globalService.getWalletName());
    this.walletInfoSubscription = this.apiService.getGeneralInfo(walletInfo)
      .subscribe(
        response =>  {
          if (response.status >= 200 && response.status < 400) {
              let walletResponse = response.json();
              this.isMining = walletResponse.isMining;
              this.isIdentified = walletResponse.isIdentified;

              if(this.isIdentified)
              {
                if(this.isMining)
                {
                  this.isStartDisabled = true;
                  this.isStopDisabled = false;
                }
                else
                {
                  this.isStartDisabled = false;
                  this.isStopDisabled = true;
                }
              }
              else
              {
                this.isStartDisabled = true;
                this.isStopDisabled = true;            
              }

              if(this.isMining)
              {
                  this.status = "Mining";
              }
              else
              {
                  this.status = "Inactive";
              }
          }
        },
        error => {
          console.log(error);
          if (error.status === 0) {
            this.cancelSubscriptions();
            this.genericModalService.openModal(null, null);
          } else if (error.status >= 400) {
            if (!error.json().errors[0]) {
              console.log(error);
            }
            else {
              if (error.json().errors[0].description) {
                this.genericModalService.openModal(null, error.json().errors[0].message);
              } else {
                this.cancelSubscriptions();
                this.startSubscriptions();
              }
            }
          }
        }
      )
    ;
  };

  public startMining() {
    var miningStarting = new MiningStarting(this.globalService.getWalletName());

    this.apiService
      .startMining(miningStarting)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            this.isMining = true;
            this.status = 'Mining';
          }
        },
        error => {
          console.log(error);
        }
      )
    ;
  }

  public stopMining() {
    var miningStoping = new MiningStoping(this.globalService.getWalletName());

    this.apiService
      .stopMining(miningStoping)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            this.isMining = true;
            this.status = 'Mining';
          }
        },
        error => {
          console.log(error);
        }
      )
    ;
  }
}
