import { Component, OnInit, ViewChild } from '@angular/core';
import { QualificationsOfTypeComponent } from './qualifications-of-type/qualifications-of-type.component';
@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.component.html',
  styleUrls: ['./qualifications.component.scss']
})
export class QualificationsComponent implements OnInit {
  @ViewChild('high_school', { static: true }) high_school !: QualificationsOfTypeComponent;
  @ViewChild('under_graduate', { static: true }) under_graduate !: QualificationsOfTypeComponent;
  @ViewChild('post_graduate', { static: true }) post_graduate !: QualificationsOfTypeComponent;
  @ViewChild('competetive_exam', { static: true }) competetive_exam !: QualificationsOfTypeComponent;
  @ViewChild('certification', { static: true }) certification !: QualificationsOfTypeComponent;
  @ViewChild('diploma', { static: true }) diploma !: QualificationsOfTypeComponent;
  constructor() { }

  ngOnInit(): void {
  }

  nothingToSave() {
    // returns true if there is nothing to save -- used by the router guard to alert if there are things to be saved when
    // going away from this form
    return (this.high_school.nothingToSave() && this.under_graduate.nothingToSave() && this.post_graduate.nothingToSave() &&
            this.competetive_exam.nothingToSave() && this.certification.nothingToSave() && this.diploma.nothingToSave());
  }

}
