import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient, private globals: Globals) { }

  getAdmissionTypes() {
    return this.http.get<any>((this.globals.rootUrl + 'candidates/admissionTypes/'));
  }
  getCodeProgramFiles() {
    const appId = this.globals.application?.id;
    return this.http.get<any>((this.globals.rootUrl + 'applications/' + appId + '/code_program_files/'));
  }
  updateApplicationFields(formData: FormData) {
    const appId = this.globals.application?.id;
    return this.http.patch<any>((this.globals.rootUrl + 'applications/' + appId + '/'), formData);
  }

  updateQualificationFields(qualificationId: number, formData: FormData) {
    return this.http.patch<any>((this.globals.rootUrl + 'candidateQualifications/' + qualificationId + '/'), formData);
  }

  addQualification(formData: FormData) {
    return this.http.post<any>((this.globals.rootUrl + 'candidateQualifications/'), formData);
  }

  removeQualification(qualId: number) {
    return this.http.delete<any>((this.globals.rootUrl + 'candidateQualifications/' + qualId + '/'), {});
  }

  uploadRecommendation(recoId: number, formData: FormData) {
      return this.http.post<any>((this.globals.rootUrl + 'recommendations/' + recoId + '/upload_recommendation/'), formData);
  }

  addRecommendation(formData: FormData) {
    return this.http.post<any>((this.globals.rootUrl + 'recommendations/'), formData);
  }

  updateRecommendationFields(recoId: number, formData: FormData) {
    return this.http.patch<any>((this.globals.rootUrl + 'recommendations/' + recoId + '/'), formData);
  }

  removeRecommendation(recoId: number) {
    return this.http.delete<any>((this.globals.rootUrl + 'recommendations/' + recoId + '/'), {});
  }

  payment() {
    const appId = this.globals.application?.id;
    return this.http.post<any>((this.globals.rootUrl + 'applications/' + appId + '/make_payment/'), {});
  }

  submission() {
    const appId = this.globals.application?.id;
    return this.http.post<any>((this.globals.rootUrl + 'applications/' + appId + '/submit/'), {});
  }

  sendReminder(recommendationId: any) {
    return this.http.post<any>((this.globals.rootUrl + 'recommendations/' + recommendationId + '/remind/'), {});
  }

  removeFile(filename: any) {
    const appId = this.globals.application?.id;
    return this.http.post<any>((this.globals.rootUrl + 'applications/' + appId + '/remove_file/'), {'file': filename});
  }
}
