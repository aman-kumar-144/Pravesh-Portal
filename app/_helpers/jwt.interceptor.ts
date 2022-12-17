import { Injectable } from '@angular/core';
import { Globals } from '../globals';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private globals: Globals) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Intercepts every http request to the server and adds the JWT token to the header
    if (this.globals.currentCredentials && this.globals.currentCredentials.access_token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.globals.currentCredentials.access_token}`
            }
        });
    }

    return next.handle(request);
  }
}
