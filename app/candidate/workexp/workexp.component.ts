import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Globals } from 'src/app/globals';
import { SoochanaComponent } from 'src/app/soochana/soochana.component';

@Component({
  selector: 'app-workexp',
  templateUrl: './workexp.component.html',
  styleUrls: ['./workexp.component.scss']
})
export class WorkexpComponent implements OnInit {
  @ViewChild(SoochanaComponent, { static: true }) soochana !: SoochanaComponent;
  @ViewChild('work_experience', { read: ElementRef, static: true }) workExpControl !: ElementRef;
  @ViewChild('saveButton', { read: ElementRef, static: false }) saveButton !: ElementRef;
  
  workExperienceForm !: FormGroup;
  othersForm !: FormGroup;
  workExperience !: File | null;
  
  constructor(
    public globals: Globals,
    private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.workExperienceForm = this.formBuilder.group({
      work_experience : ['', Validators.compose([
      ])]
    })

    this.othersForm = this.formBuilder.group({
      hobbies: ['', Validators.compose([
      ])],
      special_remarks: ['', Validators.compose([
      ])]
    })
    for(const field in this.othersForm.controls) {
      this.othersForm.controls[field].markAsUntouched();
    }
  }

  checkUpload(fileObj: File | null) {
    if(!this.globals.checkPdf(fileObj)) {
      fileObj = null;
      const message = "Upload Failed! Please Upload Valid Documents";
      this.soochana.info("Upload Failed", message, "Upload Failed");
    }
    else {
      const message = "File Upload was successful !";
      this.soochana.success("Upload Successful", message, "Upload Successful");
    }
  }

  workExperienceUpload(files: FileList | null) {
    if(files!=null) {
      this.workExperience = files.item(0);
      this.checkUpload(this.workExperience);
    }
  }

  save() {
    const formData: FormData = new FormData();
    for(const field in this.othersForm.controls) {
      if(this.othersForm.controls[field].touched) {
        formData.append(field, this.othersForm.controls[field].value)
      }
    }
    if(this.workExperience) {
      formData.append('work_experience', this.workExperience, this.workExperience.name)
    }
  }

  nothingToSave() {
    return this.saveButton.nativeElement.disabled;
  }

  removeWorkExperience() {
    const message = ('Please confirm that you wish to remove the work experience document you have already uploaded. ' +
      'You can of course upload a different document later if you wish. Note that to just change the saved document ' +
      'you only need to upload another one in its place - you don\'t have to explicitly delete the earlier one.');
    this.soochana.confirm('Delete Work Experience', message);
  }

  refreshApp(app: any) {
    //  Update the application with 'app' fetched from the server
    this.globals.application?.deserialize(app);
    //  Reset Work Experience Selection
    this.workExpControl.nativeElement.value = '';
    //  Reset OthersForm Fields
    for (const field in this.othersForm.controls) {
      this.othersForm.controls[field].markAsUntouched();
    }
  }
}
