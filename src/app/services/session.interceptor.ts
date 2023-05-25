import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Constants } from '../Constants/constants';
import { Router } from '@angular/router';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

  constructor( private router: Router,) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem(Constants.APP.SESSION_ID);
    
    if (token) {
      // adds token to header of all apis
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });  
    }
    return next.handle(request).pipe(
      tap(
        event => {
          if (event instanceof Response) {
            // to check for invalid token or deactivated user
            // if ([401, 403].includes(event.status) || event.body?.statusCode === -2) {
            //   localStorage.clear();
            //   this.router.navigate(['/login']);
            // }
            // code to handle successful response
          }
        },
        error => {
          // code to handle error response
          if ([401, 403].includes(error.status) || error.body?.statusCode === -2) {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      )
    );
  }
}
