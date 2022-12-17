import { Injectable } from '@angular/core';
import { Candidate } from './models/application';
import { Programs } from './models/iiitb';
import { AdmissionCycle } from './models/iiitb';
import { Qualifications } from './models/iiitb';

export function sortArray(arr: any) {
  return arr.sort((n1: any, n2: any) => {
    if (n1 > n2) {
      return 1;
    }
    if (n1 < n2) {
      return -1;
    }
    return 0;
  });
}

export function makeStringMap(lst: any) {
  const map = new Map<string, string>();
  for (const member in lst) {
    map.set(member, lst[member]);
  }
  return map;
}

class RegexPatterns {
  static _namePattern = '^[a-zA-Z. ]';
  static _textPattern = '^[a-z0-9A-Z-.+=_()?/," ]';
  static _countryCode = '^([+][1-9][0-9]?)?';
  static _separator = '[-. ]?';
  static _pincodePattern = '^([A-Z]{3})?[1-9][0-9]{3,6}';
  static _integerPattern = '^[0-9]*$';
  static _floatPattern = '^[0-9]*[.]?[0-9]*$';
  static _minYear = (new Date().getFullYear() - 50);
  static _thisYear =  new Date().getFullYear();

  static namePattern(min: number, max: number) {
    return (RegexPatterns._namePattern + '{' + min + ',' + max + '}$');
  }

  static textPattern(min: number, max: number) {
    return (RegexPatterns._textPattern + '{' + min + ',' + max + '}$');
  }

  static numPattern(ndigits: number, starting = '') {
    return ((starting === '') ? ('([0-9]{' + ndigits + '})') : ('(' + starting + '[0-9]{' + (ndigits - 1) + '})'));
  }

  static landlinePattern() {
    return ('^' + RegexPatterns._countryCode + RegexPatterns._separator + RegexPatterns.numPattern(2, '[1-9]') +
            RegexPatterns._separator + RegexPatterns.numPattern(4, '[1-9]') + RegexPatterns._separator +
            RegexPatterns.numPattern(4) + '$');
  }

  static mobilePattern() {
    return ('^' + RegexPatterns._countryCode + RegexPatterns._separator + RegexPatterns.numPattern(3, '[1-9]') +
            RegexPatterns._separator + RegexPatterns.numPattern(3) + RegexPatterns._separator +
            RegexPatterns.numPattern(4) + '$');
  }
}

@Injectable()
export class Globals {
  static _maxFileSize = 5000000;
  static _maxPhotoSize = 500000;
  // Keeps the current admission cycle
  static _currentCycle: AdmissionCycle;
  static _countries: Map<string, string>;
  static _programs: Programs;
  static _alldomains: Map<string, string>;
  static _qualifications: Qualifications;
  static _admissionTypes: Map<string, string>;
  static _candidate: Candidate;
  static _validityNote = ('Please note that (i) no field in the form must be invalid (red vertical bar on the left border ' +
                          'of an input field means the value entered is invalid), and (ii) something (input value or files to be ' +
                          'uploaded) in the form must have changed, for the save button to be enabled.');
  static _registrationValidityNote = ('Please note that (i) no field in the form must be invalid (red vertical bar on the left border ' +
                                      'of an input field means the value entered is invalid), and (ii) all mandatory fields (in bold) ' +
                                      'must be filled, for the register button to be enabled.');

  static _selected_program: string | null;
  static _MSCDT = 'MSCDT';

  get emptyNamePattern() { return RegexPatterns.namePattern(0, 64); }
  get namePattern() { return RegexPatterns.namePattern(3, 64); }
  get plainText() { return RegexPatterns.textPattern(0, 1024); }
  get emptySmallplainText() { return RegexPatterns.textPattern(0, 128); }
  get smallplainText() { return RegexPatterns.textPattern(2, 128); }
  get phonePattern() { return RegexPatterns.landlinePattern(); }
  get mobilePattern() { return RegexPatterns.mobilePattern(); }
  get mobileOrLandlinePattern() { return ('((' + RegexPatterns.landlinePattern() + ')|(' +
                                          RegexPatterns.mobilePattern() + '))'); }
  get pincodePattern() { return RegexPatterns._pincodePattern; }
  get integerPattern() { return RegexPatterns._integerPattern; }
  get floatPattern() { return RegexPatterns._floatPattern; }
  get minYear() { return RegexPatterns._minYear; }
  get thisYear() { return RegexPatterns._thisYear; }

  //  File and Photo updation during Registration, Applying For
  fileSizeLimitMsg() {
    return ((Globals._maxFileSize / 1000000).toString() + 'MB');
  }
  checkPdf(fileObj: any) {
    const ext = fileObj.name.split('.').pop().toLowerCase();

    alert("The File Size is " + fileObj.size + " and MaxFile Size is " + Globals._maxFileSize +
    " and the extension is " + ext + " and the file Name is " + fileObj.name + "The Length is " + fileObj.name.split('.').length);
    return (fileObj.size <= Globals._maxFileSize && ext === 'pdf' && fileObj.name.split('.').length > 1);
  }

  photoSizeLimitMsg() {
    return ((Globals._maxPhotoSize / 1000).toString() + 'KB');
  }
  checkImg(fileObj: any) {
    const ext = fileObj.name.split('.').pop().toLowerCase();

    alert("The File Size is " + fileObj.size + " and MaxFile Size is " + Globals._maxFileSize +
    " and the extension is " + ext + " and the file Name is " + fileObj.name + "The Length is " + fileObj.name.split('.').length);
    return (fileObj.size <= Globals._maxPhotoSize && (ext === 'png' || ext === 'jpg' || ext === 'jpeg') && fileObj.name.split('.').length > 1);
  }


  //  Local Storage
  get rootUrl() : any{
    const url = localStorage.getItem('rootUrl');
    if(url){
      return JSON.parse(url)['rootUrl'];
    }
    else
      return null;
  }
  get currentCredentials() : any{
    const currCredentials = localStorage.getItem('currentCredentials');
    if(currCredentials)
      return JSON.parse(currCredentials);
    else
      return null;
  }
  saveCredentials(cred: string) : void{
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('currentCredentials', cred);
  }
  updateUserDetails(user: any) : void{
    const credentials = JSON.parse(localStorage.getItem('currentCredentials') || '{}');
    credentials.user = user;
    localStorage.setItem('currentCredentials', JSON.stringify(credentials));
  }
  eraseCredentials() : void{
    localStorage.removeItem('currentCredentials');
  }

  //  Current Admission Cycle
  get currentCycle() {
    return Globals._currentCycle;
  }
  set currentCycle(cycle: AdmissionCycle) {
    Globals._currentCycle = new AdmissionCycle().deserialize(cycle);
  }

  //  Countries
  get countries() {
    return Globals._countries;
  }
  set countries(countryList: any) {
    Globals._countries = makeStringMap(countryList);
  }
  countryKeys() {
    return sortArray(Globals._countries ? Array.from(Globals._countries.keys()) : []);
  }

  //  Programs
  get programs() {
    return Globals._programs;
  }
  set programs(pgmList: any) {
    Globals._programs = new Programs().deserialize(pgmList);
  }

  //  Domains
  get alldomains() {
    return Globals._alldomains;
  }
  set alldomains(domList: any) {
    Globals._alldomains = makeStringMap(domList);
  }
  domainKeys() {
    return sortArray(Globals._alldomains ? Array.from(Globals._alldomains.keys()) : []);
  }
  set programDomains(pgmdomList: any) {
    for (const i in pgmdomList) {
      Globals._programs.add(pgmdomList[i], Globals._qualifications);
    }
    Globals._programs.loadedPgmDomains();
  }

  //  Qualifications
  get qualifications() {
    return Globals._qualifications;
  }
  set qualifications(qList: any) {
    Globals._qualifications = new Qualifications().deserialize(qList);
  }

  //  Admission Types
  get admissionTypes() {
    return Globals._admissionTypes;
  }
  set admissionTypes(aList: any) {
    Globals._admissionTypes = makeStringMap(aList);
  }
  admissionTypeKeys() {
    return sortArray(Globals._admissionTypes ? Array.from(Globals._admissionTypes.keys()) : []);
  }

  //  Candidate
  get candidate() {
    return Globals._candidate;
  }
  set candidate(candidate: any) {
    alert(JSON.stringify(candidate));
    Globals._candidate = new Candidate().deserialize(candidate);
    if(Globals._candidate && Globals._candidate.application)
    {
      const application = Globals._candidate.application;
      alert(application.domain_preference1);
      application.program = Globals._programs.findProgram(application.domain_preference1);
      alert(application.program);
      Globals._selected_program = application.program;
    }
  }
  get application() {
    return (Globals._candidate ? Globals._candidate.application : null);
  }

  // Validity and Registration Validity Note
  get validityNote() {
    return Globals._validityNote;
  }
  get registrationValidityNote() {
    return Globals._registrationValidityNote;
  }

  // SelectedProgram
  set selectedProgram(pgm) {
    Globals._selected_program = pgm;
  }
  get selectedProgram() {
    return Globals._selected_program;
  }

  // MSCDT
  get MSCDT() {
    return Globals._MSCDT;
  }
  enable_research_recos() {
    return (Globals._selected_program !== Globals._MSCDT);
  }
}