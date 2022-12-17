import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";

import { Globals } from './globals';
import { JwtInterceptor } from './_helpers/jwt.interceptor';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './candidate/registration/registration.component';
import { CandidateComponent } from './candidate/candidate.component';
import { SoochanaComponent } from './soochana/soochana.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ApplyingForComponent } from './candidate/applying-for/applying-for.component';
import { ResearchComponent } from './candidate/research/research.component';
import { QualificationsComponent } from './candidate/qualifications/qualifications.component';
import { RecommendationsComponent } from './candidate/recommendations/recommendations.component';
import { SubmissionComponent } from './candidate/submission/submission.component';
import { WorkexpComponent } from './candidate/workexp/workexp.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ContactComponent } from './contact/contact.component';
import { RecommenderComponent } from './recommender/recommender.component';
import { QualificationsOfTypeComponent } from './candidate/qualifications/qualifications-of-type/qualifications-of-type.component';
import { QualificationComponent } from './candidate/qualifications/qualifications-of-type/qualification/qualification.component';

import { ApplicationService } from './services/application.service';
import { AuthenticationService } from './services/authentication.service';
import { CandidateService } from './services/candidate.service';
import { IiitbService } from './services/iiitb.service';
import { CandidateReadyGuard, CountriesReadyGuard, CanDeactivateGuard } from './services/candidate.service';
import { CycleReadyGuard, ProgramsReadyGuard } from './services/iiitb.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    CandidateComponent,
    SoochanaComponent,
    ChecklistComponent,
    ApplyingForComponent,
    ResearchComponent,
    QualificationsComponent,
    RecommendationsComponent,
    SubmissionComponent,
    WorkexpComponent,
    CalendarComponent,
    ContactComponent,
    RecommenderComponent,
    QualificationsOfTypeComponent,
    QualificationComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent},
      { path: 'home', component: HomeComponent },
      { path: '', component: HomeComponent },
      { path: 'register', component: RegistrationComponent, canActivate: [CountriesReadyGuard]},
      { path: 'checklist', component: ChecklistComponent, canActivate: [CycleReadyGuard]},
      { path: 'calendar', component: CalendarComponent, canActivate: [CycleReadyGuard]},
      { path: 'contact', component: ContactComponent},
      { path: 'reco', component: RecommenderComponent},
      { path: 'candidate_dashboard', component: CandidateComponent, canActivate: [CandidateReadyGuard, CycleReadyGuard,
                                                                                CountriesReadyGuard, ProgramsReadyGuard],
        children:[
          { path: '', component: RegistrationComponent},
          { path: 'register', component: RegistrationComponent},
          { path: 'applying-for', component: ApplyingForComponent},
          { path: 'research', component: ResearchComponent},
          { path: 'qualifications', component: QualificationsComponent},
          { path: 'recommendations', component: RecommendationsComponent},
          { path: 'work-experience', component: WorkexpComponent},
          { path: 'submission', component: SubmissionComponent}
        ]}
    ], {
      useHash: false,
      enableTracing: false
    })
  ],
  exports: [
    MatDatepickerModule, 
    MatNativeDateModule 
  ],
  providers: [
    // Global singleton that keeps all the shared, global datastructures
    // injected into every component constructor
    Globals,
    ApplicationService,
    AuthenticationService,
    CandidateService,
    IiitbService,
    CandidateReadyGuard,
    CanDeactivateGuard,
    CountriesReadyGuard,
    CycleReadyGuard,
    ProgramsReadyGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor, // To intercept each http reqeust to the server and add the JWT token to it
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }