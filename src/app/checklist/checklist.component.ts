import { Component, OnInit } from '@angular/core';
import { Globals } from '../globals';
import { Program } from '../models/iiitb';
@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  callForMsPhdUrl !: string;
  callForMscdtUrl !: string;
  mscdt !: Program;

  constructor(public globals: Globals) { 
    this.callForMsPhdUrl = 'https://www.iiitb.ac.in/courses/master-of-science-by-researchdoctor-of-philosophy';
    this.callForMscdtUrl = 'https://www.iiitb.ac.in/courses/master-of-science-digital-society';
  }

  ngOnInit(): void {
    this.mscdt = this.globals.programs.program(this.globals.MSCDT);
  }

}
