import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { Consult } from '../core/services/consults';
import { catchError, throwError, timer } from 'rxjs';
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

  private makePost(data: any, numRuc: string, i: number) {
    console.log(data);
    if (numRuc == undefined) {
      console.log(data);
      return this.http
        .post<response>(
          'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/' +
            data.numRuc +
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
    } else {
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
  }

  fileChanged(e: Event) {
    this.isLoading = true;
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
      if (this.numRuc == undefined || !this.existRuc) {
        this.numRuc = newElement[10];
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
      } else {
        this.listConsult.push(
          new Consult(
            indice,
            this.numRuc,
            newElement[5],
            newElement[6],
            number,
            newElement[3],
            newElement[24]
          )
        );
      }
      indice++;
    });
    this.isLoading = false;
    this.listConsult.getList().forEach((element) => {
      this.data.push(element.getBody());
    });
    this.parts = this.splitListIntoParts(this.data, 800);
  }

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
        if (this.existRuc) {
        await  this.makePost(this.data[j], this.numRuc, j);
        } else {
          console.log(this.data[j]);
          await this.makePost(this.data[j], this.data[j][10], j);
        }
        await this.delay(300);
      }
    } catch (e) {
      alert('No hay data para enviar');
    }
    await this.delay(1000);
    this.exportando = false;
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
