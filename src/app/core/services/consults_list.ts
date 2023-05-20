import { Consult } from './consults';

export class consultList {
  consults: Consult[] = new Array();
  constructor(consults: Consult[]) {
    this.consults = consults;
  }
  getList() {
    return this.consults;
  }
  push(consult: Consult) {
    this.consults.push(consult);
  }
}
