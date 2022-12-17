import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Globals } from '../../globals';
import { SoochanaComponent } from 'src/app/soochana/soochana.component';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})


export class ResearchComponent implements OnInit {
  @ViewChild(SoochanaComponent, { static: true }) soochana !: SoochanaComponent;
  researchStatementForm !: FormGroup;
  publicationForm !: FormGroup;
  researchStatement !: File | null;
  publications !: File | null;
  publication1 !: File | null;
  publication2 !: File | null;
  @ViewChild('research_preparation', { read: ElementRef, static: true }) researchPrepControl!: ElementRef;
  @ViewChild('list_of_publications', { read: ElementRef, static: true }) publistControl!: ElementRef;
  @ViewChild('publication1', { read: ElementRef, static: true }) pub1Control!: ElementRef;
  @ViewChild('publication2', { read: ElementRef, static: true }) pub2Control!: ElementRef;
  @ViewChild('saveButton', { read: ElementRef, static: false }) saveButton!: ElementRef;
  isExpanded = false;

  constructor(
    public globals: Globals,
    private formBuilder : FormBuilder) { }

  ngOnInit(): void {
    this.researchStatementForm = this.formBuilder.group({
      research_preparation: ['', Validators.compose([
      ])]
    })
    this.publicationForm = this.formBuilder.group({
      list_of_publications: ['', Validators.compose([
      ])],
      publication1: ['', Validators.compose([
      ])],
      publication2: ['', Validators.compose([
      ])]
    })
  }

  checkUpload(fileObj: File | null, control: any) {
    // Check If the File Selected is acceptible or not during every upload
    if(!this.globals.checkPdf(fileObj)) {
      control.nativeElement.value = '';
      fileObj = null;
      const message = "Upload Failed! Please Upload Valid Documents"
      this.soochana.info("Upload Failed", message, "Upload Failed")
    }
    else {
      const message = "File Upload was successful !"
      this.soochana.success("Upload Successful", message, "Upload Successful")
    }
  }

  researchStatementUpload(files: FileList | null) {
    if(files!=null) {
      this.researchStatement = files.item(0);
      this.checkUpload(this.researchStatement, this.researchPrepControl);
    }
  }

  publicationsUpload(files: FileList | null) {
    if(files!=null) {
      this.publications = files.item(0);
      this.checkUpload(this.publications, this.publistControl);
    }
  }

  publication1Upload(files: FileList | null) {
    if(files!=null) {
      this.publication1 = files.item(0);
      this.checkUpload(this.publication1, this.pub1Control);
    }
  }

  publication2Upload(files: FileList | null) {
    if(files!=null) {
      this.publication2 = files.item(0);
      this.checkUpload(this.publication2, this.pub2Control);
    }
  }

  save() {
    const formData: FormData = new FormData();
    if (this.researchStatement) {
      formData.append('research_preparation', this.researchStatement, this.researchStatement.name);
    }
    if (this.publications) {
      formData.append('list_of_publications', this.publications, this.publications.name);
    }
    if (this.publication1) {
      formData.append('publication1', this.publication1, this.publication1.name);
    }
    if (this.publication2) {
      formData.append('publication2', this.publication2, this.publication2.name);
    }
  }


  removePublist() {
    const message = ('Please confirm that you wish to remove the list of publications you have already uploaded. ' +
                     'You can of course upload a different document later if you wish. Note that to just change the saved document ' +
                     'you only need to upload another one in its place - you don\'t have to explicitly delete the earlier one.');
    this.soochana.confirm('Delete Publication List', message);
  }

  removePub1() {
    const message = ('Please confirm that you wish to remove the Publication 1 you have already uploaded. ' +
                     'You can of course upload a different document later if you wish. Note that to just change the saved document ' +
                     'you only need to upload another one in its place - you don\'t have to explicitly delete the earlier one.');
    this.soochana.confirm('Delete Publication 1', message);
  }

  removePub2() {
    const message = ('Please confirm that you wish to remove the Publication 2 you have already uploaded. ' +
                     'You can of course upload a different document later if you wish. Note that to just change the saved document ' +
                     'you only need to upload another one in its place - you don\'t have to explicitly delete the earlier one.');
    this.soochana.confirm('Delete Publication 2', message);
  }
}
