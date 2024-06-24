import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { MessageType } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { DeviceService } from "src/app/core/services/device.service";
import { Device } from "src/app/core/models/device.model";

@Component({
    selector: 'device-list',
    templateUrl: './device-list.component.html',
    styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    deviceList: Device[];
    breadCrumbItems: Array<{}>;

    pageNumber: number;
    pageSize: number;
    total: number;

    isGettingList: boolean;
    isGettingPage: boolean;

    constructor(
        private translateService: TranslateService,
        private deviceService: DeviceService,
        private navigationService: NavigationService,
        private messageService: MessageService
    ) {
        this.subscriptions = [];
        this.deviceList = [];
        this.breadCrumbItems = [
            { label: this.translateService.instant('device.devices') },
            { label: this.translateService.instant('device.devices'), active: true }
        ];

        this.isGettingList = false;
        this.isGettingPage = false;

        this.pageNumber = 1;
        this.pageSize = 20;

        // const subscription = this.sharedService.$searchTextEmitted.subscribe(searchText => { });
        // this.subscriptions.push(subscription);
    }

    ngOnInit() {
        this.isGettingList = true;
        this.getDeviceList();
    }

    getDeviceList(): void {
        const subscription = this.deviceService.getDevices(this.pageNumber, this.pageSize).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.deviceList = response.listOfEntities;
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
        if (this.isGettingList || this.isGettingPage) return;

        this.pageNumber = pageNumber;
        this.isGettingPage = true;
        this.getDeviceList();
    }

    seeDetails(uniqueId: string): void {
        this.navigationService.toDeviceDetails({
            queryParams: {
                'uniqueId': uniqueId
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
