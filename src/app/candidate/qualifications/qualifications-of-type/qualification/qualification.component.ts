import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { Globals } from 'src/app/globals';
import { SoochanaComponent } from 'src/app/soochana/soochana.component';
import { CandidateQualification } from 'src/app/models/application';

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.scss']
})

export class QualificationComponent implements OnInit {
  @Input() qualificationType !: string;
  @Input() verboseQualificationType !: string;
  @Input() index !: number;
  @ViewChild(SoochanaComponent, { static: true }) soochana !: SoochanaComponent;
  @ViewChild('certificate', { read: ElementRef, static: true }) certificateControl !: ElementRef;
  @ViewChild('saveButton', { read: ElementRef, static: false }) saveButton !: ElementRef
  @Output() saved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  qualificationForm !: FormGroup;
  idPrefix !: string;
  certificate !: File | null;
  certificateUrl = '';
  qualificationNames = null;
  qualification !: CandidateQualification;
  attributeArray !: Array<any>;
  showOther = false;

  constructor(
    private router: Router,
    public globals: Globals,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.idPrefix = (this.qualificationType + '-' + this.index);
    this.qualificationNames = this.globals.qualifications?.names(this.qualificationType);
    this.attributeArray = [
      {
        field: 'awarded_by', label: 'Awarded By',
        help: 'Institute / University / Board that Awarded this Qualification', type: 'text', required: (this.qualificationType !== 'competetive_exam')
      },
      {
        field: 'institution', label: 'Institution', type: 'text',
        help: 'The Institution (School, College, Institute) where you went through the requirements leading to this qualification.',
        required: false
      },
      {
        field: 'discipline', label: 'Discipline', type: 'text', help: 'Major / Subject in which this Qualification was obtained',
        required: true
      },
      {
        field: 'specialization', label: 'Specialization', type: 'text',
        help: 'Sub-Specialization / Stream / Minor in which you specialized, typically as reflected in your choice of electives / project.',
        required: false
      },
      {field: 'score', label: 'Score', type: 'number', help: 'CGPA / Normalized Absolute Marks (as %) / Raw Score', required: true},
      {
        field: 'rank', label: 'Rank', help: 'Rank obtained if any (particularly if it is in the top 10. Percentile if applicable.',
        required: false, type: 'number'
      },
      {field: 'year', label: 'Year', type: 'number', help: 'Year when the qualification was awarded.', required: true},
      {
        field: 'remarks', label: 'Remarks', type: 'text', help: ('Remarks that will be of help to the evaluation committee - ' +
          'special mentions, awards received, etc.'), required: false
      },
      {
        field: 'project_thesis_abstract', label: 'Project / Thesis Abstract', type: 'text',
        help: ('A short (at most 1000 characters) abstract of highlighting the key project / thesis carried out as part of this ' +
          'qualification. Please enter this is in plain text (without any special characters) into this box. Do not ' +
          'copy-paste from another formatted document (such as .docx /.ppt).'),
        required: false
      }
    ];
    this.qualificationForm = this.initQualification();
    this.fillForm();
  }

  showField(fld: string) {
    return ((fld === 'awarded_by' || fld === 'institution') ? (this.qualificationType !== 'competetive_exam') :
              ((fld === 'specialization' || fld === 'project_thesis_abstract') ?
                (this.qualificationType !== 'high_school' && this.qualificationType !== 'competetive_exam') : true));
  }

  qualificationChange() {
    const qid = this.qualificationForm.controls['qualification'].value;
    const qual = this.globals.qualifications?.details(Number(qid));
    this.showOther = (qual?.name.indexOf('Any Other') === 0);
    this.qualificationForm.controls['qualification'].markAsUntouched();
    this.qualificationForm.patchValue({
      other: (this.showOther ? this.qualification.other : null)
    });
  }

  getAwardedVyValidators() {
    return (this.qualificationType === 'competetive_exam') ?  [Validators.pattern(this.globals.smallplainText)] :
                                                  [Validators.required, Validators.pattern(this.globals.smallplainText)];
  }

  fillForm() {
    this.qualification = this.globals.candidate?.findQualification(this.qualificationType, Number(this.index), this.globals.qualifications);
    if (this.qualification) {
      this.qualificationForm.patchValue({
        qualification: this.qualification.qualification,
        other: this.qualification.other,
        awarded_by: this.qualification.awarded_by,
        institution: this.qualification.institution,
        discipline: this.qualification.discipline,
        specialization: this.qualification.specialization,
        score: this.qualification.score,
        rank: this.qualification.rank,
        year: this.qualification.year,
        project_thesis_abstract: this.qualification.project_thesis_abstract,
        remarks: this.qualification.remarks
      });
    }
    for (const field in this.qualificationForm.controls) {
      this.qualificationForm.controls[field].markAsUntouched();
    }
    this.qualificationChange();
  }


  initQualification(): FormGroup {
    return this.formBuilder.group({
      qualification: ['', Validators.compose([
        Validators.required
      ])],
      other: ['', Validators.compose([
        Validators.pattern(this.globals.emptySmallplainText)
      ])],
      awarded_by: ['', Validators.compose(this.getAwardedVyValidators())],
      institution: ['', Validators.compose([
        Validators.pattern(this.globals.emptySmallplainText)
      ])],
      discipline: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.smallplainText)
      ])],
      specialization: ['', Validators.compose([
        Validators.pattern(this.globals.emptySmallplainText)
      ])],
      score: ['', Validators.compose([
        Validators.required, Validators.min(0.0), Validators.max(1000.0), Validators.pattern(this.globals.floatPattern)
      ])],
      rank: ['', Validators.compose([
        Validators.min(0), Validators.pattern(this.globals.integerPattern), Validators.max(100)
      ])],
      year: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.integerPattern), Validators.min(this.globals.minYear),
        Validators.max(this.globals.thisYear)
      ])],
      remarks: ['', Validators.compose([
        Validators.pattern(this.globals.emptySmallplainText)
      ])],
      project_thesis_abstract: ['', Validators.compose([
        Validators.pattern(this.globals.plainText)
      ])]
    })
  }

  checkUpload(fileObj: File | null) {
    // Check If the File Selected is acceptible or not during every upload
    if(!this.globals.checkPdf(fileObj)) {
      fileObj = null;
      const message = "Upload Failed! Please Upload Valid Documents"
      this.soochana.info("Upload Failed", message, "Upload Failed")
    }
    else {
      const message = "File Upload was successful !"
      this.soochana.success("Upload Successful", message, "Upload Successful")
    }
  }

  certificateUpload(files: FileList | null) {
    if(files!=null) {
      this.certificate = files.item(0);
      this.checkUpload(this.certificate);
    }
  }

  save() {
    const formData: FormData = new FormData();
    for (const field in this.qualificationForm.controls) {
      if (this.qualificationForm.controls[field].touched) {
        formData.append(field, this.qualificationForm.controls[field].value);
      }
    }
    if (this.certificate) {
      formData.append('certificate', this.certificate, this.certificate?.name);
    }
  }

  returnSoochana(status: any) {
  }

  nothingToSave() {
    // returns true if there is nothing to save -- used by the router guard to alert if there are things to be saved when
    // going away from this form
    return this.saveButton.nativeElement.disabled;
  }

  remove() {
    this.soochana.confirm('confirmDeletion', 'Please confirm that you wish to delete this qualification from your list.');
  }
}
