import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MENU, READONLYMENU } from '../../../layouts/sidebar/menu';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { InputType, MessageType, UserProfileEnum } from 'src/app/utils/constants';
import { IError } from 'src/app/core/interfaces/error.interface';
import { MessageService } from 'src/app/core/services/message.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginPageComponent {

  loginForm: FormGroup;
  submitted: boolean;
  loading: boolean;

  menuItems = [];
  inputType: string;
  //private _success = new Subject<string>();

  constructor(
    private navigationService: NavigationService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private messageService: MessageService,
    private ngxPermissionsService: NgxPermissionsService
  ) {

    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'change' }),
      password: new FormControl('', { validators: [Validators.required], updateOn: 'change' })
    });
    this.submitted = false;

    this.inputType = InputType.PASSWORD;
  }

  login() {
    this.loading = true;
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((userSession) => {
      this.localStorageService.saveSession(userSession);
      this.ngxPermissionsService.loadPermissions([userSession.profile]);
      if (userSession.profile == UserProfileEnum.ADMIN) {
        this.menuItems = MENU;
      } else if (userSession.profile == UserProfileEnum.READONLY) {
        this.menuItems = READONLYMENU;
      }
      this.loading = false;
      this.navigationService.navigateTo(this.menuItems[1].link);

    }, (error: IError) => {
      this.loading = false;
      if (error) {
        if (error.Code == "USER_PASSWORD_EXPIRED") {
          this.navigationService.toChangePassword({
            queryParams: {
              'email': this.loginForm.value.email
            }
          });
        } else
          this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
      } else {
        this.messageService.open('global.server_connection_error', MessageType.ERROR);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.loginForm.controls.email.errors && !this.loginForm.controls.password.errors) {
      this.login();
    }
  }

  toggleInputType(): void {
    if (this.inputType == InputType.PASSWORD) {
      this.inputType = InputType.TEXT;
    } else
      this.inputType = InputType.PASSWORD;
  }

  isInputTypeText(): boolean {
    return this.inputType == InputType.TEXT;
  }

  isInputTypePassword(): boolean {
    return this.inputType == InputType.PASSWORD;
  }

}
