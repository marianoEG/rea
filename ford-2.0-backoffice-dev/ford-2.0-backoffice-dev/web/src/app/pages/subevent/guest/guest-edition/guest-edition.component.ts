import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import html2canvas from "html2canvas";
import { forkJoin, fromEvent, Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { FeatureGroup } from "src/app/core/models/feature-group.model";
import { Guest } from "src/app/core/models/guest.model";
import { Vehicle } from "src/app/core/models/vehicle.model";
import { GuestService } from "src/app/core/services/guest.services";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { VehicleService } from "src/app/core/services/vehicle.service";
import { GuestStates, GuestType, MessageType, ScreenViewType } from "src/app/utils/constants";
import { capitalize } from "src/app/utils/functions";
import Swal from "sweetalert2";

@Component({
    selector: 'guest-edition',
    templateUrl: './guest-edition.component.html',
    styleUrls: ['./guest-edition.component.scss']
})
export class GuestEditionComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    form: FormGroup;
    currentGuest: Guest;
    screenViewType: ScreenViewType;

    types = [];
    states = [];

    breadCrumbItems: Array<{}>;

    isGettingData: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    isDownloadingQR: boolean;
    submit: boolean;

    eventId: number;
    subeventId: number;
    subEventName: string;

    vehicleList: Vehicle[];

    constructor(
        private navigationService: NavigationService,
        private guestService: GuestService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private messageService: MessageService,
        private localStorageService: LocalStorageService,
        public vehicleService: VehicleService
    ) {
        this.subscriptions = [];

        this.types.push(GuestType.OWNER);
        this.types.push(GuestType.COMPANION);

        this.states.push(GuestStates.ASSISTED);
        this.states.push(GuestStates.ABSENT);
        this.states.push(GuestStates.ABSENT_NOTICE);

        try {
            this.screenViewType = this.activatedRoute.snapshot.data['screenViewType'] as ScreenViewType;
        } catch (err) {
            this.screenViewType = ScreenViewType.CREATE;
        }

        this.isSaving = false;
        this.isDeleting = false;
        this.isGettingData = false;
        this.submit = false;

        this.eventId = this.localStorageService.getSubevent().eventID;
        this.subeventId = this.localStorageService.getSubevent().id;
        this.subEventName = this.localStorageService.getSubevent().name;

        this.form = this.fb.group({
            type: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            state: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            firstname: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            lastname: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            documentNumber: new FormControl('', { updateOn: 'change' }),
            phoneNumber: new FormControl('', { updateOn: 'change' }),
            email: new FormControl('', { validators: [Validators.email], updateOn: 'change' }),
            carLicencePlate: new FormControl('', { updateOn: 'change' }),
            companionReference: new FormControl('', { updateOn: 'change' }),
            observations1: new FormControl('', { updateOn: 'change' }),
            observations2: new FormControl('', { updateOn: 'change' }),
            observations3: new FormControl('', { updateOn: 'change' }),
            zone: new FormControl('', { updateOn: 'change' }),
            preferenceDate: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            preferenceHour: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            preferenceVehicle: new FormControl(null, { updateOn: 'change' })
        })

        if (this.isCreateMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('subevent.subevents') }, { label: this.translateService.instant('guest.guests') }, { label: this.translateService.instant('guest.guest-edition.guest-create'), active: true }];
        } else if (this.isEditMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('subevent.subevents') }, { label: this.translateService.instant('guest.guests') }, { label: this.translateService.instant('guest.guest-edition.guest-edit'), active: true }];
        } else if (this.isViewMode())
            this.breadCrumbItems = [{ label: this.translateService.instant('subevent.subevents') }, { label: this.translateService.instant('guest.guests') }, { label: this.translateService.instant('guest.guest-view'), active: true }];

        this.currentGuest = new Guest();
    }

    ngOnInit(): void {

        this.getVehiclesList();

        if (this.isEditMode()) {
            this.parseGuest();
        }

        if (this.isViewMode()) {
            this.parseGuest();
            this.disableControls();
        }
    }

    parseGuest(): void {
        const subscription = this.guestService.getGuestById(this.eventId, this.subeventId, this.activatedRoute.snapshot.queryParams['id']).subscribe(guest => {

            this.currentGuest = guest;
            this.controls.firstname.setValue(guest.firstname);
            this.controls.lastname.setValue(guest.lastname);
            this.controls.type.setValue(guest.type);
            this.controls.state.setValue(guest.state);
            this.controls.documentNumber.setValue(guest.documentNumber);
            this.controls.phoneNumber.setValue(guest.phoneNumber);
            this.controls.email.setValue(guest.email);
            this.controls.carLicencePlate.setValue(guest.carLicencePlate);
            this.controls.companionReference.setValue(guest.companionReference);
            this.controls.observations1.setValue(guest.observations1);
            this.controls.observations2.setValue(guest.observations2);
            this.controls.observations3.setValue(guest.observations3);
            this.controls.preferenceDate.setValue(guest.preferenceDate);
            this.controls.preferenceHour.setValue(guest.preferenceHour);
            this.controls.preferenceVehicle.setValue(guest.preferenceVehicle);
            this.controls.zone.setValue(guest.zone);
            this.isGettingData = false;

            console.log(guest, this.controls);

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
        this.navigationService.toGuestList();
    }

    get controls() {
        return this.form.controls;
    }

    enableControls(): void {
        this.controls.firstname.enable();
        this.controls.lastname.enable();
        this.controls.type.enable();
        this.controls.state.enable();
        this.controls.documentNumber.enable();
        this.controls.phoneNumber.enable();
        this.controls.email.enable();
        this.controls.carLicencePlate.enable();
        this.controls.companionReference.enable();
        this.controls.observations1.enable();
        this.controls.observations2.enable();
        this.controls.observations3.enable();
        this.controls.preferenceDate.enable();
        this.controls.preferenceHour.enable();
        this.controls.preferenceVehicle.enable();
        this.controls.zone.enable();
    }

    disableControls(): void {
        this.controls.firstname.disable();
        this.controls.lastname.disable();
        this.controls.type.disable();
        this.controls.state.disable();
        this.controls.documentNumber.disable();
        this.controls.phoneNumber.disable();
        this.controls.email.disable();
        this.controls.carLicencePlate.disable();
        this.controls.companionReference.disable();
        this.controls.observations1.disable();
        this.controls.observations2.disable();
        this.controls.observations3.disable();
        this.controls.preferenceDate.disable();
        this.controls.preferenceHour.disable();
        this.controls.preferenceVehicle.disable();
        this.controls.zone.disable();
    }

    formSubmit() {
        this.submit = true;

        if (!this.form.valid || this.isSaving) return;

        this.isSaving = true;
        this.disableControls();

        this.setFormValues();

        if (this.isCreateMode())
            this.createGuest();
        else if (this.isEditMode())
            this.editGuest();
    }

    createGuest(): void {
        const subscribe = this.guestService.createGuest(this.eventId, this.currentGuest).subscribe(guest => {
            this.isSaving = false;
            this.messageService.open('global.save-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toGuestList();
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



    editGuest(): void {
        const subscribe = this.guestService.editGuest(this.eventId, this.currentGuest).subscribe(guest => {
            this.isSaving = false;
            this.messageService.open('global.edit-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toGuestList();
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

    askForDeleteGuest() {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('guest.guest-edition.are-you-sure'),
            text: this.translateService.instant('guest.guest-edition.guest-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('guest.guest-edition.delete'),
            cancelButtonText: this.translateService.instant('guest.guest-edition.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteGuest(this.currentGuest.id);
            }
        })
    }

    private deleteGuest(guestId: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.guestService.deleteGuest(this.eventId, this.subeventId, guestId)
            .subscribe(() => {
                this.messageService.open('global.delete-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.navigationService.toGuestList();
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
        this.currentGuest.subeventId = this.subeventId;
        this.currentGuest.firstname = this.controls.firstname.value;
        this.currentGuest.lastname = this.controls.lastname.value;
        this.currentGuest.type = this.controls.type.value;
        this.currentGuest.state = this.controls.state.value;
        this.currentGuest.carLicencePlate = this.controls.carLicencePlate.value;
        this.currentGuest.documentNumber = this.controls.documentNumber.value;
        this.currentGuest.phoneNumber = this.controls.phoneNumber.value;
        this.currentGuest.companionReference = this.controls.companionReference.value;
        this.currentGuest.email = this.controls.email.value;
        this.currentGuest.observations1 = this.controls.observations1.value;
        this.currentGuest.observations2 = this.controls.observations2.value;
        this.currentGuest.observations3 = this.controls.observations3.value;
        this.currentGuest.preferenceDate = this.controls.preferenceDate.value;
        this.currentGuest.preferenceHour = this.controls.preferenceHour.value;
        this.currentGuest.preferenceVehicle = this.controls.preferenceVehicle.value;
        this.currentGuest.zone = this.controls.zone.value;
    }

    downloadQR() {
        if (this.isDownloadingQR) return;

        this.isDownloadingQR = true;
        this.guestService.downloadQr(this.currentGuest.id).subscribe(res => {
            try {
                // Manipula los datos de respuesta (archivo blob)
                const blob = new Blob([res], { type: 'application/octet-stream' });
                // Crea un enlace para descargar el archivo
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const lastname = capitalize(this.currentGuest.lastname);
                const firstname = capitalize(this.currentGuest.firstname);
                const currentDate = new Date();
                const hh = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours().toString();
                const mm = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes().toString();
                const ss = currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds().toString();
                a.download = `${lastname}${firstname}_${hh}${mm}${ss}.png`;
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                this.messageService.open('global.download-qr-code-error', MessageType.ERROR);
            }
            this.isDownloadingQR = false;
        }, error => {
            this.isDownloadingQR = false;
            this.messageService.open('global.download-qr-code-error', MessageType.ERROR);
        });
    }

    get qrUrl(): string {
        return this.guestService.getQrUrl(this.currentGuest.id);
    }

    getVehiclesList(): void {
        const subscription = this.vehicleService.getVehicles().subscribe(response => {
            this.vehicleList = response.listOfEntities;
        }, (error: IError) => {
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}