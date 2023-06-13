export class Consult {
  id: number;
  numRuc: string;
  codComp: string;
  numeroSerie: string;
  numero: string;
  fechaEmision: string;
  monto: string;

  constructor(
    id: number,
    numRuc: string,
    codComp: string,
    numeroSerie: string,
    numero: string,
    fechaEmision: string,
    monto: string
  ) {
    this.id = id;
    this.numRuc = numRuc;
    this.codComp = codComp;
    this.numeroSerie = numeroSerie;
    this.numero = numero;
    this.fechaEmision = fechaEmision;
    this.monto = monto;
  }


  getBody2() {
    return {
      numRuc: this.numRuc,
      codComp: this.codComp,
      numeroSerie: this.numeroSerie,
      numero: this.numero,
      fechaEmision: this.fechaEmision,
      monto: this.monto,
    }
  }getBody() {
    return {
      id: this.id+1,
      numRuc: this.numRuc,
      codComp: this.codComp,
      numeroSerie: this.numeroSerie,
      numero: this.numero,
      fechaEmision: this.fechaEmision,
      monto: this.monto,
    }
  }
}
