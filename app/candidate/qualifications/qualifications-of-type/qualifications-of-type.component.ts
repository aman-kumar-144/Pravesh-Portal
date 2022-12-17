import { Component, OnInit, Input, QueryList, ViewChildren } from '@angular/core';
import { QualificationComponent } from './qualification/qualification.component';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-qualifications-of-type',
  templateUrl: './qualifications-of-type.component.html',
  styleUrls: ['./qualifications-of-type.component.scss']
})

export class QualificationsOfTypeComponent implements OnInit {
  @Input() qualificationType !:  string;
  @ViewChildren(QualificationComponent) candidateQualificationsOfType !: QueryList<QualificationComponent>;
  verboseQualificationType = '';
  prerequisiteMessage = '';
  nqualifications = 0;
  qualificationsSaved = 0;
  verboseAttributes = new Map<string, any>();

  constructor(public globals: Globals) { 
    this.verboseAttributes.set('high_school', {verboseType: 'High School',
                                      message: ('High school qualifications are mandatory. ' +
                                                'The fields in bold are mandatory to be filled for any ' +
                                                'qualification you choose enter.')});

    this.verboseAttributes.set('under_graduate', {verboseType: 'Under-Graduate Degree',
                                      message: ('Under-Graduate qualifications are mandatory. Specific degrees may ' +
                                                'additionally be prerequisites for specific programs / domains of interest. Please ' +
                                                'refer to the program manual for details. ' +
                                                'The fields in bold are mandatory to be filled for any ' +
                                                'qualification you choose enter.')});

    this.verboseAttributes.set('post_graduate', {verboseType: 'Post-Graduate Degree',
                                      message: ('Post-Graduate qualifications are mandatory for the Ph.D program. Specific degrees may ' +
                                                'additionally be prerequisites for specific domains of interest. Please ' +
                                                'refer to the program manual for details. ' +
                                                'The fields in bold are mandatory to be filled for any ' +
                                                'qualification you choose enter.')});

    this.verboseAttributes.set('competetive_exam', {verboseType: 'Competitive Exam',
                                        message: ('Specific Competitive Exams may be prerequisites for specific domains of interest. ' +
                                                  'Please refer to the program manual for details. ' +
                                                  'The fields in bold are mandatory to be filled for any ' +
                                                  'qualification you choose enter.')});

    this.verboseAttributes.set('certification', {verboseType: 'Certification',
                                        message: ('Certifications are not mandatory. Add only those certifications if any, that you ' +
                                                  'think are relevant to the program and the area that you are applying for, from a ' +
                                                  'research perspective or as a preparatory qualification. ' +
                                                  'The fields in bold are mandatory to be filled for any ' +
                                                  'qualification you choose enter.')});

    this.verboseAttributes.set('diploma', {verboseType: 'Diploma',
                                       message: ('Diplomas are not mandatory. Add only those diplomas if any, that you ' +
                                                 'think are relevant to the program and the area that you are applying for, from a ' +
                                                 'research perspective or as a preparatory qualification. ' +
                                                 'The fields in bold are mandatory to be filled for any ' +
                                                 'qualification you choose enter.')});

  }
  
  ngOnInit(): void {
    const attributes = this.verboseAttributes.get(this.qualificationType);
    this.verboseQualificationType = attributes.verboseType;
    this.prerequisiteMessage = attributes.message;
    this.updateCount(true);
    this.nqualifications = this.qualificationsSaved;
  }

  updateCount(event: any) {
    if (event) {
      this.qualificationsSaved = this.globals.candidate?.countQualifications(this.qualificationType, this.globals.qualifications);
    }
  }

  qualificationArray(n: number): any[] {
    return Array(n);
  }

  addQualification() {
    if (this.nqualifications === this.qualificationsSaved) {
      this.nqualifications = this.qualificationsSaved + 1;
    }
  }

  qualificationName(index: any) {
    const qualification = this.globals.candidate?.findQualification(this.qualificationType, Number(index), this.globals.qualifications);
    return ((qualification) ? ((qualification.other && qualification.other !== '') ?
      qualification.other : this.globals.qualifications?.details(qualification.qualification).name) : '');
  }

  nothingToSave() {
    // returns true if there is nothing to save -- used by the router guard to alert if there are things to be saved when
    // going away from this form
    let savingNotRequired = true;
    this.candidateQualificationsOfType.forEach((qual) => {
      if (!qual.nothingToSave()) { savingNotRequired = false; }
    });
    return savingNotRequired;
  }
}
