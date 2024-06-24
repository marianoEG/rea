import { Pipe, PipeTransform } from '@angular/core';
import { SyncActionTypeEnum } from 'src/app/utils/constants';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

@Pipe({ name: 'syncActionType' })
export class SyncActionTypePipe implements PipeTransform {

    constructor(private translate: TranslateService) { }

    transform(value: SyncActionTypeEnum): Observable<string> {
        if (!value)
            return of('-');

        return this.translate.get(`global.${value}`);
    }

}