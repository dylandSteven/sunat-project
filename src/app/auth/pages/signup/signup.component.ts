import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SignInService } from 'src/app/core/services/signIn-service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent {
  constructor(private http: HttpClient) {}
  service: SignInService=new SignInService(this.http);
  submit() {
    // this.service.getData('a','as').subscribe(data => {console.log(data);})
  }
}
