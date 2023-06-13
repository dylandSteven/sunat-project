import{Injectable} from '@angular/core';
@Injectable({
  providedIn:'root'
})
export class SharedService{
  token:string
  errorId:number
  constructor(){}
  setToken(token:string){ this.token=token}
  getToken(){return this.token}
  setErrorId(errorId:number){this.errorId=errorId}
  getErrorId(){return this.errorId}
}
