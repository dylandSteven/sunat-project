import { HttpClient } from '@angular/common/http';
import { Component, Inject, Injectable, Input } from '@angular/core';
import{Consult} from '../core/services/consults'
@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.sass'],
})
export class ConsultComponent {
  constructor(private http: HttpClient) {}
  fileContent: FileReader;
  file: any;
  text: string;
  lists: string[] = new Array();
  consult: Consult[] = new Array();
  fileChanged(e: Event) {
    const target = e.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    let fileReader = new FileReader();
    let prueba: any;
    fileReader.onload = (e) => {
      this.finalAnswer(fileReader.result);
      fileReader.result;
    };
    fileReader.readAsText(this.file);
  }

  finalAnswer(data: any) {
    this.text = data;
    const newText = data.split('\n');
    // this.lists.push(this.text);
    if (newText[newText.length - 1] == '') {
      newText.pop();
    }

    newText.forEach((element: any, index: number) => {
      // console.log(index, element);
      let newElement = element.split('|');
      this.consult.push(new Consult(newElement[10],newElement[5],newElement[6],newElement[2],newElement[3],newElement[24]))
    });

    console.log(this.consult)
  }
}
