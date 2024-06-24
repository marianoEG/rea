import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ThirdPartyDraggable } from "@fullcalendar/interaction";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, fromEvent, Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { FeatureGroup } from "src/app/core/models/feature-group.model";
import { FeatureVersion } from "src/app/core/models/feature-version.model";
import { Version } from "src/app/core/models/version.model";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { VehicleService } from "src/app/core/services/vehicle.service";
import { VersionService } from "src/app/core/services/version.service";
import { Currency, MessageType, ScreenViewType } from "src/app/utils/constants";
import Swal from "sweetalert2";

@Component({
    selector: 'version-edition',
    templateUrl: './version-edition.component.html',
    styleUrls: ['./version-edition.component.scss']
})
export class VersionEditionComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    form: FormGroup;
    currentVersion: Version;
    screenViewType: ScreenViewType;

    featureGroupsList: FeatureGroup[];
    featureValue

    currencyArray: string[];
    selectedCurrency: string;

    breadCrumbItems: Array<{}>;

    isGettingData: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    submit: boolean;

    vehicleId: number;
    vehicleName: string;

    constructor(
        private navigationService: NavigationService,
        private versionService: VersionService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private messageService: MessageService,
        private localStorageService: LocalStorageService,
        public vehicleService: VehicleService
    ) {
        this.subscriptions = [];
        this.featureGroupsList = [];

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

        this.currencyArray = [];
        this.currencyArray.push(Currency.ARS);
        this.currencyArray.push(Currency.USD);
        this.selectedCurrency = this.currencyArray[0];

        this.form = this.fb.group({
            name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            price: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            currency: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            TMA: new FormControl('', { updateOn: 'change' }),
            SEQ: new FormControl('', { updateOn: 'change' }),
            modelYear: new FormControl('', { updateOn: 'change' }),
            preLaunch: new FormControl(false, { updateOn: 'change' }),
            enabled: new FormControl(true, { updateOn: 'change' }),
        });

        this.controls.currency.setValue(Currency.ARS);

        if (this.isCreateMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('version.versions') }, { label: this.translateService.instant('version.version-edition.version-create'), active: true }];
        } else if (this.isEditMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('version.versions') }, { label: this.translateService.instant('version.version-edition.version-edit'), active: true }];
        } else if (this.isViewMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('version.versions') }, { label: this.translateService.instant('version.version-view'), active: true }];
        }

        this.currentVersion = new Version();
    }

    ngOnInit(): void {
        if (this.isEditMode()) {
            this.parseExistingVersion();
        }

        if (this.isViewMode()) {
            this.parseExistingVersion();
            this.disableControls();
        }
    }

    parseExistingVersion() {
        this.isGettingData = true
        const subscription = forkJoin([
            this.versionService.getVersionById(this.activatedRoute.snapshot.queryParams['id']),
            this.vehicleService.getVehicleFeatureGroups(this.vehicleId, null, null, null)
        ]).subscribe(([version, response]) => {
            this.currentVersion = version;
            this.controls.name.setValue(version.name);
            this.controls.price.setValue(version.price);
            this.controls.currency.setValue(version.currency);
            this.controls.TMA.setValue(version.tma);
            this.controls.SEQ.setValue(version.seq);
            this.controls.modelYear.setValue(version.modelYear);
            this.controls.preLaunch.setValue(version.preLaunch);
            this.controls.enabled.setValue(version.enabled);
            this.isGettingData = false;

            this.featureGroupsList = response.listOfEntities;

            this.featureGroupsList = response.listOfEntities
                ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                ?.map(group => ({
                    ...group,
                    features: group
                        ?.features
                        ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        ?? []
                })) ?? [];

            if (!this.currentVersion.featureVersions) this.currentVersion.featureVersions = [];

            this.featureGroupsList.forEach(group => {
                if (group.features) {

                    group.features.forEach(feature => {
                        let foundFeatureVersion = this.currentVersion.featureVersions.find(fv => { return fv.featureId == feature.id });
                        if (!foundFeatureVersion) {
                            let featureVersion: FeatureVersion = new FeatureVersion()
                            featureVersion.featureId = feature.id;
                            featureVersion.value = '';
                            feature.valueToWork = '';
                            this.currentVersion.featureVersions.push(featureVersion);
                        } else {
                            feature.valueToWork = foundFeatureVersion.value;
                        }
                    })
                }
            });

        }, (error: IError) => {
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

    setFeatureVersionValues(): void {
        this.featureGroupsList.forEach(group => {
            group.features.forEach(feature => {
                let foundFeatureVersion = this.currentVersion.featureVersions.find(fv => { return fv.featureId == feature.id });
                foundFeatureVersion.value = feature.valueToWork;
            });
        });
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
        this.navigationService.toVersionsList();
    }

    get controls() {
        return this.form.controls;
    }

    enableControls(): void {
        this.controls.name.enable();
        this.controls.price.enable();
        this.controls.currency.enable();
        this.controls.TMA.enable();
        this.controls.SEQ.enable();
        this.controls.modelYear.enable();
        this.controls.preLaunch.enable();
        this.controls.enabled.enable();
    }

    disableControls(): void {
        this.controls.name.disable();
        this.controls.price.disable();
        this.controls.currency.disable();
        this.controls.TMA.disable();
        this.controls.SEQ.disable();
        this.controls.modelYear.disable();
        this.controls.preLaunch.disable();
        this.controls.enabled.disable();
    }

    formSubmit() {
        this.submit = true;
        if (!this.form.valid || this.isSaving) return;

        this.isSaving = true;
        this.disableControls();

        this.setFormValues();

        if (this.isCreateMode())
            this.createVersion();
        else if (this.isEditMode())
            this.editVersion();
    }

    createVersion(): void {
        const subscribe = this.versionService.createVersion(this.currentVersion).subscribe(version => {
            this.isSaving = false;
            this.messageService.open('global.save-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toVersionsList();
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



    editVersion(): void {
        const subscribe = this.versionService.editVersion(this.currentVersion).subscribe(version => {
            this.isSaving = false;
            this.messageService.open('global.edit-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toVersionsList();
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

    askForDeleteVersion() {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('version.version-list.are-you-sure'),
            text: this.translateService.instant('version.version-list.version-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('version.version-list.delete'),
            cancelButtonText: this.translateService.instant('version.version-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteVersion(this.currentVersion.id);
            }
        })
    }

    private deleteVersion(id: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.versionService.deleteVersion(id)
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
        this.currentVersion.name = this.controls.name.value;
        this.currentVersion.price = this.controls.price.value;
        this.currentVersion.vehicleId = this.vehicleId;
        this.currentVersion.currency = this.controls.currency.value;
        this.currentVersion.tma = this.controls.TMA.value;
        this.currentVersion.seq = this.controls.SEQ.value;
        this.currentVersion.modelYear = this.controls.modelYear.value?.toString();
        this.currentVersion.preLaunch = this.controls.preLaunch.value;
        this.currentVersion.enabled = this.controls.enabled.value;
        this.setFeatureVersionValues();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}