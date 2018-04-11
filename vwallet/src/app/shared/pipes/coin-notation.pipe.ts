import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Pipe({
  name: 'coinNotation'
})
export class CoinNotationPipe implements PipeTransform {
  constructor (private globalService: GlobalService) {
    this.setCoinUnit();
  }

  private coinUnit: string;
  private coinNotation: number;
  private decimalLimit = 2;

  transform(value: number): number {
    let temp;
    if (typeof value === 'number') {
      switch (this.getCoinUnit()) {
        case "VU":
          temp = value / 100000000;
          return temp.toFixed(this.decimalLimit);
        case "TVU":
          temp = value / 100000000;
          return temp.toFixed(this.decimalLimit);
      }
    }
  }

  getCoinUnit() {
    return this.coinUnit;
  }

  setCoinUnit() {
    this.coinUnit = this.globalService.getCoinUnit();
  };
}


