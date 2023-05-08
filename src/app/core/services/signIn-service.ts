import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';




@Injectable()
export class signInService {


  constructor(private http: HttpClient) { }
  configUrl = 'https://api-seguridad.sunat.gob.pe/v1/clientesextranet/c04864ce-f454-48e1-b41d-8730e575b905/oauth2/token/';


  getConfig() {
    return this.http.get(this.configUrl);
  }

}
