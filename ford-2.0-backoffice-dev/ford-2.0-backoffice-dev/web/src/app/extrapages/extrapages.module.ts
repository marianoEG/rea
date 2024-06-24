import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgOtpInputModule } from  'ng-otp-input';

import { ExtrapagesRoutingModule } from './extrapages-routing.module';

import { Page404Component } from './page404/page404.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ Page404Component ],
  imports: [
    CommonModule,
    CarouselModule,
    ExtrapagesRoutingModule,
    NgOtpInputModule,
    TranslateModule
  ]
})
export class ExtrapagesModule { }
