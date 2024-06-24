import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

    constructor(private localStorageService: LocalStorageService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.localStorageService.getSessionToken();
        const authReq = request.clone({
            headers: request.headers
                //.set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
        });
        console.log('HeaderInterceptor - Content-Type And Authorization Header Added', authReq);
        return next.handle(authReq);
    }
}