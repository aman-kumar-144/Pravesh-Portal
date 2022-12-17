import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Globals } from 'src/app/globals';
import { SoochanaComponent } from 'src/app/soochana/soochana.component';
import { ProgramDomain, Subdomain } from 'src/app/models/iiitb';
import { IiitbService } from 'src/app/services/iiitb.service';
import { ApplicationService } from 'src/app/services/application.service';


@Component({
  selector: 'app-applying-for',
  templateUrl: './applying-for.component.html',
  styleUrls: ['./applying-for.component.scss']
})
export class ApplyingForComponent implements OnInit {
  @ViewChild(SoochanaComponent, { static: true }) soochana !: SoochanaComponent;
  @ViewChild('statement_of_purpose', { read: ElementRef, static: true }) sopControl !: ElementRef;
  @ViewChild('saveButton', { read: ElementRef, static: false }) saveButton !: ElementRef;
  programForm !: FormGroup;
  areasOfInterestForm !: FormGroup;
  sopForm !: FormGroup;
  sop !: File | null;
  programList = null;
  ytc = 'YTC';
  ytcVerbose = 'Yet to Choose';

  domainArray !: Array<ProgramDomain>;
  subdomains1 !: Array<Subdomain> | null;
  subdomains2 !: Array<Subdomain> | null;

  constructor(
    public globals: Globals,
    private iiitbService: IiitbService,
    private applicationService: ApplicationService,
    private formBuilder : FormBuilder) { }

  initProgramInfo(): FormGroup {
    return this.formBuilder.group({
      program: ['', Validators.compose([
        Validators.required
      ])],
      admission_type: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  initAreasOfInterest(): FormGroup {
    return this.formBuilder.group({
      domain_preference1: ['', Validators.compose([
        Validators.required
      ])],
      subdomain1: ['', Validators.compose([
        Validators.required
      ])],
      domain_preference2: ['', Validators.compose([
      ])],
      subdomain2: ['', Validators.compose([
      ])],
      additional_subdomains: ['', Validators.compose([
        Validators.pattern(this.globals.emptySmallplainText)
      ])]
    });
  }

  initSOP(): FormGroup {
    return this.formBuilder.group({
      statement_of_purpose: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  ngOnInit(): void {
    this.programForm = this.initProgramInfo();
    this.areasOfInterestForm = this.initAreasOfInterest();
    this.sopForm = this.initSOP();
    console.log("Applying-For Component Clicked");
    this.getAdmissionTypes();
    this.fillForm();
  }

  getAdmissionTypes() {
    if (!this.globals.admissionTypes) {
      console.log("getAdmissionTypes() API Called");
      this.applicationService.getAdmissionTypes()
        .subscribe(
          admissionTypes => {
            this.globals.admissionTypes = admissionTypes;
            console.log("The AdmissionTypes() is ", this.globals.admissionTypes);
          });
    }
  }

  getPrograms() {
    console.log("Inside getPrograms() function")
    if (!this.globals.programs && this.globals.currentCredentials) {
      this.iiitbService.getPrograms()
        .subscribe(
          programs => {
            this.globals.programs = programs;
            console.log("The Programs are(in API response) ",this.globals.programs)
            this.getDomains();
          });
    }
  }
  getDomains() {
    if (!this.globals.alldomains) {
      this.iiitbService.getDomains()
        .subscribe(
          domains => {
            this.globals.alldomains = domains;
            this.getProgramDomains();
          });
    }
  }
  getProgramDomains() {
    if (!this.globals.programDomains) {
      this.iiitbService.getProgramDomains()
        .subscribe(
          programDomains => {
            this.globals.programDomains = programDomains;
          });
    }
  }

  program_is_res() {
    const pgmControl = this.programForm.controls['program'];
    return (pgmControl.value !== this.globals.MSCDT);
  }

  subdomainArray(pgmdomId: any) {
    for (const i in this.domainArray) {
      if (this.domainArray[i].id === Number(pgmdomId)) {
        return this.domainArray[i].subdomains;
      }
    }
    return null;
  }

  subdomainChange1() {

  }

  domainChange2() {

  }

  domainChange1() {

  }

  programChange() {
    
  }

  checkUpload(fileObj: File | null) {
    if(!this.globals.checkPdf(fileObj)) {
      this.sop = null;
      this.sopControl.nativeElement.value = '';
      const message = "Upload Failed! Please Upload Valid Documents";
      this.soochana.info("Upload Failed", message, "Upload Failed");
    }
    else {
      const message = "File Upload was successful !";
      this.soochana.success("Upload Successful", message, "Upload Successful");
    }
  }

  sopUpload(files: FileList | null) {
    if(files!=null) {
      this.sop = files.item(0);
      this.checkUpload(this.sop);
    }
  }

  fillForm() {
    this.programList = this.globals.programs.programs();
    console.log("The ProgramList is ",this.programList);
    if(!this.globals.application)
      return;
    this.globals.application.program = this.globals.programs.findProgram(this.globals.application.domain_preference1);
    this.programForm.patchValue({
      program: this.globals.application.program,
      admission_type: this.globals.application.admission_type,
    });
    this.domainArray = this.globals.programs.domains(this.globals.application.program);
    this.subdomains1 = this.subdomainArray(this.globals.application.domain_preference1);
    this.subdomains2 = this.subdomainArray(this.globals.application.domain_preference2);
    this.areasOfInterestForm.patchValue({
      domain_preference1: this.globals.application.domain_preference1,
      subdomain1: this.globals.application.subdomain1,
      domain_preference2: this.globals.application.domain_preference2,
      subdomain2: this.globals.application.subdomain2,
      additional_subdomains: this.globals.application.additional_subdomains,
    });
    for (const field in this.programForm.controls) {
      this.programForm.controls[field].markAsUntouched();
    }
    for (const field in this.areasOfInterestForm.controls) {
      this.areasOfInterestForm.controls[field].markAsUntouched();
    }
    this.globals.selectedProgram = this.globals.application.program;
  }

  save() {
    const formData: FormData = new FormData();
    for (const field in this.programForm.controls) {
      const cntrl = this.programForm.controls[field];
      if (field !== 'program' && cntrl.touched) {
        // actual programdomain id is in the domain_preference 1 field
        formData.append(field, cntrl.value);
      }
    }
    for (const field in this.areasOfInterestForm.controls) {
      const cntrl = this.areasOfInterestForm.controls[field];
      if (cntrl.value !== '' && cntrl.touched) {
        formData.append(field, cntrl.value);
      }
    }
    if (this.sop) {
      formData.append('statement_of_purpose', this.sop, this.sop.name);
    }
  }

  nothingToSave() {
    // returns true if there is nothing to save -- used by the router guard to alert if there are things to be saved when
    // going away from this form
    return this.saveButton.nativeElement.disabled;
  }

  survey() {
    const linkUrl = 'https://forms.office.com/Pages/ResponsePage.aspx?id=IkyogrJHEka594YPOeubEhqOc35WWGZCnrcTgOTWarFUMVUxNE4xVExCWUpHQkw4RjE4TkVJU1NDTS4u';
    window.open(linkUrl, '_blank');
  }
  returnSoochana(status: any) {}
}
