import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { LocalStorageService } from '../services/local-storage.service';
import { NavigationService } from '../services/navigation.service';
import { IError } from '../interfaces/error.interface';
import { MessageService } from '../services/message.service';
import { MessageType } from 'src/app/utils/constants';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {

    constructor(
        private localStorageService: LocalStorageService,
        private navigationService: NavigationService,
        private messageService: MessageService
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            map(res => {
                return res
            }),
            catchError((error: HttpErrorResponse) => {
                return throwError(this.catchResponse(error));
            })
        );
    }

    private catchResponse(error: HttpErrorResponse): any {
        switch (error.status) {
            case 500:
                try {
                    let apiError: IError = error.error as IError
                    if (apiError && apiError.Message) {
                        // TODO: show message
                        //this.toastService.showMessageTranslated(ToastMessageTypeEnum.ERROR, `API.${apiError.messageCode}`, null, 'GLOBAL.CLOSE');
                    }
                    return apiError;
                } catch (err) {
                    return error.error;
                }
            case 401:
                this.messageService.open("global.session-expired", MessageType.ERROR);
                this.logoutUser();
                break;
            default:
                // TODO: show global error
                // this.toastService.showMessageTranslated(ToastMessageTypeEnum.ERROR, `API.UNHANDLE_ERROR`, null, 'GLOBAL.CLOSE');
                return error.error as IError;
        }
    }

    private logoutUser(): void {
        // TODO: Show Sesion expired message
        this.localStorageService.clearAll();
        this.navigationService.toLogin();
    }
}