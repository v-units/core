import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../shared/services/api.service';
import { GlobalService } from '../../shared/services/global.service';
import { ModalService } from '../../shared/services/modal.service';
import { WalletInfo } from '../../shared/classes/wallet-info';
import { TransactionInfo } from '../../shared/classes/transaction-info';

import { WalletIdentification } from '../../shared/classes/wallet-identification';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

const { remote } = require('electron');
const { app, dialog } = require('electron').remote;

const fs = require('fs');

@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  constructor(private apiService: ApiService, private globalService: GlobalService, private modalService: NgbModal, private genericModalService: ModalService) 
  {
  }

  public identificationName: string;
  public identificationEMail: string;
  public identificationAddress: string;
  public identificationTelephone: string;
  public isIdentified : boolean;
  private walletInfoSubscription: Subscription;

  public openFileDialog() {
    
    let dashboard = this

    dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'vIdentification (vID)', extensions: ['json'] }
      ]
      }, 
      function (files) 
      {
        if (files !== undefined) {
          console.log(files[0])
          fs.readFile(files[0], function (err, data) {
            if (err) {
              return console.error(err);
            }

            let dataObject = JSON.parse(data);

            var walletIdentification = new WalletIdentification(
              dashboard.globalService.getWalletName(),
              dataObject.name,
              dataObject.eMail,
              dataObject.telephone,
              dataObject.address,
              dataObject.mnemonic
            );         

            console.log(walletIdentification);

            dashboard.identifyWallet(walletIdentification);
          });
        }
      }
    )
  };

  private identifyWallet(walletIdentification: WalletIdentification) {
    this.apiService
      .identifyWallet(walletIdentification)
      .subscribe(
        response => {
          if (response.status >= 200 && response.status < 400){
            console.log('identified');
          }
        },
        error => {
          console.log(error);
        }
      )
    ;
  }

  ngOnInit() {
    this.identificationName = "-";
    this.identificationEMail = "-";
    this.identificationAddress = "-";
    this.identificationTelephone = "-";
    this.isIdentified = true;
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
              this.identificationName = walletResponse.identificationName;
              this.identificationEMail = walletResponse.identificationEMail;
              this.identificationTelephone = walletResponse.identificationTelephone;
              this.identificationAddress = walletResponse.identificationAddress;
              this.isIdentified = walletResponse.isIdentified;
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
}
