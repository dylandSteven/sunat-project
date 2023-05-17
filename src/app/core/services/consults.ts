export class Consult {
  numRuc: string;
  codComp: string;
  numeroSerie: string;
  numero: string;
  fechaEmision: string;
  monto: string;

  constructor(
    numRuc: string,
    codComp: string,
    numeroSerie: string,
    numero: string,
    fechaEmision: string,
    monto: string
  ) {
    this.numRuc = numRuc;
    this.codComp = codComp;
    this.numeroSerie = numeroSerie;
    this.numero = numero;
    this.fechaEmision = fechaEmision;
    this.monto = monto;
  }

  getBody() {
    return JSON.stringify({
      codComp: this.codComp,
      numeroSerie: this.numeroSerie,
      numero: this.numero,
      fechaEmision: this.fechaEmision,
      numRuc: this.numRuc,
      monto: this.monto,
    });
  }
}
