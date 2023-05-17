import{Injectable} from '@angular/core';
@Injectable({
  providedIn:'root'
})
export class SharedService{
  token:string
  constructor(){}
  setToken(token:string){ this.token=token}
  getToken(){return this.token}
}
