import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggingInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, fwd: HttpHandler){
    console.log(req.url);
    return fwd.handle(req).pipe(
      tap(
        event => {
          if(event.type === HttpEventType.Response) {
            console.log('logging interceptor : ');
            console.log(event.body);
          }
        }
      )
    );
  }

  constructor() { }
}