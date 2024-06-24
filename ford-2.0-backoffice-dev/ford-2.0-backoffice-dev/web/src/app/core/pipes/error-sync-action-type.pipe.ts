import { Pipe, PipeTransform } from '@angular/core';
import { ErrorSyncActionTypeEnum, SyncActionTypeEnum } from 'src/app/utils/constants';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

@Pipe({ name: 'errorSyncActionType' })
export class ErrorSyncActionTypePipe implements PipeTransform {

    constructor(private translate: TranslateService) { }

    transform(value: ErrorSyncActionTypeEnum): Observable<string> {
        if (!value)
            return of('-');

        return this.translate.get(`global.ERROR_${value}`);
    }

}