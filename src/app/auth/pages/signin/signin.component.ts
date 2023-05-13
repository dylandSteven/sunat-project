import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SignInService } from 'src/app/core/services/signIn-service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit  {
  constructor(private fb: FormBuilder,private http: HttpClient) {}

  service: SignInService = new SignInService(this.http);

  formdata! : FormGroup



  ngOnInit(): void {
    this.formdata = this.fb.group({
      clientId: [null],
      secretId: [null]
    })
  }

  onClickSubmit(formdata: any){
    var clientid='c04864ce-f454-48e1-b41d-8730e575b905'
    // alert("Entered Email id : " +JSON.stringify(formdata.value.clientId));
    this.service.getToken()
  }

}




