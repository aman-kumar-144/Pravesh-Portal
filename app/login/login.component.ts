import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SoochanaComponent } from '../soochana/soochana.component';
import { Globals } from '../globals';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  @Input() overlayZ !: number;
  @ViewChild(SoochanaComponent, { static: true }) soochana !: SoochanaComponent;
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();

  model : any = {};
  title !: string;
  list: any[] = [];
  login_error !: boolean;
  show = false;

  constructor(
      private authenticationService: AuthenticationService,
      @Inject(DOCUMENT) private document: any,
      private router : Router,
      public globals: Globals) {
    this.model.forgot = false;
    this.model.changePassword = false;
  }

  ngOnInit() {
    this.login_error = false;
  }

  showDialog() {
    console.log("Inside Login.component.ts -> showDialog()")
    this.show = true;
    this.login_error = false;
    this.model.password = '';
  }

  onCancel() {
    this.show = false;
  }

  logout(message: string) {
    this.onCancel();
    console.log("Inside Login Component ---> logout()");
    this.authenticationService.logout()
      .subscribe(
        result => {
          this.globals.eraseCredentials();
          this.soochana.success('logout-success', message);
        },
        error => {
          this.soochana.error('logout-error', error);
        });
  }

  postLogin() {
    this.onCancel();
    this.authenticationService.fetchUser()
      .subscribe(
        details => {
          const user = (details.hasOwnProperty('user')) ? details.user : details;
          console.log("The USER Details are ", user)
          console.log("The USER Details are ", details)
          this.globals.updateUserDetails(user);
          // if (user.temp_password) {
          //   const message = ('You seem to be using a temporary password. ' +
          //     'You need to change your password before you can continue using Pravesh. ' +
          //     'Please use the Change Password option when logging in with the temporary password.');
          //   this.logout(message);
          // } 
          // else 
          if (user.is_candidate) {
            this.globals.candidate = details;
            this.loggedIn.emit(true);
            console.log("User.is_candidate is True")
            this.router.navigate(['home']);
          } 
          else if (user.is_staff && (user.is_faculty || user.is_office)) {
            const message = ('You are logged into Pravesh. You will now be redirected to the verification / evaluation pages');
            this.soochana.info('transfer', message);
            this.globals.eraseCredentials();
          }
        }
      );
  }

  login() {
    if (!this.globals.currentCredentials) {
      console.log("The Model Email is ", this.model.email);
      console.log("The Model Password is ",this.model.password);
      this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(
        (data: any) => {
          if (this.model.changePassword) {
            console.log("login() -> changePassword(). The Password needs to be changed");
            this.changePassword();
          } 
          else {
            console.log("login() -> postLogin()");
            this.postLogin();
          }
        },
        (error: any) => {
          this.login_error = true;
          // this.soochana.error('login-error', error);
        });
    }
    if (this.model.changePassword) {
      this.changePassword();
    }
  }

  changePassword() {
    this.onCancel();
    if (this.globals.currentCredentials) {
      this.authenticationService.changePassword(this.model.newPassword, this.model.repeatPassword, this.model.password)
        .subscribe(
          (data: any) => {
            this.onCancel();
            const message = ('Your password has been successfully changed. ' +
                              'You however need to login again with your new password to continue using Pravesh.');
            this.logout(message);
          },
          (error: any) => {
            this.soochana.error('changePassword-error', error);
          });
    }
  }

  resetPassword() {
    this.onCancel();
    this.authenticationService.resetPassword(this.model.email)
      .subscribe(
        (data: any) => {
          const message = ('Your password has been successfully reset. Please check your registered email and use the ' +
                           'temporary password that has been generated to login. You however need to change the password after you ' +
                           'login with the temporary password to continue using Pravesh');
          this.soochana.success('reset', message);
        },
        (error: any) => {
          this.soochana.error('reset-error', error);
        });
  }

  authFuncton() {
    if(this.model.forgotPassword) {
      this.resetPassword();
    } 
    else {
      this.login();
    }
  }

  toggleChange() {
    this.model.forgotPassword = (this.model.changePassword ? this.model.forgotPassword : false);
    this.model.changePassword = !this.model.changePassword;
  }

  returnSoochana(status: any) {
    if (status.purpose === 'transfer') {
      this.document.location.href = (this.globals.rootUrl + 'active/');
    }
  }
}