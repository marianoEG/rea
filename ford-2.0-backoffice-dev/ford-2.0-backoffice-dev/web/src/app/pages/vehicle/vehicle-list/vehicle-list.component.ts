import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import Swal from 'sweetalert2';
import { SharedService } from "src/app/shared/shared.service";
import { MessageType, UserProfileEnum, VehicleType } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { Vehicle } from "src/app/core/models/vehicle.model";
import { VehicleService } from "src/app/core/services/vehicle.service";
import { LocalStorageService } from "src/app/core/services/local-storage.service";

@Component({
    selector: 'vehicle-list',
    templateUrl: './vehicle-list.component.html',
    styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    vehicleList: Vehicle[];
    breadCrumbItems: Array<{}>;

    pageNumber: number;
    pageSize: number;
    total: number;

    isGettingList: boolean;
    isGettingPage: boolean;
    isDeleting: boolean;

    searchText: string;

    constructor(
        private translateService: TranslateService,
        private vehicleService: VehicleService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = [];
        this.vehicleList = [];
        this.breadCrumbItems = [{ label: this.translateService.instant('vehicle.vehicles') }, { label: this.translateService.instant('vehicle.vehicles'), active: true }];

        this.isGettingList = false;
        this.isGettingPage = false;

        this.pageNumber = 1;
        this.pageSize = 20;

        this.searchText = '';
        
        const subscription = this.sharedService.$searchTextEmitted.subscribe(searchText => {
            if (!this.isDeleting) {
                this.searchText = searchText;
                this.pageNumber = 1;
                this.pageSize = 20;
                this.isGettingList = true;
                this.getVehiclesList();
            }
        });
        this.subscriptions.push(subscription);
    }

    ngOnInit() {
        this.isGettingList = true;
        this.getVehiclesList();
    }

    getVehiclesList(): void {
        const subscription = this.vehicleService.getVehicles(this.searchText, this.pageNumber, this.pageSize).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.vehicleList = response.listOfEntities;
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
        this.getVehiclesList();
    }

    createVehicle(): void {
        if (this.isDeleting) return;
        this.navigationService.toVehiclesCreation();
    }

    editVehicle(id: string): void {
        if (this.isDeleting) return;
        this.navigationService.toVehiclesEdition({
            queryParams: {
                'id': id
            }
        });
    }

    viewVehicle(id: string): void {
        if (this.isDeleting) return;
        this.navigationService.toVehiclesView({
            queryParams: {
                'id': id
            }
        });
    }

    toVersionList(vehicle: Vehicle) {
        if (this.isDeleting) return;
        this.localStorageService.saveVehicleData(vehicle);
        this.navigationService.toVersionsList();
    }

    toVehicleAccessoryList(vehicle: Vehicle) {
        if (this.isDeleting) return;
        this.localStorageService.saveVehicleData(vehicle);
        this.navigationService.toVehicleAccessoryList();
    }

    askForDeleteVehicle(id: number) {
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
                this.deleteVehicle(id);
            }
        })
    }

    private deleteVehicle(id: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.vehicleService.deleteVehicle(id)
            .subscribe(() => {
                this.messageService.open('vehicle.vehicle-list.deleted-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.getVehiclesList();
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

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
