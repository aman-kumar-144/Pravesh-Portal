import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globals } from 'src/app/globals';
import { SoochanaComponent } from 'src/app/soochana/soochana.component';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CandidateService } from './../../services/candidate.service';
import { ApplicationService } from 'src/app/services/application.service';

declare var require: any
const moment = require('moment');
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public photograph !: File | null;
  public photo_proof !: File | null;
  public identificationForm !: FormGroup;
  public personalParticularsForm !: FormGroup;
  public contactDetailsForm !: FormGroup;
  public professionalInformationForm !: FormGroup;

  @ViewChild('photograph', { read: ElementRef, static: true }) photographControl !: ElementRef;
  @ViewChild('photo_proof', { read: ElementRef, static: true }) photoProofControl !: ElementRef;
  @ViewChild('saveButton', { read: ElementRef, static: true }) saveButton !: ElementRef;
  @ViewChild(SoochanaComponent, { static: true }) soochana !: SoochanaComponent;
  hideSoochana = true;
  needOk = true;
  needCancel = false;
  submitted = false;
    
  constructor(
    private formBuilder : FormBuilder, 
    private http : HttpClient, 
    private router : Router,
    private candidateService : CandidateService,
    private authenticationService : AuthenticationService,
    private applicationService : ApplicationService,
    public globals : Globals,
    @Inject(DOCUMENT) private document: any) { }
    
    identificationArray: Array<any> = [
      { field: 'email', label: 'Email', required: true, disabled: true },
      { field: 'first_name', label: 'First Name', required: true, disabled: true },
      { field: 'last_name', label: 'Last Name', required: false, disabled: false },
      { field: 'short_name', label: 'Short Name', required: true, disabled: false }
    ];

    genders = ['Female', 'Male'];
    titles = ['Dr.', 'Ms.', 'Mr.', 'Mrs.'];

    contactInformationArray: Array<any> = [
      { field: 'phone', label: 'Phone (landline)', required: false,
        help: ('Accepted formats [+XX][-/space]XX[-/space]XXXX[-/space]XXXX  or the mobile number format. ' +
               'Parts in [] are optional and Xs are digits.')},
      { field: 'mobile_phone', label: 'Mobile', required: true,
        help: 'Accepted formats [+XX][-/space]XXX[-/space]XXX[-/space]XXXX. Parts in [] are optional and Xs are digits.' },
      { field: 'address', label: 'Address', required: true,
        help: '' },
      { field: 'state', label: 'State', required: true, help: '' },
      { field: 'pincode', label: 'Pin / Zip Code', required: true, help: '' }
    ];

    professionalInformationArray : Array<any> = [
      { field: 'designation', label: 'Your Current Designation', required: false,
      help: 'Your current professional designation if any.' },
      { field: 'affiliation', label: 'Your Current Affiliation', required: false,
      help: 'Organization/Institution you are currently affiliated with, if any.' }
    ]

  ngOnInit(): void {
    this.identificationForm = this.initIdentification();
    this.personalParticularsForm = this.initPersonalParticulars();
    this.contactDetailsForm = this.initContactDetails();
    this.professionalInformationForm = this.initProfessionalInformation();   
    this.fillForm(); 
  }

  initIdentification(): FormGroup {
    return this.formBuilder.group({
      email: ['', [
        Validators.required, Validators.email
      ]],
      first_name: ['', [
        Validators.required, Validators.pattern(this.globals.namePattern)
      ]],
      last_name: ['', [
        Validators.pattern(this.globals.emptyNamePattern)
      ]],
      short_name: ['', [
        Validators.required, Validators.pattern(this.globals.namePattern)
      ]],
      photograph: ['', [
      ]],
      photo_proof: ['', []]
    })
  }

  initPersonalParticulars(): FormGroup {
    return this.formBuilder.group({
      dob: ['', Validators.compose([
        Validators.required
      ])],
      gender: ['', Validators.compose([
        Validators.required
      ])],
      title: ['', Validators.compose([
        Validators.required
      ])],
      nationality: ['', Validators.compose([
        Validators.required
      ])]
    })
  }

  initContactDetails(): FormGroup {
    return this.formBuilder.group({
      phone: ['', Validators.compose([
        Validators.pattern(this.globals.mobileOrLandlinePattern)
      ])],
      mobile_phone: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.mobilePattern)
      ])],
      address: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.smallplainText)
      ])],
      state: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.namePattern)
      ])],
      country_of_residence: ['', Validators.compose([
        Validators.required
      ])],
      pincode: ['', Validators.compose([
        Validators.required, Validators.pattern(this.globals.pincodePattern)
      ])]
    })
  }

  initProfessionalInformation(): FormGroup {
    return this.formBuilder.group({
      designation: ['', Validators.compose([
        Validators.pattern(this.globals.emptySmallplainText)
      ])],
      affiliation: ['', Validators.compose([
        Validators.pattern(this.globals.emptySmallplainText)
      ])]
    })
  }

  checkUpload(fileObj: File | null) {
    // On every file selection check if the file is acceptable (size and extension)
    if(!this.globals.checkImg(fileObj)) {
      this.photographControl.nativeElement.value = '';
      this.photograph = null;
      this.soochana.error('upload', ('The file you tried to upload is either not one in a standard format (.jpg, .jpeg, .png) or exceeds the file size limit. ' +
         'Please upload a different file.'));
    }
    else {
      const message = "File Upload was successful !";
      this.soochana.success("Upload Successful", message, "Upload Successful");
    }
  }
  checkProofUpload(fileObj: File | null) {
    // On every file selection check if the file is acceptable (size and extension)
    if(!this.globals.checkImg(fileObj)) {
      this.photoProofControl.nativeElement.value = '';
      this.photo_proof = null;
      this.soochana.error('upload', ('The file you tried to upload is either not one in a standard format (.jpg, .jpeg, .png) or exceeds the file size limit. ' +
         'Please upload a different file.'));
    }
    else {
      const message = "File Upload was successful !";
      this.soochana.success("Upload Successful", message, "Upload Successful");
    }
  }

  photographUpload(files: FileList | null) {
    if(files != null) {
        this.photograph = files.item(0);
        this.checkUpload(this.photograph);
    }
  }
  photographProofUpload(files: FileList | null) {
    if(files != null) {
      this.photo_proof = files.item(0);
      this.checkProofUpload(this.photo_proof);
    }
  }

  onSubmit() {
    console.log("onSubmit() Called")
    this.submitted = true;
    if(this.identificationForm.invalid)
      return;
  }

  register() {
    this.submitted = true;
    if(this.identificationForm.invalid)
      return;
    if(this.personalParticularsForm.invalid)
      return;
    if(this.contactDetailsForm.invalid)
      return;
    if(this.professionalInformationForm.invalid)
      return;

    if (!this.globals.currentCredentials) {
      // when the candidate registers for the first time
      const message = ('Please confirm that your form is ready for registration. Note that some of the details here ' +
        'cannot be changed once the registration is complete');
      this.soochana.confirm('register', message);
    }
    else {
      // when the candidate saves the registration information while filling up the rest of the application form
      const formData = this.collectFormData();
      this.candidateService.updateCandidateFields(formData)
        .subscribe(candidate => {
            // candidate is the data fetched from the server
            // update the user and candidate models the candidate data
            this.globals.updateUserDetails(candidate.user);
            this.globals.candidate = candidate;
            // reset photograph selection
            this.photographControl.nativeElement.value = '';
            // fill/refresh the forms from the models
            this.fillForm();
        }, err => {
          this.soochana.error('save', err);
        })
    }
  }

  collectFormData() {
    console.log("Form Data Collection Called");
    // Collect form data
    const formData: FormData = new FormData();
    const forms = [this.identificationForm, this.personalParticularsForm, this.contactDetailsForm, this.professionalInformationForm];
    for (const id in forms) {
      for (const field in forms[id].controls) {
        // handle photograph and dob separately
        if (field !== 'photograph' && forms[id].controls[field].touched) {
          const rawValue = forms[id].controls[field].value;
          if( field === 'dob') {
            const stringDate = moment(forms[id].value.expireDate).format('YYYY-MM-DD');
            formData.append(field, stringDate);
            console.log("Date of Birth Field is present here => ", stringDate);
          }
          else {
            console.log("The field and value is ",field,"  :  ",rawValue);
            formData.append(field, rawValue);
          }
        }
      }
    }
    // photograph added as a file
    if (this.photograph) {
      formData.append('photograph', this.photograph, this.photograph.name);
    }
    if (this.photo_proof) {
      formData.append('photo_proof', this.photo_proof, this.photo_proof.name);
    }
    return formData;
  }

  returnSoochana(status: any) {
    console.log("Return Soochana Event Called")
    // Call back after confirmation (soochana dialog)
    if (status.status && status.purpose === 'register') {
      // if confirmed --- collect form data and register
      const formData = this.collectFormData();
      this.authenticationService.register(formData)
        .subscribe(success =>{
          const message = ('Congratulations ! The registration is through. An account has been created ' +
          'with your email as the user name. A confirmation mail that also has your temporary login ' +
          'credentials has been sent to your email. To continue the application process login with ' +
          'the temporary password provided using the Change Password option.');
          this.soochana.success('register-success', message);
        },
        err => {
          this.soochana.error('register-error', err);
        })
    }
    else if (status.status && status.purpose === 'reapply') {
      // if confirmed --- collect form data and register
      const formData = this.collectFormData();
      this.candidateService.reapply(formData)
        .subscribe(success => {
            const message = ('Congratulations ! Your existing account has been reactivated ' +
              'with your email as the user name. A confirmation mail that also has your temporary login ' +
              'credentials has been sent to your email. To continue the application process, login with ' +
              'the temporary password provided using the Change Password option. Please note that your personal details ' +
              'including identity information, contact details, qualifications etc. already entered as part of your ' +
              'previous application will be inherited as is. So you do not have to renter them. You can of course modify these.' +
              'The application specific artefacts such as the research statement and statement of purpose, choices of research ' +
              'area etc., have to be entered afresh; these are not carried over from your previous application. ' +
              'This application for admission is independent of your earlier applications and will be considered on its own merit.');
            this.soochana.success('reapply-success', message);
        },
        err => {
          this.soochana.error('reapply-error', err);
        });
    }
    else if (status.purpose === 'register-success') {
      this.router.navigate(['home']);
    }
    else if (status.purpose === 'reapply-success') {
      this.router.navigate(['home']);
    }
  }

  fillForm() {
    if(!this.globals.currentCredentials)
      return;
    const user = this.globals.currentCredentials.user;
    const candidate = this.globals.candidate;
    this.identificationForm.patchValue({
      email: user?.email,
      first_name: user?.first_name,
      last_name: user?.last_name,
      short_name: user?.short_name
    });
    this.personalParticularsForm.patchValue({
      dob: candidate?.dob,
      gender: user?.gender,
      nationality: candidate?.nationality,
      title: user?.title,
    });
    this.contactDetailsForm.patchValue({
      phone: candidate?.phone,
      mobile_phone: candidate?.mobile_phone,
      address: candidate?.address,
      state: candidate?.state,
      country_of_residence: candidate?.country_of_residence,
      pincode: candidate?.pincode,
    });
    this.professionalInformationForm.patchValue({
      designation: candidate?.designation,
      affiliation: candidate?.affiliation
    });
    for (const field in this.identificationForm.controls) {
      this.identificationForm.controls[field].markAsUntouched();
    }
    this.identificationForm.controls['email'].disable();
    this.identificationForm.controls['first_name'].disable();
    for (const field in this.personalParticularsForm.controls) {
      this.personalParticularsForm.controls[field].markAsUntouched();
    }
    for (const field in this.contactDetailsForm.controls) {
      this.contactDetailsForm.controls[field].markAsUntouched();
    }
    for (const field in this.professionalInformationForm.controls) {
      this.professionalInformationForm.controls[field].markAsUntouched();
    }
  }

  nothingToSave() {
    return this.saveButton.nativeElement.disabled;
  }

  payment() {
    this.applicationService.payment()
      .subscribe(ack => {
          this.document.location.href = ack.link;
        },
        err => {
          this.soochana.error('paymentFailed', err);
        });
  }

  reapply() {
    if (!this.globals.currentCredentials) {
      // when the candidate registers for the first time
      const message = ('Please confirm that you intend to reapply and that you had applied earlier for one of the IIIT-B research ' +
        'programs.');
      this.soochana.confirm('reapply', message);
    }
  }
}
