import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDatePipe } from './custom-date.pipe';
import { SyncActionTypePipe } from './sync-action-type.pipe';
import { ErrorSyncActionTypePipe } from './error-sync-action-type.pipe';

@NgModule({
  declarations: [CustomDatePipe, SyncActionTypePipe, ErrorSyncActionTypePipe],
  imports: [
    TranslateModule,

  ],
  exports: [CustomDatePipe, SyncActionTypePipe, ErrorSyncActionTypePipe],
  providers: [DatePipe]
})
export class PipeModule { }
