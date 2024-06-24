import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { Form, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DropzoneConfigInterface } from "ngx-dropzone-wrapper";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { City } from "src/app/core/models/city.model";
import { Dealership } from "src/app/core/models/dealership.model";
import { Province } from "src/app/core/models/province.model";
import { CityService } from "src/app/core/services/city.service";
import { DealershipService } from "src/app/core/services/dealership.service";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { ProvinceService } from "src/app/core/services/province.service";
import { MessageType, ScreenViewType } from "src/app/utils/constants";
import Swal from "sweetalert2";

@Component({
    selector: 'dealership-edition',
    templateUrl: './dealership-edition.component.html',
    styleUrls: ['./dealership-edition.component.scss']
})
export class DealershipEditionComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    provinceList: Province[];
    cityList: City[];

    form: FormGroup;
    currentDealership: Dealership;
    screenViewType: ScreenViewType;
    selectedProvince: Province;
    selectedCity: City;

    breadCrumbItems: Array<{}>;

    isGettingData: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    submit: boolean;

    constructor(
        private navigationService: NavigationService,
        private dealershipService: DealershipService,
        private provinceService: ProvinceService,
        private cityService: CityService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private messageService: MessageService,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = [];
        this.provinceList = [];
        this.cityList = [];

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
            code: new FormControl('', { validators: [Validators.required], updateOn: 'change' }),
            province: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            city: new FormControl(null, { validators: [Validators.required], updateOn: 'change' }),
            lat: new FormControl(0, { updateOn: 'change' }),
            long: new FormControl(0, { updateOn: 'change' }),
            streetNameAndNumber: new FormControl('', {  updateOn: 'change' }),
            postalCode: new FormControl('', {  updateOn: 'change' }),
            phone1: new FormControl('', {  updateOn: 'change' }),
            phone2: new FormControl('', {  updateOn: 'change' }),
            dealerCode: new FormControl('', {  updateOn: 'change' })
        })

        this.controls.city.disable();

        if (this.isCreateMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('dealership.dealerships') }, { label: this.translateService.instant('dealership.dealership-edition.dealership-create'), active: true }];
        } else if (this.isEditMode()) {
            this.breadCrumbItems = [{ label: this.translateService.instant('dealership.dealerships') }, { label: this.translateService.instant('dealership.dealership-edition.dealership-edit'), active: true }];
        } else if (this.isViewMode()) 
            this.breadCrumbItems = [{ label: this.translateService.instant('dealership.dealerships') }, { label: this.translateService.instant('dealership.dealership-view'), active: true }];


        this.currentDealership = new Dealership();
    }

    ngOnInit(): void {
        this.getProvinces();
    }

    getProvinces(): void {
        const subscription = this.provinceService.getProvinces().subscribe(response => {
            this.provinceList = response;
            if (this.isEditMode()) {
                this.parseExistingEvent();
            }
            if (this.isViewMode()) {
                this.parseExistingEvent();
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

    getCities(provinceId: number, isGettingFromEdit:boolean):void {
        const subscription = this.cityService.getCities(provinceId).subscribe(response => {
            this.cityList = response;

            if (this.cityList.length > 0 && !this.isViewMode()) this.controls.city.enable(); 

            if (isGettingFromEdit) {
                let city = this.cityList.find(city => city.id == this.currentDealership.cityId);
                this.controls.city.setValue(city);
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

    onChangeProvince(): void {
        this.cityList = [];
        this.controls.city.setValue(null);
        this.controls.city.disable();
        this.getCities(this.controls.province.value.id, false);
    }

    parseExistingEvent(): void {
        this.isGettingData = true
        const subscription = this.dealershipService.getDealershipById(this.activatedRoute.snapshot.queryParams['id']).subscribe(dealership => {
            this.currentDealership = dealership;
            this.controls.name.setValue(dealership.name);
            this.controls.code.setValue(dealership.code);
            this.controls.lat.setValue(dealership.lat);
            this.controls.long.setValue(dealership.long);
            this.controls.streetNameAndNumber.setValue(dealership.streetNameAndNumber);
            this.controls.postalCode.setValue(dealership.postalCode);
            this.controls.phone1.setValue(dealership.phone1);
            this.controls.phone2.setValue(dealership.phone2);
            this.controls.dealerCode.setValue(dealership.dealerCode);

            let province = this.provinceList.find(province => province.id == dealership.provinceId);
            this.controls.province.setValue(province);

            this.getCities(province.id, true);
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
        this.navigationService.toDealershipList();
    }

    get controls() {
        return this.form.controls;
    }

    enableControls(): void {
        this.controls.name.enable();
        this.controls.code.enable();
        this.controls.streetNameAndNumber.enable();
        this.controls.province.enable();
        this.controls.city.enable();
        this.controls.lat.enable();
        this.controls.long.enable();
        this.controls.postalCode.enable();
        this.controls.phone1.enable();
        this.controls.phone2.enable();
        this.controls.dealerCode.enable();
    }

    disableControls(): void {
        this.controls.name.disable();
        this.controls.code.disable();
        this.controls.streetNameAndNumber.disable();
        this.controls.province.disable();
        this.controls.city.disable();
        this.controls.lat.disable();
        this.controls.long.disable();
        this.controls.postalCode.disable();
        this.controls.phone1.disable();
        this.controls.phone2.disable();
        this.controls.dealerCode.disable();
    }

    formSubmit() {
        this.submit = true;
        if (!this.form.valid || this.isSaving) return;

        this.isSaving = true;
        this.disableControls();

        this.setFormValues();

        if (this.isCreateMode())
            this.createDealership();
        else if (this.isEditMode())
            this.editDealership();
    }

    createDealership(): void {
        const subscribe = this.dealershipService.createDealership(this.currentDealership).subscribe(dealership => {
            this.isSaving = false;
            this.messageService.open('global.save-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toDealershipList();
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

    editDealership(): void {
        const subscribe = this.dealershipService.editDealership(this.currentDealership).subscribe(dealership => {
            this.isSaving = false;
            this.messageService.open('global.edit-success', MessageType.SUCCESS);
            this.enableControls();
            this.navigationService.toDealershipList();
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

    askForDeleteDealership() {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('dealership.dealership-edition.are-you-sure'),
            text: this.translateService.instant('dealership.dealership-edition.dealership-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('dealership.dealership-edition.delete'),
            cancelButtonText: this.translateService.instant('dealership.dealership-edition.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteDealership(this.currentDealership.id);
            }
        })
    }

    private deleteDealership(id: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.dealershipService.deleteDealership(id)
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
        this.currentDealership.name = this.controls.name.value;
        this.currentDealership.code = this.controls.code.value;
        this.currentDealership.provinceId = this.controls.province.value.id;
        this.currentDealership.cityId = this.controls.city.value.id;
        this.currentDealership.streetNameAndNumber = this.controls.streetNameAndNumber.value;
        this.currentDealership.lat = this.controls.lat.value;
        this.currentDealership.long = this.controls.long.value;
        this.currentDealership.postalCode = this.controls.postalCode.value;
        this.currentDealership.phone1 = this.controls.phone1.value;
        this.currentDealership.phone2 = this.controls.phone2.value;
        this.currentDealership.dealerCode = this.controls.dealerCode.value;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}