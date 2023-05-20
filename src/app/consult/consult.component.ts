import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { Consult } from '../core/services/consults';
import { Observable, catchError, delay, retry, tap, throwError } from 'rxjs';
import { SharedService } from '../core/services/sharedServices';
import { response } from '../core/services/response';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FileSaverService } from 'ngx-filesaver';
import * as e from 'express';
import * as $ from 'jquery'; // import Jquery here
import { consultList } from '../core/services/consults_list';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.sass'],
})
export class ConsultComponent {
  constructor(private http: HttpClient, private filerSaver: FileSaverService) {}
  configUrl = 'https://api.migo.pe/api/v1/cpe';
  message: string;
  ruc: string = '20499709944';
  fileContent: FileReader;
  file: any;
  text: string;
  listConsult: consultList = new consultList([]);
  result: response[] = new Array();
  API_KEY = history.state.data;
   data = []=new Array();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.API_KEY,
    }),
  };

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
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

  fileChanged(e: Event) {
    const target = e.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      fileReader.result;
      this.finalAnswer(fileReader.result);
    };
    fileReader.readAsText(this.file);
  }

  finalAnswer(data: any) {
    this.listConsult = new consultList([]);
    this.text = data;
    const newText = data.split('\n');
    if (newText[newText.length - 1] == '') {
      newText.pop();
    }
    newText.forEach((element: any) => {
      let newElement = element.split('|');
      let number = newElement[2].replace('M', '');
      this.listConsult.push(
        new Consult(
          newElement[10],
          newElement[5],
          newElement[6],
          number,
          newElement[3],
          newElement[24]
        )
      );
      // this.consults.push(
      //   new Consult(
      //     newElement[10],
      //     newElement[5],
      //     newElement[6],
      //     number,
      //     newElement[3],
      //     newElement[24]
      //   )
      // );
    });
    this.listConsult.getList().forEach((element) => {
      this.data.push(element.getBody());
    });

    // console.log(this.consults);
  }

  sendData() {
    console.log(this.data);
    // this.listConsult.getList().forEach((element) => {
    //   let options = {
    //     method: 'POST',
    //     headers: {
    //       accept: 'application/json',
    //       'content-type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       token: 'syuIqRryIyu9CQYL3RmNPu8t9F0O7MpCF1NRhP2Ynqtdrjg8aZ73XsZdO3UR',
    //       ruc_emisor: element.numRuc,
    //       tipo_comprobante: element.codComp,
    //       serie: element.numeroSerie,
    //       numero: element.numero,
    //       fecha_emision: element.fechaEmision,
    //       monto: element.monto,
    //     }),
    //   };
    //   fetch('https://api.migo.pe/api/v1/cpe', options)
    //     .then((response) => response.json())
    //     .then((response) => console.log(response))
    //     .catch((err) => console.error(err));
    // });


    this.data.forEach((element) => {
      console.log(element);
      this.makePost(element);
      // this.http
      //   .post('https://api.migo.pe/api/v1/cpe', data, this.httpOptions)
      //   .pipe(retry(3), catchError(this.handleError))
      //   .subscribe((data) => {
      //     console.log(element);
      //     console.log(data);

      //     // this.result.push(data);
      //   });
    });
  }
  makePost(data: {}) {
    this.http
      .post('https://api.migo.pe/api/v1/cpe', data, this.httpOptions)
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        console.log(data);

        // this.result.push(data);
      });
  }
  tryMigo() {
    console.log('tryMigo');

    let data2 = [
      {
        token: 'syuIqRryIyu9CQYL3RmNPu8t9F0O7MpCF1NRhP2Ynqtdrjg8aZ73XsZdO3UR',
        ruc_emisor: '20499709944',
        tipo_comprobante: '01',
        serie: 'F001',
        numero: '446',
        fecha_emision: '10/04/2023',
        monto: '0.00',
      },
      {
        token: 'syuIqRryIyu9CQYL3RmNPu8t9F0O7MpCF1NRhP2Ynqtdrjg8aZ73XsZdO3UR',
        ruc_emisor: '20499709944',
        tipo_comprobante: '01',
        serie: 'F001',
        numero: '446',
        fecha_emision: '10/04/2023',
        monto: '0.00',
      },
      {
        token: 'syuIqRryIyu9CQYL3RmNPu8t9F0O7MpCF1NRhP2Ynqtdrjg8aZ73XsZdO3UR',
        ruc_emisor: '20499709944',
        tipo_comprobante: '01',
        serie: 'F001',
        numero: '446',
        fecha_emision: '10/04/2023',
        monto: '0.00',
      },
    ];
    let data = [
      {
        codComp: '01',
        numeroSerie: 'B002',
        numero: '92792',
        fechaEmision: '10/04/2023',
        numRuc: '20609060469',
        monto: '3.9',
      },
      {
        codComp: '01',
        numeroSerie: 'B002',
        numero: '92792',
        fechaEmision: '10/04/2023',
        numRuc: '20609060469',
        monto: '3.9',
      },
      {
        codComp: '01',
        numeroSerie: 'B002',
        numero: '92792',
        fechaEmision: '10/04/2023',
        numRuc: '20609060469',
        monto: '3.9',
      },
    ];
    data2.forEach((element) => {
      this.http
        .post('https://api.migo.pe/api/v1/cpe', element, this.httpOptions)
        .subscribe((data) => {
          console.log(data);
        });
    });
    data.forEach((element) => {
      this.http
        .post('https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/'+element.numRuc+'/validarcomprobante', element, this.httpOptions)
        .subscribe((data) => {
          console.log(data);
        });
    });
  }

  exportXLSX() {
    let final = [{}];
    // let consultObject: [{}] = [{}];
    // this.consults.forEach((element) => {
    //   consultObject.push(JSON.parse(element.getBody()));
    // });
    // if (Object.keys(consultObject[0])) {
    //   consultObject.shift();
    // }
    // consultObject.forEach((element, i) => {
    //   final.push($.extend({}, element, this.result[i]));
    // });

    this.listConsult.getList().forEach((element, i) => {
      {
        final.push($.extend({}, element.getBody(), this.result[i]));
      }
    });
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';

    const worksheet = XLSX.utils.json_to_sheet(final);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blobData = new Blob([excelBuffer], { type: EXCEL_TYPE });
    this.filerSaver.save(blobData, 'consultas' + EXCEL_EXTENSION);
  }
}
