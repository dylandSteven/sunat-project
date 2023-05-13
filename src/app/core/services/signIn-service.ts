import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class SignInService {
  client_id: string = '9ccff3ee-5775-405b-9871-7f1c27ac24e5';
  client_secret: string = '';
  scope: string = 'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes';
  grant_type: string = 'client_credentials';
  repos: any;
  configUrl =
    'https://api-seguridad.sunat.gob.pe/v1/clientesextranet/' +
    this.client_id +
    '/oauth2/token/';

  constructor(private http: HttpClient) {}

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

  getToken() {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set(
      'scope',
      'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes'
    );
    body.set('client_id', '9ccff3ee-5775-405b-9871-7f1c27ac24e5');
    body.set('client_secret', 'IXIkfiITQzb17jY42i0+YA==');

    let options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    };

    return this.http
      .post(this.configUrl, body, options)
      .pipe(catchError(this.handleError))
      .subscribe((data) => console.log(data));
  }

  getData(client_id: string, secret_id: string) {
    // this.client_id = client_id
    // this.client_secret = secret_id;
    // console.log(this.configUrl);
    return this.http.get(this.configUrl).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => console.log(err)
    );
  }
}
