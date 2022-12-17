import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Globals } from '../globals';
import { AdmissionCycle } from '../models/iiitb';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class IiitbService {

  constructor(private http: HttpClient, private globals: Globals) { 
  }
  
  getCurrentCycle() {
    return this.http.get<AdmissionCycle>((this.globals.rootUrl + 'iiitb/cycles/0/current/'));
  }

  getPrograms() {
    return this.http.get<any>((this.globals.rootUrl + 'iiitb/programs/programs/'));
  }

  getDomains() {
    return this.http.get<any>((this.globals.rootUrl + 'iiitb/programDomains/domains/'));
  }

  getProgramDomains() {
    return this.http.get<any>((this.globals.rootUrl + 'iiitb/programDomains/'));
  }

  getQualifications() {
    return this.http.get<any>((this.globals.rootUrl + 'iiitb/qualifications/'));
  }
}

@Injectable()
export class CycleReadyGuard implements CanActivate {
  constructor(private router: Router, private globals: Globals) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("Inside CycleReadyGuard....");
    console.log("The currentCycle information is ", this.globals.currentCycle);
    if(this.globals.currentCycle)
      return true;
    else
      return false;
  }
}

@Injectable()
export class ProgramsReadyGuard implements CanActivate {
  constructor(private router: Router, private globals: Globals) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("Inside ProgramsReadyGuard....");
    console.log("The ProgramInformation is ", this.globals.programs);
    console.log("The FullyLoadedValue is ", this.globals.programs.fullyLoaded());
    if(this.globals.programs)// && this.globals.programs.fullyLoaded())
      return true;
    else
      return false;
  }
}
