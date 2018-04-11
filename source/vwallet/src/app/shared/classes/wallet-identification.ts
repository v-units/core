export class WalletIdentification {

  constructor(wallet: string, name: string, eMail: string, telephone: string, address: string, mnemonic: string) {
    this.wallet = wallet;
    this.name = name;
    this.eMail = eMail;
    this.telephone = telephone;
    this.address = address;
    this.mnemonic = mnemonic;
  }

  wallet: string;
  name: string;
  eMail: string;
  telephone: string;
  address: string;
  mnemonic: string;
}
