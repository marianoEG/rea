import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { forkJoin, Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import Swal from 'sweetalert2';
import { SharedService } from "src/app/shared/shared.service";
import { ExportObjectType, MessageType, UserProfileEnum } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { Dealership } from "src/app/core/models/dealership.model";
import { Province } from "src/app/core/models/province.model";
import { City } from "src/app/core/models/city.model";
import { DealershipService } from "src/app/core/services/dealership.service";
import { ProvinceService } from "src/app/core/services/province.service";
import { CityService } from "src/app/core/services/city.service";
import { ExcelExportService } from "src/app/core/services/excel-export.service";
import { identifierModuleUrl } from "@angular/compiler";

@Component({
    selector: 'dealership-list',
    templateUrl: './dealership-list.component.html',
    styleUrls: ['./dealership-list.component.scss']
})
export class DealershipListComponent implements OnInit, OnDestroy {

    MAX_VALUE = 100000;

    subscriptions: Subscription[];
    dealershipList: Dealership[];
    provinceList: Province[];
    cityList: City[];

    selectedProvince: Province;
    selectedCity: City;

    breadCrumbItems: Array<{}>;

    pageNumber: number;
    pageSize: number;
    total: number;

    isGettingList: boolean;
    isGettingPage: boolean;
    isDeleting: boolean;
    isDeletingAll: boolean;

    searchText: string;

    constructor(
        private translateService: TranslateService,
        private dealershipService: DealershipService,
        private provinceService: ProvinceService,
        private cityService: CityService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private excelExportService: ExcelExportService
    ) {
        this.subscriptions = [];
        this.dealershipList = [];
        this.provinceList = [];
        this.cityList = [];

        this.breadCrumbItems = [{ label: this.translateService.instant('dealership.dealerships') }, { label: this.translateService.instant('dealership.dealerships'), active: true }];

        this.isGettingList = false;
        this.isGettingPage = false;

        this.pageNumber = 1;
        this.pageSize = 20;

        this.searchText = '';

        const subscription = this.sharedService.$searchTextEmitted.subscribe(searchText => {
            if (!this.isDeleting && !this.isDeletingAll) {
                this.searchText = searchText;
                this.pageNumber = 1;
                this.pageSize = 20;
                this.isGettingList = true;
                this.getDealershipsList();
            }
        });
        this.subscriptions.push(subscription);
    }

    ngOnInit() {
        let subscription = forkJoin([
            this.provinceService.getProvinces()
        ]).subscribe(([provinceResponse]) => {

            this.provinceList = provinceResponse;

            this.isGettingList = true;
            this.pageSize = 20;
            this.getDealershipsList();

        });
        this.subscriptions.push(subscription);

    }

    getCities(): void {
        let subscription = this.cityService.getCities(this.selectedProvince.id).subscribe(response => {
            this.cityList = response;
        }, (error: IError) => {
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    getDealershipsList(): void {
        let selectedProvinceId = this.selectedProvince ? this.selectedProvince.id : null;
        let selectedCityId = this.selectedCity ? this.selectedCity.id : null;

        const subscription = this.dealershipService.getDealerships(this.searchText, this.pageNumber, this.pageSize, selectedProvinceId, selectedCityId).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            if (this.pageSize < this.MAX_VALUE) {
                this.dealershipList = response.listOfEntities;
                this.pageNumber = response.currentPage;
                this.pageSize = response.pageSize;
                this.total = response.totalItems;
            } else {
                let headersList = [
                    { key: 'id', value: 'Id' },
                    { key: 'name', value: this.translateService.instant('dealership.dealership-list.name') },
                    { key: 'code', value: this.translateService.instant('dealership.dealership-list.code') },
                    { key: 'province', value: this.translateService.instant('dealership.dealership-list.province') },
                    { key: 'city', value: this.translateService.instant('dealership.dealership-list.city') },
                    { key: 'latitude', value: this.translateService.instant('dealership.dealership-list.latitude') },
                    { key: 'longitude', value: this.translateService.instant('dealership.dealership-list.longitude') },
                    { key: 'street-name-and-number', value: this.translateService.instant('dealership.dealership-list.street-name-and-number') },
                    { key: 'postal-code', value: this.translateService.instant('dealership.dealership-list.postal-code') },
                    { key: 'phone-1', value: this.translateService.instant('dealership.dealership-list.phone-1') },
                    { key: 'phone-2', value: this.translateService.instant('dealership.dealership-list.phone-2') },
                    { key: 'dealer-code', value: this.translateService.instant('dealership.dealership-list.dealer-code') }
                ];
                this.excelExportService.export(response.listOfEntities, headersList, ExportObjectType.DEALERSHIP);
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
        this.isGettingList = true;
        this.cityList = [];
        this.selectedCity = null;
        if (this.selectedProvince) this.getCities();
        this.pageSize = 20;
        this.getDealershipsList();
    }

    onChangeCity(): void {
        this.isGettingList = true;
        this.pageSize = 20;
        this.getDealershipsList();
    }

    getProvinceName(provinceId: number): string {
        return this.provinceList.length ? this.provinceList.find(province => province.id == provinceId).name : '';
    }

    getCityName(cityId: number): string {
        return this.cityList.length > 0 ? this.cityList.find(city => city.id == cityId).name : '';
    }

    onPageChange(pageNumber) {
        if (this.isGettingList || this.isDeleting || this.isGettingPage || this.isDeletingAll) return;

        this.pageNumber = pageNumber;
        this.isGettingPage = true;
        this.pageSize = 20;
        this.getDealershipsList();
    }

    exportDealerships() {
        this.pageSize = this.MAX_VALUE;
        this.getDealershipsList();
    }

    createDealership(): void {
        if (this.isDeleting || this.isDeletingAll) return;
        this.navigationService.toDealershipCreation();
    }

    editDealership(id: string): void {
        if (this.isDeleting || this.isDeletingAll) return;
        this.navigationService.toDealershipEdition({
            queryParams: {
                'id': id
            }
        });
    }

    viewDealership(id: string): void {
        if (this.isDeleting || this.isDeletingAll) return;
        this.navigationService.toDealershipView({
            queryParams: {
                'id': id
            }
        });
    }

    importDealerships(): void {
        this.navigationService.toDealershipImport();
    }

    askForDeleteDealership(id: number) {
        if (this.isDeleting || this.isDeletingAll) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('dealership.dealership-list.are-you-sure'),
            text: this.translateService.instant('dealership.dealership-list.dealership-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('dealership.dealership-list.delete'),
            cancelButtonText: this.translateService.instant('dealership.dealership-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteDealership(id);
            }
        })
    }

    private deleteDealership(id: number): void {
        if (this.isDeleting || this.isDeletingAll) return;

        this.isDeleting = true;
        const subscription = this.dealershipService.deleteDealership(id)
            .subscribe(() => {
                this.messageService.open('dealership.dealership-list.deleted-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.pageSize = 20;
                this.getDealershipsList();
            }, (error: IError) => {
                this.isDeleting = false;
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });

        this.subscriptions.push(subscription);
    }

    askForDeleteDealerships(): void {
        if (this.isDeleting || this.isDeletingAll) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('dealership.dealership-list.are-you-sure'),
            text: this.translateService.instant('dealership.dealership-list.dealerships-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('dealership.dealership-list.delete-all'),
            cancelButtonText: this.translateService.instant('dealership.dealership-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteDealerships();
            }
        })
    }

    private deleteDealerships(): void {
        if (this.isDeleting || this.isDeletingAll) return;

        this.isDeletingAll = true;
        const subscription = this.dealershipService.deleteDealerships(this.dealershipList.filter(x => !!x.id).map(x => x.id))
            .subscribe(() => {
                this.messageService.open('dealership.dealership-list.deleted-all-success', MessageType.SUCCESS);
                this.isDeletingAll = false;
                this.pageSize = 20;
                this.getDealershipsList();
            }, (error: IError) => {
                this.isDeletingAll = false;
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });

        this.subscriptions.push(subscription);
    }

    isAdmin() {
        return UserProfileEnum.ADMIN;
    }


    isReadOnly() {
        return UserProfileEnum.READONLY;
    }


    ngOnDestroy() {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
