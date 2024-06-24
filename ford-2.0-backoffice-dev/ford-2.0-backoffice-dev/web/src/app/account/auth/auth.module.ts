import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { UIModule } from '../../shared/ui/ui.module';
import { LoginPageComponent } from './login/login.component';

import { AuthRoutingModule } from './auth-routing';
import { TranslateModule } from '@ngx-translate/core';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [LoginPageComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
    UIModule,
    AuthRoutingModule,
    CarouselModule,
    TranslateModule
  ]
})
export class AuthModule { }
