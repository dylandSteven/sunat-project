import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { Consult } from '../core/services/consults';
import { catchError, elementAt, throwError, timer } from 'rxjs';
import { SharedService } from '../core/services/sharedServices';
import { response } from '../core/services/response';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import * as $ from 'jquery'; // import Jquery here
import { consultList } from '../core/services/consults_list';
import { DataResponse } from '../core/services/DataResponse';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogAnimationsExampleDialog } from '../core/services/Dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.sass'],
})
export class ConsultComponent {
  amount: number = 0;
  constructor(
    private http: HttpClient,
    private filerSaver: FileSaverService,
    public dialog: MatDialog,
    private shared: SharedService,
    private router: Router
  ) {}
  myMap = new Map<any, any>();
  configUrl = 'https://api.migo.pe/api/v1/cpe';
  message: string;
  stop = false;
  exportando: boolean = false;
  fileContent: FileReader;
  isLoading: boolean = false;
  file: any;
  parts: any;
  text: string;
  existRuc = history.state.numRuc;
  numRuc = history.state.numRuc;
  nameCompany = history.state.name;
  API_KEY = history.state.data;
  valueProgress: number = 0;
  listConsult: consultList = new consultList([]);
  results = new Array<response>();
  data = new Array();
  dataDivided = new Array();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.API_KEY,
    }),
  };
  Heading = [
    [
      'Indice',
      'Ruc Emisor',
      'Tipo de comprobante',
      'Serie',
      'Numero',
      'Fecha de emision',
      'Importe Total ',
      'Respuesta Sunat',
    ],
  ];
  ngOnInit() {
    console.log(this.API_KEY, this.numRuc);
    if (this.API_KEY == undefined) {
      this.router.navigate(['signin']);
    }
    timer(600000).subscribe(() => {
      this.exportXLSX();
    });
  }
  private splitListIntoParts<Consult>(list: any, size: number): Consult[][] {
    const result: Consult[][] = [];
    for (let i = 0; i < list.length; i += size) {
      const part = list.slice(i, i + size);
      result.push(part);
    }
    return result;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      alert('An error occurred:' + error.error);
      this.stop = true;
      console.error('An error occurred:', error.error);
      this.cancel();
      if (this.stop == true) {
        console.log('stop');
      } else {
        console.log('continue');
      }
    } else if (error.status === 401) {
      console.log('Unauthorized');
      this.router.navigate(['signin']);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }

  private async makePost(data: any, numRuc: string, i: number) {
    let montoDouble = Number(data['monto']);
    if (montoDouble < 0) {
      montoDouble = montoDouble * -1;
      data['monto'] = montoDouble.toString();
    }

    const apiUrl = numRuc
      ? 'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/' +
        numRuc +
        '/validarcomprobante'
      : 'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/' +
        data.numRuc +
        '/validarcomprobante';

    return this.http
      .post<response>(apiUrl, data, this.httpOptions)
      .pipe(catchError(this.handleError))
      .subscribe((res) => {
        console.log(i, res);
        if (res.message == 'Operation Success! ') {
          res.message = 'Operación exitosa';
          let respuesta: string;
          let estado = res.data.estadoCp;
          switch (estado) {
            case '0':
              respuesta = 'NO EXISTE';
              break;
            case '1':
              respuesta = 'ACEPTADO';
              break;
            case '2':
              respuesta = 'ANULADO';
              break;
            case '3':
              respuesta = 'AUTORIZADO';
              break;
            case '4':
              respuesta = 'NO AUTORIZADO';
              break;
            default:
              respuesta = 'NO EXISTE';
              break;
          }
          this.myMap.set(
            i,
            new response(
              new DataResponse(
                res.data.estadoCp,
                res.data.observaciones,
                respuesta
              ),
              res.message,
              res.success
            )
          );
        }
      });
  }

  // private async makePost(data: any, numRuc: string, i: number) {
  //   let montoDouble = Number(data['monto']);
  //   if (montoDouble < 0) {
  //     montoDouble = montoDouble * -1;
  //     data['monto'] = montoDouble.toString();
  //   }

  //   if (numRuc == undefined) {
  //     console.log(data);
  //     return await this.http
  //       .post<response>(
  //         'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/' +
  //           data.numRuc +
  //           '/validarcomprobante',
  //         data,
  //         this.httpOptions
  //       )
  //       .pipe(catchError(this.handleError))
  //       .subscribe((res) => {
  //         console.log(i, res);
  //         if (res.message == 'Operation Success! ') {
  //           res.message = 'Operación exitosa';
  //           let respuesta: string;
  //           let estado = res.data.estadoCp;
  //           switch (estado) {
  //             case '0':
  //               respuesta = 'NO EXISTE';
  //               break;
  //             case '1':
  //               respuesta = 'ACEPTADO';
  //               break;
  //             case '2':
  //               respuesta = 'ANULADO';
  //               break;
  //             case '3':
  //               respuesta = 'AUTORIZADO';
  //               break;
  //             case '4':
  //               respuesta = 'NO AUTORIZADO';
  //               break;
  //             default:
  //               respuesta = 'NO EXISTE';
  //               break;
  //           }
  //           this.myMap.set(
  //             i,
  //             new response(
  //               new DataResponse(
  //                 res.data.estadoCp,
  //                 res.data.observaciones,
  //                 respuesta
  //               ),
  //               res.message,
  //               res.success
  //             )
  //           );
  //         }
  //       });
  //   } else {
  //     return await this.http
  //       .post<response>(
  //         'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/' +
  //           numRuc +
  //           '/validarcomprobante',
  //         data,
  //         this.httpOptions
  //       )
  //       .pipe(catchError(this.handleError))
  //       .subscribe((res) => {
  //         console.log(i, res);
  //         if (res.message == 'Operation Success! ') {
  //           res.message = 'Operación exitosa';
  //           let respuesta: string;
  //           let estado = res.data.estadoCp;
  //           switch (estado) {
  //             case '0':
  //               respuesta = 'NO EXISTE';
  //               break;
  //             case '1':
  //               respuesta = 'ACEPTADO';
  //               break;
  //             case '2':
  //               respuesta = 'ANULADO';
  //               break;
  //             case '3':
  //               respuesta = 'AUTORIZADO';
  //               break;
  //             case '4':
  //               respuesta = 'NO AUTORIZADO';
  //               break;
  //             default:
  //               respuesta = 'NO EXISTE';
  //               break;
  //           }
  //           this.myMap.set(
  //             i,
  //             new response(
  //               new DataResponse(
  //                 res.data.estadoCp,
  //                 res.data.observaciones,
  //                 respuesta
  //               ),
  //               res.message,
  //               res.success
  //             )
  //           );
  //         }
  //       });
  //   }
  // }

  fileChanged(e: any) {
    type AOA = any[][];
    const target: DataTransfer = <DataTransfer>e.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      /* save data */
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.finalAnswerXlsx(this.data);
    };
    reader.readAsBinaryString(target.files[0]);

    // this.isLoading = true;
    // const target = e.target as HTMLInputElement;
    // this.file = (target.files as FileList)[0];
    // let fileReader = new FileReader();
    // fileReader.onload = (e) => {
    //   this.finalAnswer(fileReader.result);
    // };
    // fileReader.readAsText(this.file);
  }

  finalAnswerXlsx(data: any) {
    let indice = 0;
    this.data = [];
    this.listConsult = new consultList([]);
    console.log(this.listConsult);

    data.shift();
    data.forEach((element: any) => {
      let codComp = element[2].toString().padStart(2, '0');
      // console.log(typeof codComp)
      console.log(typeof element[5]);
      let date = element[5];
      if (typeof date == 'number') {
        date = new Date((date - (25567 + 1)) * 86400 * 1000)
          .toISOString()
          .split('T')[0];
        date = new Date(date);
        date = formatDate(date, 'dd/MM/yyyy', 'en-US');
      }
      if (this.numRuc == undefined || !this.existRuc) {
        this.numRuc = element[1].toString();
      }
      this.listConsult.push(
        new Consult(
          indice,
          this.numRuc,
          codComp.toString(),
          element[3].toString(),
          element[4].toString(),
          date,
          element[6].toString()
        )
      );
      indice++;
    });
    this.listConsult.getList().forEach((element) => {
      this.data.push(element.getBody());
    });
    this.parts = this.splitListIntoParts(this.data, 800);

    console.log(this.listConsult);
  }

  // finalAnswerTxt(data: any) {
  //   this.data = [];
  //   this.listConsult = new consultList([]);
  //   this.text = data;
  //   let newText = data.split('\n');
  //   if (newText[newText.length - 1] == '') {
  //     newText.pop();
  //   }
  //   let indice = 0;
  //   let listRepeats: string[] = [];

  //   newText.forEach((element: any) => {
  //     let newElement = element.split('|');
  //     listRepeats.push(newElement[7]);
  //   });

  //   newText.forEach((element: any) => {
  //     let newElement = element.split('|');
  //     let number = Number(newElement[7]).toString();
  //     let importeTotal = '';
  //     let montoDouble = 0;
  //     let currency = '';
  //     let tipoComprobante = '';
  //     let serie = '';
  //     let fechaEmision = '';

  //     if (listRepeats.every((val, i, arr) => val === arr[0])) {
  //       number = Number(newElement[8]).toString();
  //     }
  //     if (newElement.length == 36) {
  //       importeTotal = newElement[24];
  //       currency = newElement[25];
  //     } else if (newElement.length == 42) {
  //       console.log(newElement[22]);
  //       console.log(newElement[23]);
  //       importeTotal = newElement[22];
  //       currency = newElement[23];
  //     } else if (newElement.length == 7) {
  //       this.numRuc = newElement[1];
  //       tipoComprobante = newElement[2];
  //       serie = newElement[3];
  //       number = newElement[4];
  //       fechaEmision = newElement[5];
  //       importeTotal = newElement[6];
  //     } else {
  //       importeTotal = newElement[23];
  //       currency = newElement[24];
  //     }
  //     if (this.numRuc == undefined || !this.existRuc) {
  //       this.numRuc = newElement[10];
  //     }
  //     if (currency == 'USD') {
  //       montoDouble = Number(importeTotal);
  //       montoDouble =
  //         montoDouble * newElement[Number(newElement.indexOf(currency)) + 1];
  //       importeTotal = montoDouble.toString();
  //     }

  //     console.log(
  //       indice,
  //       this.numRuc,
  //       tipoComprobante,
  //       serie,
  //       number,
  //       fechaEmision,
  //       importeTotal
  //     );
  //     this.listConsult.push(
  //       new Consult(
  //         indice,
  //         this.numRuc,
  //         tipoComprobante,
  //         serie,
  //         number,
  //         fechaEmision,
  //         importeTotal
  //       )
  //     );
  //     indice++;
  //   });
  //   this.isLoading = false;
  //   console.log(this.listConsult);
  //   this.listConsult.getList().forEach((element) => {
  //     this.data.push(element.getBody());
  //   });
  //   this.parts = this.splitListIntoParts(this.data, 800);
  //   console.log(this.data);
  // }

  delay = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms));

  async sendData() {
    this.valueProgress = 0;
    console.log('Enviando datos...');
    console.log(this.parts);
    try {
      for (let j = 0; j < this.data.length; j++) {
        this.exportando = true;
        this.valueProgress += 100 / this.data.length;
        if (this.stop) {
          break;
        }
        await this.makePost(this.data[j], this.numRuc, j);
        console.log(this.numRuc);

        await this.delay(300);
      }
    } catch (e) {
      alert('No hay data para enviar');
    }
    await this.delay(1000);
    this.exportando = false;
  }
  extraerColumna(matriz: number[], indiceColumna: number): number[] {
    return matriz.map((fila) => fila);
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  async cancel() {
    this.exportando = false;
    await this.delay(1000);
    this.valueProgress = 0;
    this.stop = true;
    window.location.reload();
  }

  exportXLSX() {
    this.exportando = false;
    console.log('Exportando...');
    const sortedAsc = new Map([...this.myMap].sort((a, b) => a[0] - b[0]));
    let final = [{}];

    for (let [key, value] of sortedAsc) {
      final.push(
        $.extend(
          {},
          this.listConsult.getList()[key].getBodyWithIndice(),
          value.getObjet()
        )
      );
    }
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const worksheet = XLSX.utils.json_to_sheet(final);
    XLSX.utils.sheet_add_aoa(worksheet, this.Heading);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blobData = new Blob([excelBuffer], { type: EXCEL_TYPE });
    this.filerSaver.save(blobData, 'consultas' + EXCEL_EXTENSION);
  }

  goCompras() {
    this.router.navigate(['/consult']);
    this.existRuc = false;
  }
  goVentas() {
    this.existRuc = true;
  }
}
