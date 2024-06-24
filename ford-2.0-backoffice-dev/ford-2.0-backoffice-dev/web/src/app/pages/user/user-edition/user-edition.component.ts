import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { Form, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { User } from "src/app/core/models/user.model";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { UserService } from "src/app/core/services/user.service";
import { InputType, MessageType, ScreenViewType, UserProfileEnum } from "src/app/utils/constants";
import { PasswordStrengthRegExp } from "src/app/utils/regular-expressions";
import Swal from "sweetalert2";

@Component({
    selector: 'user-edition',
    templateUrl: './user-edition.component.html',
    styleUrls: ['./user-edition.component.scss']
})
export class UserEditionComponent implements OnInit, OnDestroy, AfterViewInit {

    subscriptions: Subscription[];
    form: FormGroup;
    currentUser: User;
    screenViewType: ScreenViewType;

    breadCrumbItems: Array<{}>;

    weakPassword: boolean;
    isGettingData: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    submit: boolean;

    inputType: string;
    
    profileTypes: string[];

    selectedProfile: string;

    constructor(
        private navigationService: NavigationService,
        private userService: UserService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute    ,
        private fb: FormBuilder, 
        private messageService: MessageService
    ) {
        this.subscriptions = [];

        try {
            this.screenViewType = this.activatedRoute.snapshot.data['screenViewType'] as ScreenViewType;
        } catch (err) {
            this.screenViewType = ScreenViewType.CREATE;
        }

        this.isSaving = false;
        this.isDeleting = false;
        this.isGettingData = false;
        this.submit = false;
        this.inputType = InputType.PASSWORD;

        if (this.isCreateMode()) {
            this.form = this.fb.group({
                firstname: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
                lastname: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
                email: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'change' }),    
                profile: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
                password: new FormControl('', { validators: [Validators.required], updateOn: 'change' })      
            })

            this.breadCrumbItems = [{ label: this.translateService.instant('user.users') }, { label: this.translateService.instant('user.user-edition.user-create'), active: true }];
        } else {
            this.form = this.fb.group({
                firstname: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
                lastname: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
                email: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'change' }),
                profile: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            })

            this.breadCrumbItems = [{ label: this.translateService.instant('user.users') }, { label: this.translateService.instant('user.user-edition.user-edit'), active: true }];
        }

        this.currentUser = new User();
        
        this.profileTypes = [];
        for (const key in UserProfileEnum) {
          if (Object.prototype.hasOwnProperty.call(UserProfileEnum, key)) {
            this.profileTypes.push(UserProfileEnum[key]) ;
          }
        }

        this.selectedProfile = null;
    }

    ngOnInit(): void {
        if (this.isEditMode()) {
            this.parseExistingUser();
        }
    }

    ngAfterViewInit(): void {

    }

    parseExistingUser() {
        this.isGettingData = true
        const subscription = this.userService.getUserById(this.activatedRoute.snapshot.queryParams['id']).subscribe(user => {
            this.currentUser = user;
            this.controls.firstname.setValue(user.firstname);
            this.controls.lastname.setValue(user.lastname);
            this.controls.email.setValue(user.email);
            this.controls.profile.setValue(user.profile);
            this.selectedProfile = user.profile;
            this.isGettingData = false;
        }, (error:IError) => {
            this.isGettingData = false;
            this.enableControls();
            this.submit = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });

        this.subscriptions.push(subscription);
    }

    isCreateMode(): boolean {
        return this.screenViewType == ScreenViewType.CREATE;
    }

    isEditMode(): boolean {
        return this.screenViewType == ScreenViewType.EDIT;
    }

    cancel() {
        this.navigationService.toUsersList();
    }

    get controls() {
        return this.form.controls;
    }

    enableControls(): void {
        this.controls.firstname.enable();
        this.controls.lastname.enable();
        this.controls.email.enable();
        this.controls.profile.enable();
        if (this.isCreateMode()) this.controls.password.enable();
    }

    disableControls(): void {
        this.controls.firstname.disable();
        this.controls.lastname.disable();
        this.controls.profile.disable();
        if (this.isCreateMode()) this.controls.password.disable();
    }

    formSubmit() {
        this.submit = true;
        if (!this.form.valid || this.isSaving) return;

        this.isSaving = true;
        this.disableControls();

        this.setFormValues();

        if (this.isCreateMode())
            this.createUser();
        else if (this.isEditMode())
            this.editUser();
    }

    checkPasswordStrength(): boolean {
        return PasswordStrengthRegExp.test(this.currentUser.password);
    }

    createUser(): void {
        this.weakPassword = false;
        if (!this.checkPasswordStrength()) {
            this.enableControls();
            this.weakPassword = true;
            this.isSaving = false;
            return
        }
        const subscribe = this.userService.createUser(this.currentUser).subscribe(user => {
            this.isSaving = false;
            this.messageService.open('global.save-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toUsersList();
        }, (error: IError) => {
            this.isSaving = false;
            this.enableControls();
            this.submit = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscribe);
    }



    editUser(): void {
        const subscribe = this.userService.editUser(this.currentUser).subscribe(user => {
            this.isSaving = false;
            this.messageService.open('global.edit-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toUsersList();
        }, (error: IError) => {
            this.isSaving = false;
            this.enableControls();
            this.submit = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscribe);
    }

    askForDeleteUser() {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('user.user-list.are-you-sure'),
            text: this.translateService.instant('user.user-list.user-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('user.user-list.delete'),
            cancelButtonText: this.translateService.instant('user.user-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteUser(this.currentUser.id);
            }
        })
    }

    private deleteUser(id: string): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.userService.deleteUser(id)
            .subscribe(() => {
                this.messageService.open('global.delete-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.navigationService.toUsersList();
            }, (error: IError) => {
                this.isDeleting = false;
                this.enableControls();
                this.submit = false;
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });

        this.subscriptions.push(subscription);
    }

    setFormValues(): void {
        this.currentUser.firstname = this.controls.firstname.value;
        this.currentUser.lastname = this.controls.lastname.value;
        this.currentUser.email = this.controls.email.value;
        this.currentUser.profile = this.controls.profile.value;
        if (this.isCreateMode()) this.currentUser.password = this.controls.password.value;
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}