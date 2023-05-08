import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './auth/pages/signin/signin.component';
import { SignupComponent } from './auth/pages/signup/signup.component';
import { ConsultComponent } from './consult/consult.component';

const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  {path: "signup", component:SignupComponent},
  {path: "signin", component:SigninComponent},
  {path: "consult", component:ConsultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
