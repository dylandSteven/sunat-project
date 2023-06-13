import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { Consult } from '../core/services/consults';
import { catchError, throwError } from 'rxjs';
import { SharedService } from '../core/services/sharedServices';
import { response } from '../core/services/response';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FileSaverService } from 'ngx-filesaver';
import * as $ from 'jquery'; // import Jquery here
import { consultList } from '../core/services/consults_list';
import * as _ from 'lodash';
import { DataResponse } from '../core/services/DataResponse';
import { Router } from '@angular/router';
@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.sass'],
})
export class ConsultComponent {
  constructor(
    private http: HttpClient,
    private filerSaver: FileSaverService,
    private shared: SharedService,
    private router: Router
  ) {}
  myMap = new Map<any, any>();
  configUrl = 'https://api.migo.pe/api/v1/cpe';
  message: string;
  stop = false;
  ruc: string = '20499709944';
  fileContent: FileReader;
  file: any;
  parts: any;
  text: string;
  valueProgress: number =0;
  listConsult: consultList = new consultList([]);
  API_KEY = history.state.data;
  results = new Array<response>();
  data = new Array();
  exportando: boolean = false;
  dataDivided = new Array();
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.API_KEY,
    }),
  };

  changeValue(value: any) {
    value = true;
  }

  ngOnInit() {
    if (this.API_KEY == undefined) {
      this.router.navigate(['signin']);
    }
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
      this.exportXLSX();
      this.changeValue(this.stop);
      console.error('An error occurred:', error.error);

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

  private makePost(data: any, numRuc: string, i: number) {
    return this.http
      .post<response>(
        'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/' +
          numRuc +
          '/validarcomprobante',
        data,
        this.httpOptions
      )
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

  fileChanged(e: Event) {
    const target = e.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.finalAnswer(fileReader.result);
    };
    fileReader.readAsText(this.file);
  }

  finalAnswer(data: any) {
    this.data = [];
    this.listConsult = new consultList([]);
    this.text = data;
    let newText = data.split('\n');
    if (newText[newText.length - 1] == '') {
      newText.pop();
    }
    let indice = 0;
    newText.forEach((element: any) => {
      let newElement = element.split('|');
      let number = Number(newElement[7]).toString();
      this.listConsult.push(
        new Consult(
          indice,
          newElement[10],
          newElement[5],
          newElement[6],
          number,
          newElement[3],
          newElement[24]
        )
      );
      indice++;
    });
    this.listConsult.getList().forEach((element) => {
      this.data.push(element.getBody2());
    });
    this.parts = this.splitListIntoParts(this.data, 800);
  }

  oneConsult() {
    this.http
      .post(
        'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/20606079932/validarcomprobante',
        {
          codComp: '01',
          numeroSerie: 'F001',
          numero: '446',
          fechaEmision: '10/04/2023',
          numRuc: '20606079932',
          monto: '0',
        },
        this.httpOptions
      )
      .subscribe((data) => {
        console.log(data);
      });

    this.http
      .post(
        'https://api.migo.pe/api/v1/cpe',
        {
          token: 'LW3hA7yHiPzp7iKNYp93RDdjD8lzjzCal8AudXLzpDxD9Cxl1lFfulabQPIR',
          ruc_emisor: '20499709944',
          tipo_comprobante: '01',
          serie: 'F001',
          numero: '446',
          fecha_emision: '10/04/2023',
          monto: '0.00',
        },
        this.httpOptions
      )
      .subscribe((data) => {
        console.log(data);
      });
  }
  delay = (ms: number | undefined) => new Promise((res) => setTimeout(res, ms));

  async sendData() {
    console.log('Enviando datos...');
    console.log(this.parts);
    try {
      for (let j = 0; j < this.data.length; j++) {
        this.exportando = true;
//function mathematica para que todas las partes al ser sumadas finalizar llegue a 100

        this.valueProgress += (100/this.data.length)
        if (this.stop == true) {
          break;
        }
        // for (let i = 0; i < this.parts[j].length; i++) {
        this.makePost(this.data[j], this.data[j].numRuc, j);
        console.log(this.valueProgress);
        await this.delay(300);
      }
    } catch (e) {
      alert('No hay data para enviar');
    }
    await this.delay(1000);
    this.exportando = false;

  }

  //example of generic function to make a request to the api and get the response and handle the error to cut the loop

  exportXLSX() {
    this.exportando = false;

    console.log('Exportando...');
    const sortedAsc = new Map([...this.myMap].sort((a, b) => a[0] - b[0]));
    let final = [{}];
    const Heading = [
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
    for (let [key, value] of sortedAsc) {
      final.push(
        $.extend(
          {},
          this.listConsult.getList()[key].getBody(),
          value.getObjet()
        )
      );
    }
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const worksheet = XLSX.utils.json_to_sheet(final);
    XLSX.utils.sheet_add_aoa(worksheet, Heading);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blobData = new Blob([excelBuffer], { type: EXCEL_TYPE });
    this.filerSaver.save(blobData, 'consultas' + EXCEL_EXTENSION);
  }
}
