import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { Form, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { Event } from "src/app/core/models/event.model";
import { EventService } from "src/app/core/services/event.service";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { MessageType, ScreenViewType } from "src/app/utils/constants";
import { ISOToDate } from "src/app/utils/iso-to-date";
import Swal from "sweetalert2";

const CODE_MAX_LENGTH = 30;

@Component({
    selector: 'event-edition',
    templateUrl: './event-edition.component.html',
    styleUrls: ['./event-edition.component.scss']
})
export class EventEditionComponent implements OnInit, OnDestroy, AfterViewInit {

    subscriptions: Subscription[];
    form: FormGroup;
    currentEvent: Event;
    screenViewType: ScreenViewType;

    breadCrumbItems: Array<{}>;

    isGettingData: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    submit: boolean;

    codeMaxLengthTranslate = { count: this.codeMaxLength };

    constructor(
        private navigationService: NavigationService,
        private eventService: EventService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private messageService: MessageService,
        private localStorageService: LocalStorageService
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

        this.form = this.fb.group({
            name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            code: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.codeMaxLength)], updateOn: 'change' }),
            dateFrom: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            dateTo: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            enable: new FormControl(false, { validators: [Validators.required], updateOn: 'change' }),
            testDriveDemarcationOwnerEnabled: new FormControl(false, { validators: [Validators.required], updateOn: 'change' }),
            testDriveDemarcationOwnerInCaravanEnabled: new FormControl(false, { validators: [Validators.required], updateOn: 'change' }),
            testDriveDemarcationFordEnabled: new FormControl(false, { validators: [Validators.required], updateOn: 'change' })
        })

        if (this.isCreateMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('event.events') }, { label: this.translateService.instant('event.event-edition.event-create'), active: true }];
        } else if (this.isEditMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('event.events') }, { label: this.translateService.instant('event.event-edition.event-edit'), active: true }];
        } else if (this.isViewMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('event.events') }, { label: this.translateService.instant('event.event-view'), active: true }];
        }

        this.currentEvent = new Event();
    }

    ngOnInit(): void {

        if (this.isEditMode()) {
            this.parseExistingEvent();
        }

        if (this.isViewMode()) {
            this.disableControls();
            this.parseExistingEvent();
        }
    }

    ngAfterViewInit(): void {

    }

    parseExistingEvent() {
        this.isGettingData = true
        const subscription = this.eventService.getEventById(this.activatedRoute.snapshot.queryParams['id']).subscribe(event => {
            this.currentEvent = event;
            this.controls.name.setValue(event.name);
            this.controls.code.setValue(event.code);

            let isoDateFrom = this.formatDate(event.dateFrom);
            let isoDateTo = this.formatDate(event.dateTo);

            this.controls.dateFrom.setValue(isoDateFrom);
            this.controls.dateTo.setValue(isoDateTo);
            this.controls.enable.setValue(event.enable);
            this.controls.testDriveDemarcationOwnerEnabled.setValue(event.testDriveDemarcationOwnerEnabled);
            this.controls.testDriveDemarcationOwnerInCaravanEnabled.setValue(event.testDriveDemarcationOwnerInCaravanEnabled);
            this.controls.testDriveDemarcationFordEnabled.setValue(event.testDriveDemarcationFordEnabled);

            this.isGettingData = false;
        }, (error: IError) => {
            this.isGettingData = false;
            if (!this.isViewMode) this.enableControls();
            this.submit = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });

        this.subscriptions.push(subscription);
    }

    formatDate(date: string): string {
        let isoDate = ISOToDate(date);
        let dateToReturn = isoDate.getFullYear() + '-';
        isoDate.getMonth() < 9 ? dateToReturn += '0' + (isoDate.getMonth() + 1) + '-' : dateToReturn += (isoDate.getMonth() + 1) + '-'
        isoDate.getDate() < 10 ? dateToReturn += '0' + isoDate.getDate() + 'T' : dateToReturn += isoDate.getDate() + 'T'
        dateToReturn += isoDate.getHours() + ':';
        dateToReturn += isoDate.getMinutes();
        return dateToReturn;
    }

    isCreateMode(): boolean {
        return this.screenViewType == ScreenViewType.CREATE;
    }

    isEditMode(): boolean {
        return this.screenViewType == ScreenViewType.EDIT;
    }

    isViewMode(): boolean {
        return this.screenViewType == ScreenViewType.VIEW;
    }

    cancel() {
        this.navigationService.toEventList();
    }

    get controls() {
        return this.form.controls;
    }

    enableControls(): void {
        this.controls.name.enable();
        this.controls.code.enable();
        this.controls.dateFrom.enable();
        this.controls.dateFrom.enable();
        this.controls.enable.enable();
        this.controls.testDriveDemarcationOwnerEnabled.enable();
        this.controls.testDriveDemarcationOwnerInCaravanEnabled.enable();
        this.controls.testDriveDemarcationFordEnabled.enable();
    }

    disableControls(): void {
        this.controls.name.disable();
        this.controls.code.disable();
        this.controls.dateFrom.disable();
        this.controls.dateTo.disable();
        this.controls.enable.disable();
        this.controls.testDriveDemarcationOwnerEnabled.disable();
        this.controls.testDriveDemarcationOwnerInCaravanEnabled.disable();
        this.controls.testDriveDemarcationFordEnabled.disable();
    }

    validateRangeDates(): boolean {
        return this.controls.dateFrom.value <= this.controls.dateTo.value;
    }

    formSubmit() {
        this.submit = true;
        if (!this.form.valid || this.isSaving) return;

        if (!this.validateRangeDates()) {
            this.messageService.open('subevent.subevent-edition.date-range-invalid', MessageType.ERROR);
            return;
        }

        this.isSaving = true;
        this.disableControls();

        this.setFormValues();

        if (this.isCreateMode())
            this.createEvent();
        else if (this.isEditMode())
            this.editEvent();
    }

    createEvent(): void {
        const subscribe = this.eventService.createEvent(this.currentEvent).subscribe(event => {
            this.isSaving = false;
            this.messageService.open('global.save-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toEventList();
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

    editEvent(): void {
        const subscribe = this.eventService.editEvent(this.currentEvent).subscribe(event => {
            this.isSaving = false;
            this.messageService.open('global.edit-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toEventList();
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

    askForDeleteEvent() {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('event.event-list.are-you-sure'),
            text: this.translateService.instant('event.event-list.event-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('event.event-list.delete'),
            cancelButtonText: this.translateService.instant('event.event-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteEvent(this.currentEvent.id);
            }
        })
    }

    private deleteEvent(id: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.eventService.deleteEvent(id)
            .subscribe(() => {
                this.messageService.open('global.delete-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.navigationService.toDealershipList();
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
        this.currentEvent.name = this.controls.name.value;
        this.currentEvent.code = this.controls.code.value;
        this.currentEvent.dateFrom = this.controls.dateFrom.value;
        this.currentEvent.dateTo = this.controls.dateTo.value;
        this.currentEvent.enable = this.controls.enable.value;
        this.currentEvent.testDriveDemarcationOwnerEnabled = this.controls.testDriveDemarcationOwnerEnabled.value;
        this.currentEvent.testDriveDemarcationOwnerInCaravanEnabled = this.controls.testDriveDemarcationOwnerInCaravanEnabled.value;
        this.currentEvent.testDriveDemarcationFordEnabled = this.controls.testDriveDemarcationFordEnabled.value;

        this.currentEvent.dateFrom = new Date(this.currentEvent.dateFrom).toISOString();
        this.currentEvent.dateTo = new Date(this.currentEvent.dateTo).toISOString();
    }

    public eventImageDropzone: DropzoneConfigInterface = {
        clickable: true,
        maxFiles: 1,
        addRemoveLinks: true,
        autoReset: null,
        errorReset: null,
        cancelReset: null,
        acceptedFiles: '.png, .jpg',
        headers: {
            Authorization: 'Bearer ' + this.localStorageService.getSessionToken()
        }
    };

    removeImage(): void {
        this.currentEvent.image = null;
    }

    getDropzoneResponse(response): void {
        this.currentEvent.image = response[1];
    }

    get codeMaxLength(): number {
        return CODE_MAX_LENGTH;
    }
    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}