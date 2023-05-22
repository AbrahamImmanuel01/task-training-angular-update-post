import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, fwd: HttpHandler){
    console.log(req);
    const clonedReq = req.clone(
      {headers: req.headers.append('Basic','contoh-MD5')}
    );
    return fwd.handle(clonedReq).pipe(
      tap(
        event => {
          if(event.type === HttpEventType.Response) {
            console.log('auth interceptor : ');
            console.log(event.body);
          }
        }
      )
    ); // cantinue request
  }

  constructor() { }
}
