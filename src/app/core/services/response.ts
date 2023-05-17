export class response{

  data:Object
  message:string
  success:boolean
  constructor(data:Object,message:string,success:boolean){
    this.data=data
    this.message=message
    this.success=success
  }
}
