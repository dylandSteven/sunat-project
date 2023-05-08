import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { signInService } from 'src/app/core/services/signin-service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit  {

  formdata : FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.signInService;
    this.formdata = this.fb.group({
      clientId: [null],
      secretId: [null]
    })
  }

  onClickSubmit(formdata: any){
    // alert("Entered Email id : " +JSON.stringify(formdata.value.clientId));
    signInService.getConfig();
  }

}




