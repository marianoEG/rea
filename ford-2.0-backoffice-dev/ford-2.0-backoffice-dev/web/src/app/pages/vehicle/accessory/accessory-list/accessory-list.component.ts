import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import Swal from 'sweetalert2';
import { SharedService } from "src/app/shared/shared.service";
import { MessageType, UserProfileEnum } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { VehicleAccessory } from "src/app/core/models/vehicle-accessory.model";
import { VehicleAccessoryService } from "src/app/core/services/vehicle-accessory.service";

@Component({
    selector: 'accessory-list',
    templateUrl: './accessory-list.component.html',
    styleUrls: ['./accessory-list.component.scss']
})
export class VehicleAccessoryListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    accessoryList: VehicleAccessory[];
    breadCrumbItems: Array<{}>;

    pageNumber: number;
    pageSize: number;
    total: number;

    isGettingList: boolean;
    isGettingPage: boolean;
    isDeleting: boolean;

    searchText: string;

    vehicleId: number;
    vehicleName: string;

    constructor(
        private translateService: TranslateService,
        private vehicleAccessoryService: VehicleAccessoryService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = [];
        this.accessoryList = [];
        this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('vehicle-accessory.vehicle-accessories') }, { label: this.translateService.instant('vehicle-accessory.vehicle-accessories'), active: true }];

        this.isGettingList = false;
        this.isGettingPage = false;

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
                this.getVehicleAccessoryList();
            }
        });
        this.subscriptions.push(subscription);
    }

    ngOnInit() {
        this.isGettingList = true;
        this.getVehicleAccessoryList();
    }

    getVehicleAccessoryList(): void {
        const subscription = this.vehicleAccessoryService.getVehicleAccessories(this.vehicleId, this.searchText, this.pageNumber, this.pageSize).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.accessoryList = response.listOfEntities;
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
        this.getVehicleAccessoryList();
    }

    createVehicleAccessory(): void {
        if (this.isDeleting) return;
        this.navigationService.toVehicleAccessoryCreation();
    }

    editVehicleAccessory(id: string): void {
        if (this.isDeleting) return;
        this.navigationService.toVehicleAccessoryEdition({
            queryParams: {
                id: id
            }
        });
    }

    viewVehicleAccessory(id: string): void {
        if (this.isDeleting) return;
        this.navigationService.toVehicleAccessoryView({
            queryParams: {
                id: id
            }
        });
    }

    askForDeleteVehicleAccessory(id: number) {
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
                this.deleteVehicleAccessory(id);
            }
        })
    }

    private deleteVehicleAccessory(accessoryId: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.vehicleAccessoryService.deleteVehicleAccessory(this.vehicleId, accessoryId)
            .subscribe(() => {
                this.messageService.open('vehicle-accessory.vehicle-accessory-list.deleted-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.getVehicleAccessoryList();
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
