import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { Consult } from '../core/services/consults';
import { Observable, catchError, throwError } from 'rxjs';
import { SharedService } from '../core/services/sharedServices';
import { response } from '../core/services/response';
@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.sass'],
})
export class ConsultComponent {
  constructor(private http: HttpClient, private sharedService: SharedService) {}
  message: string;
  ruc: string = '20499709944';
  fileContent: FileReader;
  file: any;
  text: string;
  lists: string[] = new Array();
  consults: Consult[] = new Array();
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
    let prueba: any;
    fileReader.onload = (e) => {
      this.finalAnswer(fileReader.result);
      fileReader.result;
    };
    fileReader.readAsText(this.file);
  }

  finalAnswer(data: any) {
    this.text = data;
    const newText = data.split('\n');
    // this.lists.push(this.text);
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
      console.log(this.consults);
    });
  }

  makeConsult() {
    this.consults.forEach((element) => {
      let configUrl =
        'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes/' +
        element.numRuc +
        '/validarcomprobante';
      this.http
        .post(configUrl, element.getBody(), this.httpOptions)
        .pipe(catchError(this.handleError))
        .subscribe((data) => console.log(data));
    });
  }

  oneConsult(configUrl: string, body: any) {
    return this.http
      .post<response>(configUrl, body, this.httpOptions)
      .pipe(catchError(this.handleError))
      .subscribe((data) => console.log(data.message));
  }
}
