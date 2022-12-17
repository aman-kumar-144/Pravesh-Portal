import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SoochanaComponent } from 'src/app/soochana/soochana.component';
import { Recommendation } from 'src/app/models/application';
import { Globals } from 'src/app/globals';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss']
})

export class RecommendationComponent implements OnInit {
  @ViewChild(SoochanaComponent, { static: true }) soochana !: SoochanaComponent;
  @ViewChild('saveButton', { read: ElementRef, static: false }) saveButton !: ElementRef;
  @Input() index !: number;
  @Output() saved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  identityForm !: FormGroup;
  professionalForm !: FormGroup;
  statusForm !: FormGroup;
  recommendation !: Recommendation;
  alreadyFrozen = false;

  titles = ['Dr.', 'Ms.', 'Mr.', 'Mrs.'];

  identityArray: Array<any> = [
    { field: 'email', label: 'Email', required: true,
      help: 'Email on which the recommender can be contacted.' },
    { field: 'full_name', label: 'Full Name', required: true,
      help: 'Full Name of the Recommender.' },
    { field: 'phone', label: 'Phone', required: true,
      help: ('Phone number at which the recommender can be contacted if necessary.' +
             'Accepted formats [+XX][-/space]XX[-/space]XXXX[-/space]XXXX} (for landline) or ' +
             '[+XX][-/space]XXX[-/space]XXX[-/space]XXXX (for mobile). Parts in [] are optional and Xs are digits.')}
  ];

  professionalArray: Array<any> = [
    { field: 'designation', label: 'Current Designation', required: true,
      help: 'Current professional designation of the recommender if any.' },
    { field: 'affiliation', label: 'Current Affiliation', required: true,
      help: 'Organization / Institution the recommender is currently affiliated with, if any.' }
  ];

  constructor(public globals: Globals,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.identityForm = this.initIdentification();
    this.professionalForm = this.initProfessional();
    this.statusForm = this.initStatus();
    this.fillForm();
  }

  initIdentification() {
    return this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required, Validators.email
      ])],
      full_name: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.namePattern)
      ])],
      title: ['', Validators.compose([
        Validators.required
      ])],
      phone: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.mobileOrLandlinePattern)
      ])],
    });
  }

  initProfessional() {
    return this.formBuilder.group({
      designation: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.smallplainText)
      ])],
      affiliation: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.smallplainText)
      ])],
    });
  }

  initStatus() {
    return this.formBuilder.group({
      waived: ['', Validators.compose([])],
      frozen: ['', Validators.compose([])],
    });
  }

  fillForm() {
     // get the recommendation model instance that this form instance will be mapped to
     this.recommendation = this.globals.candidate?.findRecommendation(this.index);
     // use this to fill the form
     this.alreadyFrozen = (this.recommendation ? this.recommendation.frozen : false);
     if (this.recommendation) {
      this.identityForm.patchValue({
        email: this.recommendation.email,
        full_name: this.recommendation.full_name,
        title: this.recommendation.title,
        phone: this.recommendation.phone,
      });
      this.professionalForm.patchValue({
        designation: this.recommendation.designation,
        affiliation: this.recommendation.affiliation,
      });
      this.statusForm.patchValue({
        waived: this.recommendation.waived,
        frozen: this.recommendation.frozen,
      });
    }
    for (const field in this.identityForm.controls) {
      this.identityForm.controls[field].markAsUntouched();
    }
    for (const field in this.professionalForm.controls) {
      this.professionalForm.controls[field].markAsUntouched();
    }
    for (const field in this.statusForm.controls) {
      this.statusForm.controls[field].markAsUntouched();
    }  
  }

  save() {
    const formData: FormData = new FormData();
    const forms = [this.identityForm, this.professionalForm, this.statusForm];
    // collect the form data
    for (const id in forms) {
      for (const field in forms[id].controls) {
        if (forms[id].controls[field].touched) {
          formData.append(field, forms[id].controls[field].value);
        }
      }
    }
  }

  sendReminder() {
    // call back for reminder to the recommender
    this.soochana.confirm('ConfirmReminder', 'Please confirm that you wish to send a reminder to the recommender.');
  }

  nothingToSave() {
    // returns true if there is nothing to save -- used by the router guard to alert if there are things to be saved when
    // going away from this form
    return (this.alreadyFrozen || this.saveButton.nativeElement.disabled);
  }
  
  remove() {
    this.soochana.confirm('ConfirmDeletion', 'Please confirm that you wish to delete this recommender from your list.');
  }
}
