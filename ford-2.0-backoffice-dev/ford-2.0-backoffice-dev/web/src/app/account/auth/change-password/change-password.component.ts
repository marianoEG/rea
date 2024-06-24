import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { UserService } from "src/app/core/services/user.service";
import { InputType, MessageType } from "src/app/utils/constants";
import { PasswordStrengthRegExp } from "src/app/utils/regular-expressions";

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnDestroy {

  subscriptions: Subscription[];

  currentEmail: string;
  newPassword: string;
  confirmPassword: string;
  inputType1: string;
  inputType2: string;

  passwordsNotMatch: boolean;
  noPasswordSupplied: boolean;
  weakPassword: boolean;

  constructor(
    private userService: UserService,
    private navigationService: NavigationService,
    private localStorageService: LocalStorageService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
  ) {
    this.currentEmail = this.activatedRoute.snapshot.queryParams['email'],
      this.newPassword = '';
    this.confirmPassword = '';
    this.inputType1 = InputType.PASSWORD;
    this.inputType2 = InputType.PASSWORD;

    this.subscriptions = [];

    this.passwordsNotMatch = false;
    this.noPasswordSupplied = false;
  }

  checkPasswords(): boolean {
    return this.newPassword == this.confirmPassword;
  }

  checkPasswordStrength(): boolean {
    return PasswordStrengthRegExp.test(this.newPassword);
  }

  backToLogin():void {
    this.navigationService.toLogin();
  }

  changePassword(): void {
    this.passwordsNotMatch = false;
    this.noPasswordSupplied = false;
    this.weakPassword = false;

    if (this.newPassword == '') {
      this.noPasswordSupplied = true;
      return
    }

    if (!this.checkPasswordStrength()) {
      this.weakPassword = true;
      return
    }

    if (!this.checkPasswords()) {
      this.passwordsNotMatch = true;
      return
    }

    this.userService.changePass(this.currentEmail, this.newPassword).subscribe(() => {
      this.messageService.open('auth.change-password.password_update_successfull', MessageType.SUCCESS);
      this.navigationService.toLogin();
    }, (error: IError) => {
      if (error) {
        this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
      } else {
        this.messageService.open('global.server_connection_error', MessageType.ERROR);
      }
    });
  }

  toggleInputType1(): void {
    if (this.inputType1 == InputType.PASSWORD) {
      this.inputType1 = InputType.TEXT;
    } else
      this.inputType1 = InputType.PASSWORD;
  }

  toggleInputType2(): void {
    if (this.inputType2 == InputType.PASSWORD) {
      this.inputType2 = InputType.TEXT;
    } else
      this.inputType2 = InputType.PASSWORD;
  }

  isInputTypeText(inputType: string): boolean {
    return inputType == InputType.TEXT;
  }

  isInputTypePassword(inputType): boolean {
    return inputType == InputType.PASSWORD;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
  }

}