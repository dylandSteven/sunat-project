import { DataResponse } from "./DataResponse";


export class response {
  data: DataResponse;
  message: string;
  success: boolean;
  constructor(data: DataResponse, message: string, success: boolean) {
    this.data = data;
    this.message = message;
    this.success = success;
  }

  getObjet() {
    return this.data.getData()
  }
}
