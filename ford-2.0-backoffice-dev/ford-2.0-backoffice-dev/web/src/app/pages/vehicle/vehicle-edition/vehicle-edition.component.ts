import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbCarousel, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { FeatureGroup } from "src/app/core/models/feature-group.model";
import { Feature } from "src/app/core/models/Feature.model";
import { VehicleColor } from "src/app/core/models/vehicle-color.model";
import { VehicleImage } from "src/app/core/models/vehicle-image.model";
import { Vehicle } from "src/app/core/models/vehicle.model";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { VehicleService } from "src/app/core/services/vehicle.service";
import { MessageType, ScreenViewType } from "src/app/utils/constants";
import Swal from "sweetalert2";

@Component({
    selector: 'vehicle-edition',
    templateUrl: './vehicle-edition.component.html',
    styleUrls: ['./vehicle-edition.component.scss']
})
export class VehicleEditionComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    form: FormGroup;
    currentVehicle: Vehicle;
    screenViewType: ScreenViewType;
    vehicleTypes: string[];
    selectedType: string;
    currentFeatureGroupName: string;
    currentFeatureName: string;
    showNavigationIndicators: any;

    breadCrumbItems: Array<{}>;

    isGettingData: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    submit: boolean;
    creatingFeatureGroup: boolean;
    creatingFeature: boolean;
    finish: boolean;

    featureGroupsList: FeatureGroup[];
    currentFeatureGroup: FeatureGroup;

    currentFeature: Feature;

    imagesList: VehicleImage[];
    currentVehicleImages: VehicleImage[];
    colorsList: VehicleColor[];
    currentColor: VehicleColor;
    colorName: string;
    vehicleImageIndex: number;
    colorImageIndex: number;

    @ViewChild('vehicleImageCarousel', { static: true }) imageCarousel: NgbCarousel;
    @ViewChild('colorImageCarousel', { static: true }) colorCarousel: NgbCarousel;

    constructor(
        private navigationService: NavigationService,
        private vehicleService: VehicleService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private messageService: MessageService,
        private localStorageService: LocalStorageService,
        private modalService: NgbModal
    ) {
        this.subscriptions = [];
        this.featureGroupsList = [];
        this.imagesList = [];
        this.colorsList = [];

        this.imageCarousel

        try {
            this.screenViewType = this.activatedRoute.snapshot.data['screenViewType'] as ScreenViewType;
        } catch (err) {
            this.screenViewType = ScreenViewType.CREATE;
        }

        this.isSaving = false;
        this.isDeleting = false;
        this.isGettingData = false;
        this.submit = false;
        this.creatingFeatureGroup = false;
        this.creatingFeature = false;
        this.finish = false;

        this.form = this.fb.group({
            name: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            type: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            enabled: new FormControl(true, { updateOn: 'change' })
        })

        if (this.isCreateMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('vehicle.vehicle-edition.vehicle-create'), active: true }];
        } else if (this.isEditMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('vehicle.vehicle-edition.vehicle-edit'), active: true }];
        } else if (this.isViewMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('vehicle.vehicle-view'), active: true }];
        }

        this.currentVehicle = new Vehicle();
        this.selectedType = '';
        this.currentFeatureGroupName = '';
        this.currentFeatureName = '';
        this.colorName = '';
        this.vehicleImageIndex = 0;
        this.colorImageIndex = 0;
    }

    //#region startupMethods

    ngOnInit(): void {
        this.getVehicleTypes();
        if (this.isEditMode()) {
            this.parseExistingVehicle();
        }

        if (this.isViewMode()) {
            this.parseExistingVehicle();
            this.disableControls();
        }
    }

    getVehicleTypes(): void {
        const subscription = this.vehicleService.getVehicleTypes().subscribe(vehicleTypes => {
            this.vehicleTypes = vehicleTypes;
        }, (error: IError) => {
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

    parseExistingVehicle() {
        this.isGettingData = true
        const subscription = this.vehicleService.getVehicleById(this.activatedRoute.snapshot.queryParams['id']).subscribe(vehicle => {
            this.currentVehicle = vehicle;
            this.controls.name.setValue(vehicle.name);
            this.controls.type.setValue(vehicle.type);
            this.controls.enabled.setValue(vehicle.enabled);
            this.selectedType = vehicle.type;

            this.featureGroupsList = vehicle.featuresGroups
                ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                ?.map(group => ({
                    ...group,
                    features: group
                        ?.features
                        ?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        ?? []
                })) ?? [];

            this.imagesList = vehicle.images;
            this.colorsList = vehicle.colors;
            this.isGettingData = false;
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
        this.navigationService.toVehiclesList();
    }
    //#endregion


    //#region featureGroupMethods
    addFeatureGroup(featureGroupModal: any): void {
        this.currentFeatureGroup = new FeatureGroup();
        this.currentFeatureGroup.features = [];
        this.creatingFeatureGroup = true;
        this.modalService.open(featureGroupModal);
    }

    editFeatureGroup(featureGroupModal: any, featureGroup: FeatureGroup) {
        this.currentFeatureGroup = featureGroup;
        this.currentFeatureGroupName = this.currentFeatureGroup.name;
        this.creatingFeatureGroup = false;
        this.modalService.open(featureGroupModal);
    }

    saveFeatureGroup() {
        this.currentFeatureGroup.name = this.currentFeatureGroupName;
        this.currentFeatureGroupName = '';
        if (this.creatingFeatureGroup) {
            this.featureGroupsList.push(this.currentFeatureGroup);
            this.creatingFeatureGroup = false;
        }
    }

    deleteFeatureGroup(featureGroup: FeatureGroup): void {
        this.featureGroupsList = this.featureGroupsList.filter(group => group != featureGroup);
    }
    //#endregion

    //#region featureMethods
    addFeature(featurModal: any, featureGroup: FeatureGroup): void {
        this.currentFeatureGroup = featureGroup;
        this.currentFeature = new Feature();
        this.creatingFeature = true;
        this.modalService.open(featurModal);
    }

    editFeature(featureModal: any, featureGroup: FeatureGroup, feature: Feature) {
        this.currentFeatureGroup = featureGroup;
        this.currentFeature = feature;
        this.currentFeatureName = this.currentFeature.name;
        this.creatingFeature = false;
        this.modalService.open(featureModal);
    }

    saveFeature() {
        this.currentFeature.name = this.currentFeatureName;
        this.currentFeatureName = '';
        if (this.creatingFeature) {
            this.currentFeatureGroup.features.push(this.currentFeature);
            this.creatingFeatureGroup = false;
        }
    }

    deleteFeature(featureGroup: FeatureGroup, feature: Feature): void {
        featureGroup.features = featureGroup.features.filter(thisFeature => thisFeature != feature);
    }
    //#endregion

    //#region formControls

    get controls() {
        return this.form.controls;
    }
    enableControls(): void {
        this.controls.name.enable();
        this.controls.type.enable();
        this.controls.enabled.enable();
    }

    disableControls(): void {
        this.controls.name.disable();
        this.controls.type.disable();
        this.controls.enabled.disable();
    }

    setFormValues(): void {
        this.currentVehicle.name = this.controls.name.value;
        this.currentVehicle.type = this.controls.type.value;
        this.currentVehicle.enabled = this.controls.enabled.value;
        this.currentVehicle.featuresGroups = this.featureGroupsList;
        this.currentVehicle.images = this.imagesList;
        this.currentVehicle.colors = this.colorsList;
    }

    formSubmit() {
        this.submit = true;
        if (!this.form.valid || this.isSaving) return;

        this.isSaving = true;
        this.disableControls();

        this.setFormValues();

        if (this.isCreateMode())
            this.createVehicle();
        else if (this.isEditMode())
            this.editVehicle();
    }
    //#endregion

    //#region persistence methods

    createVehicle(): void {
        this.orderFeaturesBeforeSave();
        const subscribe = this.vehicleService.createVehicle(this.currentVehicle).subscribe(vehicle => {
            this.isSaving = false;
            this.messageService.open('global.save-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toVehiclesList();
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



    editVehicle(): void {
        this.orderFeaturesBeforeSave();
        const subscribe = this.vehicleService.editVehicle(this.currentVehicle).subscribe(vehicle => {
            this.isSaving = false;
            this.messageService.open('global.edit-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toVehiclesList();
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

    private orderFeaturesBeforeSave(): void {
        this.currentVehicle?.featuresGroups?.forEach((group, index1) => {
            group.order = index1 + 1;
            group.features?.forEach((feature, index2) => {
                feature.order = index2 + 1;
            })
        });
    }

    askForDeleteVehicle() {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('vehicle.vehicle-list.are-you-sure'),
            text: this.translateService.instant('vehicle.vehicle-list.vehicle-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('vehicle.vehicle-list.delete'),
            cancelButtonText: this.translateService.instant('vehicle.vehicle-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteVehicle(this.currentVehicle.id);
            }
        })
    }

    private deleteVehicle(id: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.vehicleService.deleteVehicle(id)
            .subscribe(() => {
                this.messageService.open('global.delete-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.navigationService.toVehiclesList();
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
    //#endregion

    //#region generalimage
    public generalImageDropzone: DropzoneConfigInterface = {
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

    removeGeneralImage(): void {
        this.currentVehicle.image = null;
    }

    getGeneralImageDropzoneResponse(response): void {
        this.currentVehicle.image = response[1];
    }
    //#endregion

    //#region vehicleImages
    public vehicleImagesDropzone: DropzoneConfigInterface = {
        clickable: true,
        autoReset: null,
        errorReset: null,
        addRemoveLinks: true,
        cancelReset: null,
        acceptedFiles: '.png, .jpg',
        headers: {
            Authorization: 'Bearer ' + this.localStorageService.getSessionToken()
        }
    };

    addImages(imagesModal): void {
        this.currentVehicleImages = [];
        this.modalService.open(imagesModal);
    }


    getCurrentIndex(event): void {
        if (event.direction == 'left') {
            this.vehicleImageIndex++
            if (this.vehicleImageIndex >= this.imagesList.length) this.vehicleImageIndex = 0;
        } else if (event.direction == 'right') {
            this.vehicleImageIndex--
            if (this.vehicleImageIndex < 0) this.vehicleImageIndex = this.imagesList.length - 1
        }
    }

    removeVehicleImage(): void {
        this.imagesList.splice(this.vehicleImageIndex, 1);
        if (this.imageCarousel) this.imageCarousel.next();
    }

    getVehicleImagesDropzoneResponse(response): void {
        let currentVehicleImage = new VehicleImage();
        currentVehicleImage.vehicleImageUrl = response[1];
        this.currentVehicleImages.push(currentVehicleImage);
    }

    finishVehicleImage(): void {
        this.imagesList.push(...this.currentVehicleImages);
    }
    //#endregion

    //#region colorImages
    public colorsDropzone: DropzoneConfigInterface = {
        clickable: true,
        maxFiles: 1,
        autoReset: null,
        errorReset: null,
        addRemoveLinks: true,
        cancelReset: null,
        acceptedFiles: '.png, .jpg',
        headers: {
            Authorization: 'Bearer ' + this.localStorageService.getSessionToken()
        }
    };

    addColorImages(colorsModal): void {
        this.currentColor = new VehicleColor();
        this.colorName = '';
        this.finish = false;
        this.modalService.open(colorsModal);
    }

    getColorsDropzoneResponse(response): void {
        this.currentColor.colorImageUrl = response[1];
    }


    public colorVehiclesDropzone: DropzoneConfigInterface = {
        clickable: true,
        maxFiles: 1,
        autoReset: null,
        errorReset: null,
        addRemoveLinks: true,
        cancelReset: null,
        acceptedFiles: '.png, .jpg',
        headers: {
            Authorization: 'Bearer ' + this.localStorageService.getSessionToken()
        }
    };

    getColorVehiclesDropzoneResponse(response): void {
        this.currentColor.vehicleImageUrl = response[1];
    }

    getCurrentColorIndex(event): void {
        if (event.direction == 'left') {
            this.colorImageIndex++
            if (this.colorImageIndex >= this.colorsList.length) this.colorImageIndex = 0;
        } else if (event.direction == 'right') {
            this.vehicleImageIndex--
            if (this.colorImageIndex < 0) this.colorImageIndex = this.colorsList.length - 1
        }
    }

    removeColorImage(): void {
        this.colorsList.splice(this.vehicleImageIndex, 1);
        if (this.colorCarousel) this.colorCarousel.next();
    }

    colorImageFinish(colorsModal: any): void {
        this.finish = true;
        if (!this.colorName) return

        this.currentColor.colorName = this.colorName;
        this.colorsList.push(this.currentColor);
        colorsModal.close('Close click');
    }

    //#endregion

    onFeatureGroupDropped(event: CdkDragDrop<string[]>) {
        this.featureGroupsList = this.swapElements(this.featureGroupsList, event.previousIndex, event.currentIndex);
    }

    onFeatureDropped(group: FeatureGroup, event: CdkDragDrop<string[]>) {
        group.features = this.swapElements(group.features, event.previousIndex, event.currentIndex);
    }

    private swapElements<T>(array: T[], index1: number, index2: number): T[] {
        if (!array || array.length == 0)
            return [];

        if (index1 < 0 || index1 >= array.length || index2 < 0 || index2 >= array.length)
            return array;

        const newArray = [...array];
        const elemento1 = newArray[index1];
        const elemento2 = newArray[index2];
        newArray[index1] = elemento2;
        newArray[index2] = elemento1;

        return newArray;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}