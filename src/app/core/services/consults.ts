export class Consult
{
  rucEmisor: string;
  tipoComprobante:string;
  serie:string;
  numero:string;
  fechaEmision:string;
  importeTotal:string;

  constructor(rucEmisor: string,tipoComprobante:string,serie:string,numero:string, fechaEmision:string,importeTotal:string) {
    this.rucEmisor = rucEmisor;
    this.tipoComprobante = tipoComprobante;
    this.serie = serie;
    this.numero = numero;
    this.fechaEmision = fechaEmision;
    this.importeTotal = importeTotal;

  }

}
