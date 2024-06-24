import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { VehicleAccessory } from "src/app/core/models/vehicle-accessory.model";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { VehicleAccessoryService } from "src/app/core/services/vehicle-accessory.service";
import { VehicleService } from "src/app/core/services/vehicle.service";
import { MessageType, ScreenViewType } from "src/app/utils/constants";
import Swal from "sweetalert2";

@Component({
    selector: 'accessory-edition',
    templateUrl: './accessory-edition.component.html',
    styleUrls: ['./accessory-edition.component.scss']
})
export class VehicleAccessoryEditionComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    form: FormGroup;
    currentAccessory: VehicleAccessory;
    screenViewType: ScreenViewType;

    breadCrumbItems: Array<{}>;

    isGettingData: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    submit: boolean;

    vehicleId: number;
    vehicleName: string;

    constructor(
        private navigationService: NavigationService,
        private vehicleAccessoryService: VehicleAccessoryService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private messageService: MessageService,
        private localStorageService: LocalStorageService,
        public vehicleService: VehicleService
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

        this.vehicleId = this.localStorageService.getVehicle().id;
        this.vehicleName = this.localStorageService.getVehicle().name;

        this.form = this.fb.group({
            name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            description: new FormControl('', { updateOn: 'change' }),
            observation: new FormControl('', { updateOn: 'change' }),
            partNumber: new FormControl(null, { updateOn: 'change' }),
            modelFor: new FormControl('', { updateOn: 'change' }),
        })

        if (this.isCreateMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('vehicle-accessory.vehicle-accessories') },{ label: this.translateService.instant('vehicle-accessory.vehicle-accessories') }, { label: this.translateService.instant('vehicle-accessory.vehicle-accessory-edition.vehicle-accessory-create'), active: true }];
        } else if (this.isEditMode()){
            this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('vehicle-accessory.vehicle-accessories') }, { label: this.translateService.instant('vehicle-accessory.vehicle-accessory-edition.vehicle-accessory-edit'), active: true }];
        }if (this.isViewMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('vehicle-accessory.vehicle-accessories') }, { label: this.translateService.instant('vehicle-accessory.vehicle-accessory-view'), active: true }];
        }

        this.currentAccessory = new VehicleAccessory();
    }

    ngOnInit(): void {
        if (this.isEditMode()) {
           this.parseExistingAccessory();
        }

        if (this.isViewMode()) {
            this.parseExistingAccessory();
            this.disableControls();
        }
    }

    parseExistingAccessory() {
        this.isGettingData = true
        const subscription = this.vehicleAccessoryService.getVehicleAccessoryById(this.vehicleId, this.activatedRoute.snapshot.queryParams['id']).subscribe(accessory => {
            this.currentAccessory = accessory;
            this.controls.name.setValue(accessory.name);
            this.controls.observation.setValue(accessory.observation);
            this.controls.description.setValue(accessory.description);
            this.controls.partNumber.setValue(accessory.partNumber);
            this.controls.modelFor.setValue(accessory.modelFor);
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
        this.navigationService.toVehicleAccessoryList();
    }

    get controls() {
        return this.form.controls;
    }

    enableControls(): void {
        this.controls.name.enable();
        this.controls.observation.enable();
        this.controls.description.enable();
        this.controls.partNumber.enable();
        this.controls.modelFor.enable();
    }

    disableControls(): void {
        this.controls.name.disable();
        this.controls.observation.disable();
        this.controls.description.disable();
        this.controls.partNumber.disable();
        this.controls.modelFor.disable();
    }

    formSubmit() {
        this.submit = true;
        if (!this.form.valid || this.isSaving) return;

        this.isSaving = true;
        this.disableControls();

        this.setFormValues();

        if (this.isCreateMode())
            this.createVehicleAccessory();
        else if (this.isEditMode())
            this.editVehicleAccessory();
    }

    createVehicleAccessory(): void {
        const subscribe = this.vehicleAccessoryService.createVehicleAccessory(this.currentAccessory).subscribe(accessory => {
            this.isSaving = false;
            this.messageService.open('global.save-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toVehicleAccessoryList();
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



    editVehicleAccessory(): void {
        const subscribe = this.vehicleAccessoryService.editVehicleAccessory(this.currentAccessory).subscribe(accessory => {
            this.isSaving = false;
            this.messageService.open('global.edit-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toVehicleAccessoryList();
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

    askForDeleteVehicleAccessory() {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('vehicle-accessory.vehicle-accessory-list.are-you-sure'),
            text: this.translateService.instant('vehicle-accessory.vehicle-accessory-list.vehicle-accessory-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('vehicle-accessory.vehicle-accessory-list.delete'),
            cancelButtonText: this.translateService.instant('vehicle-accessory.vehicle-accessory-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteVehicleAccessory(this.currentAccessory.id);
            }
        })
    }

    private deleteVehicleAccessory(accessoryId: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.vehicleAccessoryService.deleteVehicleAccessory(this.vehicleId, accessoryId)
            .subscribe(() => {
                this.messageService.open('global.delete-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.navigationService.toVersionsList();
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
        this.currentAccessory.vehicleId = this.vehicleId;
        this.currentAccessory.name = this.controls.name.value;
        this.currentAccessory.observation = this.controls.observation.value;
        this.currentAccessory.description = this.controls.description.value;
        this.currentAccessory.modelFor = this.controls.modelFor.value;
        this.currentAccessory.partNumber = this.controls.partNumber.value;
    }

    public accessoryDropzone: DropzoneConfigInterface = {
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
        this.currentAccessory.image = null;
    }

    getDropzoneResponse(response): void {
        this.currentAccessory.image = response[1];
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}