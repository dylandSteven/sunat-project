import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SignInService } from 'src/app/core/services/signIn-service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/core/services/sharedServices';
import { Entidad } from 'src/app/shared/models/entidad';
import { FloatLabelType } from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  @Output() isComprobante: EventEmitter<boolean> = new EventEmitter();


  service: SignInService = new SignInService(
    this.http,
    this.router,
    new SharedService()
  );


  data: Entidad[] = [
    {
      name: 'GRUPO VEGA DISTRIBUTION SAC',
      id: '9ccff3ee-5775-405b-9871-7f1c27ac24e5',
      clave: 'IXIkfiITQzb17jY42i0+YA==',
      ruc: '20499709944',
    },
    {
      name: 'TRANSPORTES INTERVEGA SAC',
      id: 'f28d84d8-1b7b-4862-b3e7-aaca209c83f3',
      clave: 'j9eEdHejLv8b9Lp1zRNLeg==',
      ruc: '20508153822',
    },
    {
      name: 'CORPORACION VEGA S.A.C.',
      id: '1772b74c-744e-48b7-a2a6-af106493e3cc',
      clave: 'Z5aLZ115BW0ytKQu4irHbA==',
      ruc: '20502257987',
    },
    {
      name: 'VEGA ALLNES S.A.C.',
      id: '8333dc1f-6125-4842-861f-83a01be054c8',
      clave: '4EweLttNwBCyk+GoY1fe1A==',
      ruc: '20607096580',
    },
    {
      name: 'RESTAURANT JUANITA EIRL',
      id: 'd2fc61ea-1677-47e2-bcd8-81495afb131a',
      clave: '2Vlxmm4XFG0JX99XRCj9Kw==',
      ruc: '20608018540',
    },
    {
      name: 'RADAR365 SAC',
      id: '6ee0b9c8-55e0-4b39-8b1a-a91819193620',
      clave: '4S23tZvk4lIYmEWOcH29Kg==',
      ruc: '20606079932',
    },
    {
      name: 'INCO BRANDS PERU SA',
      id: 'ff4d0860-07b5-412a-a83d-c7ab2a03e6b5',
      clave: '1bsS938LPxpaFZlGA5q/FQ==',
      ruc: '20554789456',
    },
    {
      name: 'INMOVEG PERU SAC',
      id: 'f8ece267-8a37-4124-9a3c-25ac81175303',
      clave: 'gubRUb3WYHZyiD4F8315Mg==',
      ruc: '20478734957',
    },
    {
      name: 'DISTRIBUIDORA E IMPORTADORA INTERVEGA SAC',
      id: '56d63b46-c5a5-423f-a7b6-6fce2de09efd',
      clave: 'e3b6PfojNslVPkujoDlrSQ==',
      ruc: '20602710468',
    },
    {
      name: 'VEGA MANAGEMENT SAC',
      id: '75126ceb-44b4-4ccd-9114-e8eefb85451b',
      clave: '39+SMuC49PjOMCv0K+mwmw==',
      ruc: '20607259608',
    },
    {
      name: 'RR & HG MARKET S.A.C.',
      id: 'c1a42d97-2852-4dd7-b90c-e7b7d7794e12',
      clave: '3efnk9wr8DUP2f7Tc0Eo0Q==',
      ruc: '20609060469',
    },
  ];
  formdata!: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);

  ngOnInit(): void {
    this.formdata = this.fb.group({
      // numRuc: [null],
      selected2: [null],
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
      // rucEmisor: [null],
    });
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  onClickSubmit(formdata: any) {

    var clientid = 'c04864ce-f454-48e1-b41d-8730e575b905';
    console.log(this.formdata)
    this.service.getToken(this.formdata.value.selected2,this.formdata.value.hideRequired)

  }


  goCompras(){
    this.isComprobante.emit(true);
    this.router.navigate(["consult"],{state:{existRuc:true}});

  }
  goVentas(){
    this.isComprobante.emit(false);
    this.router.navigate(["/consult"]);
    this.router.navigate(["consult"],{state:{existRuc:false}});

  }
}
