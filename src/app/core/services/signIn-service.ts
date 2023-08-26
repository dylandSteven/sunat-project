import { EventEmitter, Injectable, Output } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Data } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from './sharedServices';
import { Entidad } from 'src/app/shared/models/entidad';
@Injectable()
export class SignInService {
  client_id: string = '90ee27c1-08e6-4771-addd-fdbe94881b67';
  client_secret: string = '';
  scope: string = 'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes';
  grant_type: string = 'client_credentials';
  configUrl =
    'https://api-seguridad.sunat.gob.pe/v1/clientesextranet/' +
    this.client_id +
    '/oauth2/token/';

  constructor(
    private http: HttpClient,
    private router: Router,
    private shared: SharedService
  ) {}
  @Output() login = new EventEmitter<string>();

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
  // @Output() token: EventEmitter<any> = new EventEmitter();
  @Output() numRuc: EventEmitter<any> = new EventEmitter();

  async getToken(entidad: Entidad, bool: boolean) {
    const body = new URLSearchParams();
    body.set('grant_type', 'client_credentials');
    body.set(
      'scope',
      'https://api.sunat.gob.pe/v1/contribuyente/contribuyentes'
    );
    body.set('client_id', entidad.id);
    body.set('client_secret', entidad.clave);

    let options = {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
    };
    return this.http
      .post<Data>('https://api-seguridad.sunat.gob.pe/v1/clientesextranet/' +
      entidad.id +
      '/oauth2/token/', body, options)
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        console.log(data['access_token']);
        console.log(bool);

        if (data['access_token']) {
          // this.login.emit(data['access_token']);
          // if (bool == true) {
            this.numRuc.emit(entidad.ruc),
            this.router.navigate(['consult'], {
              state: { data: data['access_token'], numRuc: entidad.ruc,name:entidad.name },
            });
          // } else {
          //   this.router.navigate(['consult'], {
          //     state: { data: data['access_token'] },
          //   });
          // }

          this.shared.setToken(data['access_token']);
          // this.numRuc.emit(this.shared.getNumRuc());
        }
      });
  }
  getData(client_id: string, secret_id: string) {
    return this.http.get(this.configUrl).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => console.log(err)
    );
  }
}
