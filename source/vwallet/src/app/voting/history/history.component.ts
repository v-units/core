import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiService } from '../../shared/services/api.service';
import { GlobalService } from '../../shared/services/global.service';
import { ModalService } from '../../shared/services/modal.service';

import { WalletInfo } from '../../shared/classes/wallet-info';
import { TransactionInfo } from '../../shared/classes/transaction-info';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';

@Component({
  selector: 'history-component',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})

export class HistoryComponent {
  constructor(private apiService: ApiService, private globalService: GlobalService, private modalService: NgbModal, private genericModalService: ModalService) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
