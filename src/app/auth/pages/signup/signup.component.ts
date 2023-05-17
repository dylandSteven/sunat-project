import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignInService } from 'src/app/core/services/signIn-service';
import { SharedService } from 'src/app/core/services/sharedServices';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent {
  constructor(private http: HttpClient,private route:Router) {}
  service: SignInService=new SignInService(this.http,this.route,new SharedService());
  submit() {
    // this.service.getData('a','as').subscribe(data => {console.log(data);})
  }
}
