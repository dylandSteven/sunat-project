import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { Consult } from '../core/services/consults';
import { Observable, catchError, retry, tap, throwError } from 'rxjs';
import { SharedService } from '../core/services/sharedServices';
import { response } from '../core/services/response';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { FileSaverService } from 'ngx-filesaver';
import * as e from 'express';
import * as $ from 'jquery'; // import Jquery here

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.sass'],
})
export class ConsultComponent {
  constructor(private http: HttpClient, private filerSaver: FileSaverService) {}
  message: string;
  ruc: string = '20499709944';
  fileContent: FileReader;
  file: any;
  text: string;
  consults: Consult[] = new Array();
  result: response[] = new Array();

  API_KEY = history.state.data;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.API_KEY,
    }),
  };

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
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
    this.consults = [];
    this.text = data;
    const newText = data.split('\n');
    if (newText[newText.length - 1] == '') {
      newText.pop();
    }
    newText.forEach((element: any, index: number) => {
      let newElement = element.split('|');
      let number = newElement[2].replace('M', '');
      this.consults.push(
        new Consult(
          newElement[10],
          newElement[5],
          newElement[6],
          number,
          newElement[3],
          newElement[24]
        )
      );
    });
  }

  makeConsult() {
    this.result = [];

    this.consults.forEach((element) => {
      let configUrl =
        'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/' +
        element.numRuc +
        '/validarcomprobante';
      this.http
        .post<response>(configUrl, element.getBody(), this.httpOptions)
        .pipe(retry(3), catchError(this.handleError))
        .subscribe((data) => {
          this.result.push(data);
        });
    });
  }

  exportXLSX() {
    let final = [{}];
    console.log(this.result);
    console.log(this.consults);
    this.consults.forEach((element, i) => {
      {
        final.push($.extend({}, JSON.parse(element.getBody()), this.result[i]));
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
