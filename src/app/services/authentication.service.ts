import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Globals } from '../globals';
import { map } from 'rxjs/operators'


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient, private globals: Globals) { }

  login(email: string, password: string) {
    const postAt = (this.globals.rootUrl + 'accounts/login/');
    console.log("The PostAT URL is ",postAt);
    return this.http.post<any>(postAt,
      {username: email, password: password})
      .pipe(map(credentials => {
        console.log("The Email and password", email , " ", password);
        console.log("The Credentials is ", credentials);
        // login successful if there's a jwt token in the response
        if (credentials) {
          this.globals.saveCredentials(JSON.stringify(credentials));
        }

        return credentials;
      }));
  }

  usersPrefix() {
    return (this.globals.rootUrl + 'accounts/users/' + (this.globals.currentCredentials ? (this.globals.currentCredentials.user.pk + '/') : ''));
  }

  changePassword(newPassword: string, repeatPassword: string, oldPassword: string) {
    const params = {'old_password': oldPassword, 'new_password1': newPassword, 'new_password2': repeatPassword};
    return this.http.post<any>((this.usersPrefix() + 'password_change/'),
      { params }, httpOptions)
      .pipe(map(credentials => {
        return credentials;
      }));
  }

  resetPassword(email: string) {
    const params = {'email': email };
    return this.http.post<any>((this.usersPrefix() + 'reset_password/'), { params })
      .pipe(map(credentials => {
        return credentials;
      }));
  }

  logout() {
      return this.http.post((this.globals.rootUrl + 'logout/'), {});
  }

  fetchUser() {
    return this.http.get<any>((this.usersPrefix() + 'fetch/'));
  }
  
  register(formData: FormData) {
    return this.http.post((this.globals.rootUrl + 'accounts/register/'), formData);
  }

  sessionAlive() {
    return this.http.get<any>((this.globals.rootUrl + 'accounts/users/24' + '/session_alive/'));
  }

  refreshToken() {
    return this.http.get<any>((this.globals.rootUrl + 'refresh-token/'));
  }
}
