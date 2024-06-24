import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import Swal from 'sweetalert2';
import { SharedService } from "src/app/shared/shared.service";
import { Currency, MessageType, UserProfileEnum } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { Version } from "src/app/core/models/version.model";
import { VersionService } from "src/app/core/services/version.service";
import { LocalStorageService } from "src/app/core/services/local-storage.service";

@Component({
    selector: 'version-list',
    templateUrl: './version-list.component.html',
    styleUrls: ['./version-list.component.scss']
})
export class VersionListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    versionsList: Version[];
    breadCrumbItems: Array<{}>;

    pageNumber: number;
    pageSize: number;
    total: number;

    isGettingList: boolean;
    isGettingPage: boolean;
    isDeleting: boolean;
    isSettingPreLaunchValue: boolean;

    searchText: string;

    vehicleId: number;
    vehicleName: string;

    currencyArray: string[];

    constructor(
        private translateService: TranslateService,
        private versionService: VersionService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = [];
        this.versionsList = [];
        this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('version.versions') }, { label: this.translateService.instant('version.versions'), active: true }];

        this.currencyArray = [Currency.ARS, Currency.USD];

        this.isGettingList = false;
        this.isGettingPage = false;
        this.isSettingPreLaunchValue = false;

        this.pageNumber = 1;
        this.pageSize = 20;

        this.searchText = '';

        this.vehicleId = this.localStorageService.getVehicle().id;
        this.vehicleName = this.localStorageService.getVehicle().name;

        const subscription = this.sharedService.$searchTextEmitted.subscribe(searchText => {
            if (!this.isDeleting) {
                this.searchText = searchText;
                this.pageNumber = 1;
                this.pageSize = 20;
                this.isGettingList = true;
                this.getVersionsList();
            }
        });
        this.subscriptions.push(subscription);
    }

    ngOnInit() {
        this.isGettingList = true;
        this.getVersionsList();
    }

    getVersionsList(): void {
        const subscription = this.versionService.getVersions(this.vehicleId, this.searchText, this.pageNumber, this.pageSize).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.versionsList = response.listOfEntities;
            this.pageNumber = response.currentPage;
            this.pageSize = response.pageSize;
            this.total = response.totalItems;

        }, (error: IError) => {
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    onPageChange(pageNumber) {
        if (this.isGettingList || this.isDeleting || this.isGettingPage) return;

        this.pageNumber = pageNumber;
        this.isGettingPage = true;
        this.getVersionsList();
    }

    createVersion(): void {
        if (this.isDeleting) return;
        this.navigationService.toVersionsCreation();
    }

    editVersion(id: string): void {
        if (this.isDeleting) return;
        this.navigationService.toVersionsEdition({
            queryParams: {
                id: id
            }
        });
    }

    viewVersion(id: string): void {
        if (this.isDeleting) return;
        this.navigationService.toVersionsView({
            queryParams: {
                id: id
            }
        });
    }


    askForDeleteVersion(id: number) {
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
                this.deleteVersion(id);
            }
        })
    }

    private deleteVersion(id: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.versionService.deleteVersion(id)
            .subscribe(() => {
                this.messageService.open('version.version-list.deleted-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.getVersionsList();
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

    setPreLaunch(version: Version, value: boolean): void {
        if (this.isSettingPreLaunchValue || this.isGettingPage || this.isDeleting) return;

        this.isSettingPreLaunchValue = true;
        const previousValue = version.preLaunch;
        version.preLaunch = value;
        const subscription = this.versionService.setVersionPreLaunch(version.id, value)
            .subscribe(() => {
                this.isSettingPreLaunchValue = false;
            }, (error: IError) => {
                this.isSettingPreLaunchValue = false;
                if (error && error.Code)
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                else
                    this.messageService.open('version.set-pre-launch-error', MessageType.ERROR);
                setTimeout(() => {
                    version.preLaunch = previousValue;
                }, 100);
            });
        this.subscriptions.push(subscription);
    }

    changeVersionPrice(version: Version): void {
        // si hay un cambio de precio en proceso, no puedo continuar
        if (this.isChangingPriceInProcess()) return;
        if (!version.newCurrency || !version.newPrice) return;

        version.isChangingPrice = true;
        const subscription = this.versionService.changeVersionPrice(version.id, version.newCurrency, version.newPrice)
            .subscribe(() => {
                version.isSelected = false;
                version.currency = version.newCurrency;
                version.price = version.newPrice;
                version.isChangingPrice = false;
                this.messageService.open('version.change-price-success', MessageType.SUCCESS);
            }, (error: IError) => {
                version.isChangingPrice = false;
                if (error && error.Code)
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                else
                    this.messageService.open('version.change-price-error', MessageType.ERROR);
            });
        this.subscriptions.push(subscription);
    }

    isChangingPriceInProcess(): boolean {
        return this.versionsList.filter(v => v.isChangingPrice).length > 0;
    }

    cancelChangePrice(version: Version): void {
        if (this.isChangingPriceInProcess()) return;
        version.isSelected = false;
        version.newCurrency = version.currency;
        version.newPrice = version.price;
    }

    isAdmin(): string {
        return UserProfileEnum.ADMIN;
    }

    isReadOnly(): string {
        return UserProfileEnum.READONLY;
    }

    backToVehicles(): void {
        this.navigationService.toVehiclesList();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
