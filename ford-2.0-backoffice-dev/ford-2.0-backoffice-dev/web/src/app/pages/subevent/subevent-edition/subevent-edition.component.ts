import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { Subscription, forkJoin } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { Event } from "src/app/core/models/event.model";
import { Subevent } from "src/app/core/models/subevent.model";
import { EventService } from "src/app/core/services/event.service";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { SubeventService } from "src/app/core/services/subevent.service";
import { MessageType, ScreenViewType } from "src/app/utils/constants";
import { ISOToDate } from "src/app/utils/iso-to-date";
import Swal from "sweetalert2";

@Component({
    selector: 'subevent-edition',
    templateUrl: './subevent-edition.component.html',
    styleUrls: ['./subevent-edition.component.scss']
})
export class SubeventEditionComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    form: FormGroup;
    currentSubevent: Subevent;
    screenViewType: ScreenViewType;

    eventList: Event[];
    selectedEvent: Event;

    breadCrumbItems: Array<{}>;

    isGettingData: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    submit: boolean;

    constructor(
        private navigationService: NavigationService,
        private subeventService: SubeventService,
        private eventService: EventService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private messageService: MessageService,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = [];
        this.eventList = [];

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
            dateFrom: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            dateTo: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            enable: new FormControl(false, { validators: [Validators.required], updateOn: 'change' }),
            event: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            guestNumber: new FormControl(0, { validators: [Validators.required], updateOn: 'change' })
        })

        if (this.isCreateMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('subevent.subevents') }, { label: this.translateService.instant('subevent.subevent-edition.subevent-create'), active: true }];
        } else if (this.isEditMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('subevent.subevents') }, { label: this.translateService.instant('subevent.subevent-edition.subevent-edit'), active: true }];
        } else if (this.isViewMode()) 
            this.breadCrumbItems = [{ label: this.translateService.instant('subevent.subevents') }, { label: this.translateService.instant('subevent.subevent-view'), active: true }];

        this.currentSubevent = new Subevent();
    }

    ngOnInit(): void {
        
        const subscription = forkJoin([
            this.eventService.getEvents(null, null, null)
        ]).subscribe(([response]) => {
            this.eventList = response.listOfEntities;

            if (this.activatedRoute.snapshot.queryParams['eventId']) {
                this.selectedEvent = this.eventList.find(event => event.id == this.activatedRoute.snapshot.queryParams['eventId'])
            }

            if (this.isEditMode()) {
                this.parseExistingSubevent();
            }

            if (this.isViewMode()) {
                this.parseExistingSubevent();
                this.disableControls();
            }

        }, (error: IError) => {
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);


    }

    getEventsList(): void {
        const subscription = this.eventService.getEvents(null, null, null).subscribe(response => {
            this.eventList = response.listOfEntities;
        }, (error: IError) => {
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    parseExistingSubevent() {
        this.isGettingData = true
        const subscription = this.subeventService.getSubeventById(
            this.activatedRoute.snapshot.queryParams['eventId'],
            this.activatedRoute.snapshot.queryParams['subeventId']
        ).subscribe(subevent => {
            this.currentSubevent = subevent;
            this.controls.name.setValue(subevent.name);

            let isoDateFrom = this.formatDate(subevent.dateFrom);
            let isoDateTo =  this.formatDate(subevent.dateTo);

            this.controls.dateFrom.setValue(isoDateFrom);
            this.controls.dateTo.setValue(isoDateTo);
            this.controls.guestNumber.setValue(subevent.guestNumber);
            this.controls.enable.setValue(subevent.enable);

            this.selectedEvent = this.eventList.find(event => event.id == subevent.eventID);
            this.isGettingData = false;
        }, (error: IError) => {
            this.isGettingData = false;
            if (!this.isViewMode()) this.enableControls();
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

    getEventDatesString(): string {
        return this.translateService.instant('subevent.subevent-edition.event-date-range') + ': ' +
            new Date(this.formatDate(this.selectedEvent.dateFrom)).toLocaleString() + ' - ' +
            new Date(this.formatDate(this.selectedEvent.dateTo)).toLocaleString();
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
        if (this.selectedEvent) {
            this.navigationService.toSubeventList({
                queryParams: {
                    'eventId': this.selectedEvent.id
                }
            });
        } else {
            this.navigationService.toSubeventList();
        }
    }

    get controls() {
        return this.form.controls;
    }

    enableControls(): void {
        this.controls.name.enable();
        this.controls.dateFrom.enable();
        this.controls.dateTo.enable();
        this.controls.enable.enable();
        this.controls.event.enable();
        this.controls.guestNumber.enable();
    }

    disableControls(): void {
        this.controls.name.disable();
        this.controls.dateFrom.disable();
        this.controls.dateTo.disable();
        this.controls.enable.disable();
        this.controls.event.disable();
        this.controls.guestNumber.disable();
    }

    validateRangeDates(): boolean {
        return new Date(this.controls.dateFrom.value) <= new Date(this.controls.dateTo.value);
    }

    validateEventDates(): boolean {
        return (new Date(this.controls.dateFrom.value) >= this.selectedEvent.getDateFromToLocalTime() &&
            new Date(this.controls.dateFrom.value) <= this.selectedEvent.getDateToToLocalTime() &&
            new Date(this.controls.dateTo.value) >= this.selectedEvent.getDateFromToLocalTime() &&
            new Date(this.controls.dateTo.value) <= this.selectedEvent.getDateToToLocalTime())
    }

    formSubmit() {
        this.submit = true;
        if (!this.form.valid || this.isSaving) return;

        if (!this.validateRangeDates()) {
            this.messageService.open('subevent.subevent-edition.date-range-invalid', MessageType.ERROR);
            return;
        }

        // Se desactiva por problemas con la hora del evento padre que esta en UTC y compara contra hora local del subevento.
        //if (!this.validateEventDates()) {
        //    this.messageService.open('subevent.subevent-edition.date-out-of-range', MessageType.ERROR);
        //    return;
        //}

        this.isSaving = true;
        this.disableControls();


        this.setFormValues();
     
        if (this.isCreateMode())
            this.createSubevent();
        else if (this.isEditMode())
            this.editSubevent();
    }

    createSubevent(): void {
        const subscribe = this.subeventService.createSubevent(this.currentSubevent).subscribe(subevent => {
            this.isSaving = false;
            this.messageService.open('global.save-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toSubeventList({
                queryParams: {
                    'eventId': this.selectedEvent.id
                }
            });
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



    editSubevent(): void {
        const subscribe = this.subeventService.editSubevent(this.currentSubevent).subscribe(subevent => {
            this.isSaving = false;
            this.messageService.open('global.edit-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toSubeventList({
                queryParams: {
                    'eventId': this.selectedEvent.id
                }
            });
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

    askForDeleteSubevent() {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('subevent.subevent-list.are-you-sure'),
            text: this.translateService.instant('subevent.subevent-list.subevent-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('subevent.subevent-list.delete'),
            cancelButtonText: this.translateService.instant('subevent.subevent-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteSubevent(this.currentSubevent.id);
            }
        })
    }

    private deleteSubevent(subEventId: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.subeventService.deleteSubevent(this.selectedEvent.id, subEventId)
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
        this.currentSubevent.name = this.controls.name.value;
        this.currentSubevent.dateFrom = this.controls.dateFrom.value;
        this.currentSubevent.dateTo = this.controls.dateTo.value;
        this.currentSubevent.enable = this.controls.enable.value;
        this.currentSubevent.eventID = this.selectedEvent.id;

        this.currentSubevent.dateFrom = new Date(this.currentSubevent.dateFrom).toISOString();
        this.currentSubevent.dateTo = new Date(this.currentSubevent.dateTo).toISOString();

        this.currentSubevent.guestNumber = this.controls.guestNumber.value;
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
        this.currentSubevent.image = null;
    }

    getDropzoneResponse(response): void {
        this.currentSubevent.image = response[1];
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}