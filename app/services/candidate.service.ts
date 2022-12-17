import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Globals } from '../globals';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient, private globals: Globals) { }

    getCountries() {
        return this.http.get<any>((this.globals.rootUrl + 'candidates/countries/'));
    }

    updateCandidateFields(formData: any) {
      const candidateId = this.globals.candidate.id;
      return this.http.patch<any>((this.globals.rootUrl + 'candidates/' + candidateId + '/'), formData);
    }

    updateCandidateQualificationFields(candidateQualId: any, formData: any) {
      return this.http.patch<any>((this.globals.rootUrl + 'candidateQualifications/' + candidateQualId + '/partial_update/'), formData);
    }

    reapply(formData: FormData) {
      return this.http.post((this.globals.rootUrl + 'reapply/'), formData);
    }
}

@Injectable()
export class CandidateReadyGuard implements CanActivate {
  constructor(private router: Router, private globals: Globals) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("Inside CanActivate Guard");
    console.log("The Qualifications is ", this.globals.qualifications);
    console.log("The Countries are ", this.globals.countries);
    console.log("The Programs are ", this.globals.programs);
    console.log("The AllProgramDomains are ", this.globals.alldomains);
    console.log("The CurrentCycle is ", this.globals.currentCycle);
    console.log("The Candidate is ", this.globals.candidate);
    if( this.globals.qualifications && this.globals.countries && this.globals.programs && this.globals.alldomains && this.globals.currentCycle && this.globals.candidate )
      return true;
    else 
      return false;
  }
}

@Injectable()
export class CountriesReadyGuard implements CanActivate {
  constructor(private router: Router, private globals: Globals) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("Inside CountriesReadyGuard");
    console.log("The CountryList is ", this.globals.countries);
    if(this.globals.countries)
      return true;
    else
      return false;
  }
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<any> {
  constructor(private router: Router, private globals: Globals) { }
  canDeactivate(
    component: any,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if ((this.globals.application && this.globals.application.submitted) || component.nothingToSave()) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    return confirm('You have unsaved changes on this part of the application. are you sure you want to discard the changes?');
  }
}


