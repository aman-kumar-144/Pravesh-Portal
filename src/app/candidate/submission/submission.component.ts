import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/globals';
import { SoochanaComponent } from 'src/app/soochana/soochana.component';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {
  @ViewChild(SoochanaComponent, { static: true }) soochana !: SoochanaComponent;

  constructor(public globals: Globals) { }

  ngOnInit(): void {
  }

  submit() {
    const message = ('Please confirm that you want to submit the application. Please note that all the current unsaved changes if any will be lost. ' +
    'Please make sure all changes have been saved before the application is submitted. Also you will not be in a position to make ' +
    'changes to your applicaton post the submission.');
    this.soochana.confirm('submission', message);
  }

}
