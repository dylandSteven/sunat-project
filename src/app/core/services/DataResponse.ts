export class DataResponse {
  estadoCp: string;
  observaciones: [];
  respuesta:string;
  constructor(estadoCp: string, observaciones: [],respuesta:string) {
    this.estadoCp = estadoCp;
    this.respuesta= respuesta;
    this.observaciones = observaciones;
  }
  getData(){
    return{
      "respuesta":this.respuesta,
      "observaciones":this.observaciones
    }
  }

}
