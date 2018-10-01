import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Observable';
import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { GlobalconstantService } from './globalconstant.service';
import { HttpRequest, HttpHandler, HttpEvent,HttpInterceptor } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/fromPromise';
import { fromPromise } from 'rxjs/observable/fromPromise';
//import { from } from 'rxjs';
//var observableFromPromise = fromPromise(promiseSrc);
@Injectable({
  providedIn: 'root'
})
export class TokeninterceptorService {

  constructor(private global:GlobalconstantService) {
    console.log('Hello TokeninterceptorService');
   }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return Observable.fromPromise(this.handleAccess(request, next));
  }

  


  private async handleAccess(request: HttpRequest<any>, next: HttpHandler):
  Promise<HttpEvent<any>> {
     // const token = await this.global.getToken();
      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE1MzgxNDAyNjIsImp0aSI6IjlVU2t5SGpCUHJPMkhIcEhPbVd3ZVJjTUJiMEQ5bUk1IiwiaXNzIjoiMTkyLjE2OC4yLjE2OjgwODgiLCJuYmYiOjE1MzgxNDAyNzIsImV4cCI6bnVsbCwiZGF0YSI6eyJ1c2VyX2lkIjoiMSIsInVzZXJfbmFtZSI6ImFkbWluIiwidXNlcl9yb2xlX25hbWUiOiJBRE1JTiJ9fQ.MStfbgon6tSeZ_QcLIjo1uenVDcd6NxT10tiJlS67X2Xdfr9uUTIOuhHvmGSAcWapP_zF5CU4aD1f-V126AW7g";
      const apikey = await this.global.getAPiKey();
      let changedRequest = request;
      // HttpHeader object immutable - copy values
      const headerSettings: {[name: string]: string | string[]; } = {};

      for (const key of request.headers.keys()) {
        headerSettings[key] = request.headers.getAll(key);
      }
      if (token) {
        headerSettings['Authorization'] = 'Bearer ' + token;
      }
      //headerSettings['Content-Type'] = 'application/json';
      //headerSettings['X-Api-Key'] = apikey;
      headerSettings['X-Api-Key'] = "testtoken";
      headerSettings['Content-Type'] = 'application/x-www-form-urlencoded';



      const newHeader = new HttpHeaders(headerSettings);

      changedRequest = request.clone({
        headers: newHeader});
      return next.handle(changedRequest).toPromise();
    }
}
