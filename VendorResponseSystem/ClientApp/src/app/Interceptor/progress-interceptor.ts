import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProgressService } from 'src/services/progress.service';

@Injectable()
export class ProgressInterceptor implements HttpInterceptor {
  constructor(private progressService: ProgressService) { }
  urls: string[]=[];
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {    
    this.urls.push(req.url);
    this.progressService.startLoading();
    return next.handle(req).pipe(
      finalize(() => {  
        var index = this.urls.indexOf(req.url);
        this.urls.splice(index, 1);
        if(this.urls.length === 0){
          this.progressService.stopLoading();
        }        
      })
    );
  }
}
