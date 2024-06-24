import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { MessageType, SyncActionTypeEnum, UserProfileEnum } from "src/app/utils/constants";
import { Device } from 'src/app/core/models/device.model';
import { DeviceService } from 'src/app/core/services/device.service';
import Swal from "sweetalert2";
import { DeviceNotification } from "src/app/core/models/device-notification.model";
import { DeviceNotificationService } from "src/app/core/services/device-notification.service";

@Component({
    selector: 'device-detail',
    templateUrl: './device-detail.component.html',
    styleUrls: ['./device-detail.component.scss']
})
export class DeviceDetailComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    breadCrumbItems: Array<{}>;
    isGettingData: boolean;
    isDeletingLogs: boolean;
    isDeletingErrors: boolean;
    isDeletingNotification: boolean;
    device: Device;
    deviceNotifications: DeviceNotification[];
    deviceUniqueId: string;

    constructor(
        private navigationService: NavigationService,
        private deviceService: DeviceService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private deviceNotificationService: DeviceNotificationService
    ) {
        this.subscriptions = [];
        this.breadCrumbItems = [
            { label: this.translateService.instant('device.devices') },
            { label: this.translateService.instant('device.devices'), active: true }
        ];
    }

    ngOnInit(): void {
        this.deviceUniqueId = this.activatedRoute.snapshot.queryParamMap.get('uniqueId');
        this.getDevice();
    }

    private getDevice(): void {
        if (this.isGettingData) return;

        this.isGettingData = true;
        const subscription = this.deviceService.getDeviceByUniqueId(this.deviceUniqueId)
            .subscribe(device => {
                this.device = device;
                console.log(this.device);
                this.isGettingData = false;
            }, (error: IError) => {
                this.isGettingData = false;
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });

        this.subscriptions.push(subscription);
    }

    private getDeviceNotifications(): void {
        if (this.isGettingData) return;

        this.isGettingData = true;
        const subscription = this.deviceNotificationService.getNotifications(this.deviceUniqueId)
            .subscribe(notifications => {
                this.deviceNotifications = notifications.listOfEntities;
                console.log(this.deviceNotifications);
                this.isGettingData = false;
            }, (error: IError) => {
                this.isGettingData = false;
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });

        this.subscriptions.push(subscription);
    }

    askForDeleteLogs() {
        if (this.isDeletingLogs || this.isDeletingErrors || this.isDeletingNotification || this.isLogsEmpty) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('device.device-detail.logs.are-you-sure'),
            text: this.translateService.instant('device.device-detail.logs.logs-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('global.delete'),
            cancelButtonText: this.translateService.instant('global.cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteLogs();
            }
        })
    }

    askForDeleteErrors() {
        if (this.isDeletingLogs || this.isDeletingErrors || this.isDeletingNotification || this.isErrorsEmpty) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('device.device-detail.errors.are-you-sure'),
            text: this.translateService.instant('device.device-detail.errors.errors-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('global.delete'),
            cancelButtonText: this.translateService.instant('global.cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteErrors();
            }
        })
    }

    askForDeleteNotification(notificationId : number){
        if (this.isDeletingLogs || this.isDeletingErrors || this.isDeletingNotification || this.isNotificationsEmpty) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('device.device-detail.notifications.are-you-sure'),
            text: this.translateService.instant('device.device-detail.notifications.notification-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('global.delete'),
            cancelButtonText: this.translateService.instant('global.cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteNotification(notificationId);
            }
        })
    }

    generateMessage(){
        if (this.isDeletingNotification) return;
        this.navigationService.toDeviceNotificationCreation({
            queryParams: {
                'uniqueId': this.deviceUniqueId
            }
        });
    }

    private deleteLogs(): void {
        if (this.isDeletingLogs) return;

        this.isDeletingLogs = true;
        const subscription = this.deviceService.deleteLogs(this.device.uniqueId)
            .subscribe(() => {
                this.device.logs = [];
                this.isDeletingLogs = false;
            }, error => {
                this.isDeletingLogs = false;
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });
        this.subscriptions.push(subscription);
    }

    private deleteErrors(): void {
        if (this.isDeletingErrors) return;

        this.isDeletingErrors = true;
        const subscription = this.deviceService.deleteErrors(this.device.uniqueId)
            .subscribe(() => {
                this.device.errors = [];
                this.isDeletingErrors = false;
            }, error => {
                this.isDeletingErrors = false;
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });
        this.subscriptions.push(subscription);
    }

    private deleteNotification(notificationId : number) : void {
        if (this.isDeletingNotification) return;

        this.isDeletingNotification = true;
        const subscription = this.deviceNotificationService.deleteNotification(notificationId)
            .subscribe(() => {
                this.getDevice();
                this.isDeletingNotification = false;
            }, error => {
                this.isDeletingNotification = false;
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });
        this.subscriptions.push(subscription);
    }

    close(): void {
        this.navigationService.toDeviceList()
    }

    get adminStr(): string {
        return UserProfileEnum.ADMIN;
    }

    get isLogsEmpty(): boolean {
        return !this.device || !this.device.logs || this.device.logs.length == 0;
    }

    get isErrorsEmpty(): boolean {
        return !this.device || !this.device.errors || this.device.errors.length == 0;
    }

    get isNotificationsEmpty(): boolean {
        return !this.device || !this.device.notifications || this.device.notifications.length == 0;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}