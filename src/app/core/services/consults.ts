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
    return {
      token: 'syuIqRryIyu9CQYL3RmNPu8t9F0O7MpCF1NRhP2Ynqtdrjg8aZ73XsZdO3UR',
      tipo_comprobante: this.codComp,
      serie: this.numeroSerie,
      numero: this.numero,
      fecha_emision: this.fechaEmision,
      ruc_emisor: this.numRuc,
      monto: this.monto,
    };
  }
  getBody2() {
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
