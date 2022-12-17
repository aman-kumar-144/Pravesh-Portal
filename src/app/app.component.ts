import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationService } from './services/application.service';
import { AuthenticationService } from './services/authentication.service';
import { CandidateService } from './services/candidate.service';
import { IiitbService } from './services/iiitb.service';
import { Globals } from './globals';
import { Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SoochanaComponent } from './soochana/soochana.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(LoginComponent, { static: true }) loginDialog !: LoginComponent;
  @ViewChild(SoochanaComponent, { static: true }) soochana !: SoochanaComponent;

  phdprogramManualUrl !: string;
  msprogramManualUrl !: string;
  mscdsprogramManualUrl !: string;
  mscdscurriculumUrl !: string;
  qualificationsFetched = false;

  constructor(
    private authenticationService: AuthenticationService,
    private applicationService: ApplicationService,
    private candidateService: CandidateService,
    private iiitbService: IiitbService,
    private router: Router,
    public globals: Globals) {
    }

  onLogin(event: any) {
    if (event) {
      console.log("Inside App.component -> onLogin() function called")
      this.setApplicationProgram();
      this.getPrograms();
      this.subscribeCycleService();
      this.getQualifications();
      this.getCountries();
    }
  }
  
  logout() {
    console.log("You Clicked Logout Button");
    this.soochana.confirm('logout', 'Are you sure you want to log out of Pravesh? Please confirm.');
  }

  returnSoochana(soochana: any) {
    console.log("Logout return Soochana called")
    if (soochana.purpose === 'logout' && soochana.status) {
      this.globals.eraseCredentials();
      console.log("Credentials Erased")
      this.authenticationService.logout()
        .subscribe(
          data => {
            this.soochana.info('Logged Out Successfully. Thanks for using Pravesh.', 'Logged Out');
          });
    }
  }

  normalLogin() {
    console.log("Inside App.component.ts -> normalLogin");
    this.loginDialog.showDialog();
  }

  passwordChange() {
    this.loginDialog.showDialog();
  }


  ngOnInit() {
    const rootUrlObject = '{"rootUrl" : "http://127.0.0.1:8000/"}';
    localStorage.setItem("rootUrl", rootUrlObject);
    console.log("ngOnInit() of App Component Called");
    this.phdprogramManualUrl = (this.globals.rootUrl + 'download/phd-manual/');
    this.msprogramManualUrl = (this.globals.rootUrl + 'download/ms-manual/');
    this.mscdsprogramManualUrl = (this.globals.rootUrl + 'download/mscds-manual/');
    this.mscdscurriculumUrl = (this.globals.rootUrl + 'download/mscds-curriculum/');
    //this.setApplicationProgram();
    this.getPrograms();
    this.subscribeCycleService();
    this.getQualifications();
    this.getCountries();
    this.reloadUser();
  }

  subscribeCycleService() {
    if (!this.globals.currentCycle && this.globals.currentCredentials) {
      console.log("Subscribe Cycle Service Called");
      this.iiitbService.getCurrentCycle()
        .subscribe(
          cycle => {
            this.globals.currentCycle = cycle;
            console.log("The SubscribeCycle Information is ", this.globals.currentCycle);
          },
          err => {
            // this.soochana.info('The session has been lost. Please login again if you wish to continue.');
          });
    }
  }

  getQualifications() {
    if (!this.globals.qualifications && this.globals.currentCredentials) {
      console.log("Get Qualifications API Called");
      this.iiitbService.getQualifications()
        .subscribe(
          qualifications => {
            this.globals.qualifications = qualifications;
            console.log("The getQualifications Information is ", this.globals.qualifications);
          });
    }
  }

  reloadUser() {
    // Reload user (if the session is still alive) on refresh or when the coming back after navigating elsewhere
    console.log("reloadUser() API Called");
    this.authenticationService.sessionAlive()
      .subscribe(
        details => {
          const user = details.user;
          this.globals.updateUserDetails(user);
          console.log("The Reload User details are ", user);
          if (this.globals.currentCredentials.user.is_candidate) {
            this.globals.candidate = details;
            this.onLogin(true);
            this.setApplicationProgram();
          }
        },
        err => {
          this.globals.eraseCredentials();
          // this.soochana.info('The session has been lost. Please login again if you wish to continue.');
        });
  }

  getPrograms() {
    if (!this.globals.programs && this.globals.currentCredentials) {
      console.log("Get Programs API Called");
      this.iiitbService.getPrograms()
        .subscribe(
          programs => {
            this.globals.programs = programs;
            console.log("The Programs are ", this.globals.programs);
            this.getDomains();
          });
    }
  }

  getDomains() {
    if (!this.globals.alldomains) {
      console.log("getDomains() API Called");
      this.iiitbService.getDomains()
        .subscribe(
          domains => {
            this.globals.alldomains = domains;
            console.log("The Domains are ", this.globals.alldomains);
            //this.getProgramDomains();
          });
    }
  }
  
  getProgramDomains() {
    if (!this.globals.programDomains) {
      console.log("getProgramDomains() API Called");
      this.iiitbService.getProgramDomains()
        .subscribe(
          programDomains => {
            this.globals.programDomains = programDomains;
            console.log("The ProgramDomains are ", this.globals.programDomains);
          });
    }
  }

  setApplicationProgram() {
    if(!Globals._candidate.application)
      return;
    const application = Globals._candidate.application;
    application.program = Globals._programs.findProgram(application.domain_preference1);
    Globals._selected_program = application.program;
  }

  getCountries() {
    if (!this.globals.countries) {
      console.log("getCountries() API Called");
      this.candidateService.getCountries()
        .subscribe(
          countries => {
            this.globals.countries = countries;
            console.log("The Countries are ", this.globals.countries);
          });
    }
  }

  portal_open() {
    if (this.globals.currentCycle) {
      const now = new Date();
      const startDate = new Date(this.globals.currentCycle.submissions_begin);
      const endDate = new Date(this.globals.currentCycle.application_deadline);
      return (startDate <= now && endDate >= now);
    } 
    else {
      return false;
    }
  }

  cycle_announced() {
    if (this.globals.currentCycle) {
      const now = new Date();
      const announcementDate = new Date(this.globals.currentCycle.applications_call_date);
      return (announcementDate <= now);
    } 
    else {
      return false;
    }
  }
}
