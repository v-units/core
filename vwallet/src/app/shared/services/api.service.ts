import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import "rxjs/add/observable/interval";
import 'rxjs/add/operator/startWith';

import { GlobalService } from './global.service';

import { MiningStarting } from '../classes/mining-starting';
import { MiningStoping } from '../classes/mining-stoping';
import { WalletCreation } from '../classes/wallet-creation';
import { WalletIdentification } from '../classes/wallet-identification';
import { WalletRecovery } from '../classes/wallet-recovery';
import { WalletLoad } from '../classes/wallet-load';
import { WalletInfo } from '../classes/wallet-info';
import { Mnemonic } from '../classes/mnemonic';
import { FeeEstimation } from '../classes/fee-estimation';
import { TransactionBuilding } from '../classes/transaction-building';
import { TransactionSending } from '../classes/transaction-sending';

/**
 * For information on the API specification have a look at our swagger files located at http://localhost:5000/swagger/ when running the daemon
 */
@Injectable()
export class ApiService {
    constructor(private http: Http, private globalService: GlobalService) {};

    private headers = new Headers({'Content-Type': 'application/json'});
    private pollingInterval = 3000;
    private bitcoinApiUrl = 'http://localhost:37220/api';
    private currentApiUrl = 'http://localhost:37220/api';

    private getCurrentCoin() {
      let currentCoin = this.globalService.getCoinName();
      if (currentCoin === "Bitcoin" || currentCoin === "TestBitcoin") {
        this.currentApiUrl = this.bitcoinApiUrl;
      } 
    }

    /**
     * Gets available wallets at the default path
     */
     getWalletFiles(): Observable<any> {
      return this.http
        .get(this.bitcoinApiUrl + '/wallet/files')
        .map((response: Response) => response);
     }

     /**
      * Get a new mnemonic
      */
    getNewMnemonic(): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('language', 'English');
      params.set('wordCount', '12');

      return this.http
        .get(this.bitcoinApiUrl + '/wallet/mnemonic', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Create a new Bitcoin wallet.
     */
    createBitcoinWallet(data: WalletCreation): Observable<any> {
      return this.http
        .post(this.bitcoinApiUrl + '/wallet/create/', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Create a new Bitcoin wallet.
     */
    identifyWallet(data: WalletIdentification): Observable<any> {
      return this.http
        .post(this.bitcoinApiUrl + '/wallet/identify/', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Create a new Bitcoin wallet.
     */
    startMining(data: MiningStarting): Observable<any> {
      return this.http
        .post(this.bitcoinApiUrl + '/miner/startmining/', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    stopMining(data: MiningStoping): Observable<any> {
      return this.http
        .post(this.bitcoinApiUrl + '/miner/stopmining/', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Recover a Bitcoin wallet.
     */
    recoverBitcoinWallet(data: WalletRecovery): Observable<any> {
      return this.http
        .post(this.bitcoinApiUrl + '/wallet/recover/', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Load a Bitcoin wallet
     */
    loadBitcoinWallet(data: WalletLoad): Observable<any> {
      return this.http
        .post(this.bitcoinApiUrl + '/wallet/load/', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Get wallet status info from the API.
     */
    getWalletStatus(): Observable<any> {
      this.getCurrentCoin();

      return this.http
        .get(this.currentApiUrl + '/wallet/status')
        .map((response: Response) => response);
    }

    /**
     * Get general wallet info from the API once.
     */
    getGeneralInfoOnce(data: WalletInfo): Observable<any> {
      let params: URLSearchParams = new URLSearchParams();
      params.set('Name', data.walletName);

      return this.http
        .get(this.bitcoinApiUrl + '/wallet/general-info', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Get general wallet info from the API.
     */
    getGeneralInfo(data: WalletInfo): Observable<any> {
      this.getCurrentCoin();

      let params: URLSearchParams = new URLSearchParams();
      params.set('Name', data.walletName);

      return Observable
        .interval(this.pollingInterval)
        .startWith(0)
        .switchMap(() => this.http.get(this.currentApiUrl + '/wallet/general-info', new RequestOptions({headers: this.headers, search: params})))
        .map((response: Response) => response);
    }

    /**
     * Get wallet balance info from the API.
     */
    getWalletBalance(data: WalletInfo): Observable<any> {
      this.getCurrentCoin();

      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);

      return Observable
        .interval(this.pollingInterval)
        .startWith(0)
        .switchMap(() => this.http.get(this.currentApiUrl + '/wallet/balance', new RequestOptions({headers: this.headers, search: params})))
        .map((response: Response) => response);
    }

    /**
     * Get the maximum sendable amount for a given fee from the API
     */
    getMaximumBalance(data): Observable<any> {
      this.getCurrentCoin();

      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', "account 0");
      params.set('feeType', data.feeType);
      params.set('allowUnconfirmed', "true");

      return this.http
        .get(this.currentApiUrl + '/wallet/maxbalance', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Get a wallets transaction history info from the API.
     */
    getWalletHistory(data: WalletInfo): Observable<any> {
      this.getCurrentCoin();

      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);

      return Observable
        .interval(this.pollingInterval)
        .startWith(0)
        .switchMap(() => this.http.get(this.currentApiUrl + '/wallet/history', new RequestOptions({headers: this.headers, search: params})))
        .map((response: Response) => response);
    }

    /**
     * Get an unused receive address for a certain wallet from the API.
     */
    getUnusedReceiveAddress(data: WalletInfo): Observable<any> {
      this.getCurrentCoin();

      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', "account 0"); //temporary
      return this.http
        .get(this.currentApiUrl + '/wallet/unusedaddress', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Get multiple unused receive addresses for a certain wallet from the API.
     */
    getUnusedReceiveAddresses(data: WalletInfo, count: string): Observable<any> {
      this.getCurrentCoin();

      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', "account 0"); //temporary
      params.set('count', count);
      return this.http
        .get(this.currentApiUrl + '/wallet/unusedaddresses', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Get get all receive addresses for an account of a wallet from the API.
     */
    getAllReceiveAddresses(data: WalletInfo): Observable<any> {
      this.getCurrentCoin();

      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', "account 0"); //temporary
      return this.http
        .get(this.currentApiUrl + '/wallet/addresses', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Estimate the fee of a transaction
     */
    estimateFee(data: FeeEstimation): Observable<any> {
      this.getCurrentCoin();

      let params: URLSearchParams = new URLSearchParams();
      params.set('walletName', data.walletName);
      params.set('accountName', data.accountName);
      params.set('destinationAddress', data.destinationAddress);
      params.set('amount', data.amount);
      params.set('feeType', data.feeType);
      params.set('allowUnconfirmed', "true");

      return this.http
        .get(this.currentApiUrl + '/wallet/estimate-txfee', new RequestOptions({headers: this.headers, search: params}))
        .map((response: Response) => response);
    }

    /**
     * Build a transaction
     */
    buildTransaction(data: TransactionBuilding): Observable<any> {
      this.getCurrentCoin();

      return this.http
        .post(this.currentApiUrl + '/wallet/build-transaction', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Send transaction
     */
    sendTransaction(data: TransactionSending): Observable<any> {
      this.getCurrentCoin();

      return this.http
        .post(this.currentApiUrl + '/wallet/send-transaction', JSON.stringify(data), {headers: this.headers})
        .map((response: Response) => response);
    }

    /**
     * Send shutdown signal to the daemon
     */
    shutdownNode(): Observable<any> {
      this.getCurrentCoin();

      return this.http
        .post(this.currentApiUrl + '/node/shutdown', '')
        .map((response: Response) => response);
    }
}
