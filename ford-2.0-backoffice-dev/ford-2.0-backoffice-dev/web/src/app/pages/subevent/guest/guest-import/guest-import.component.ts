import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { GuestImport } from "src/app/core/models/guest-import.model";
import { GuestService } from "src/app/core/services/guest.services";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { VehicleService } from "src/app/core/services/vehicle.service";
import { MessageType } from "src/app/utils/constants";

@Component({
    selector: 'guest-import',
    templateUrl: './guest-import.component.html',
    styleUrls: ['./guest-import.component.scss']
})

export class GuestImportComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    breadCrumbItems = [];
    isSaving: boolean;

    eventId: number;
    subeventId: number;
    subeventName: string;

    file: File;

    constructor(
        private navigationService: NavigationService,
        private guestService: GuestService,
        private translateService: TranslateService,
        private messageService: MessageService,
        private localStorageService: LocalStorageService,
        public vehicleService: VehicleService
    ) {
        this.subscriptions = [];

        this.breadCrumbItems = [{ label: this.translateService.instant('guest.guests') }, { label: this.translateService.instant('guest.guest-import.guest-import'), active: true }];

        this.isSaving = false;

        this.file = null;

        this.eventId = this.localStorageService.getSubevent().eventID;
        this.subeventId = this.localStorageService.getSubevent().id;
        this.subeventName = this.localStorageService.getSubevent().name;

    }

    ngOnInit(): void {

    }

    getFile(event: any):void {
        this.file = event.target.files[0];
    }

    cancel(): void {
        this.navigationService.toGuestList();
    }

    
    guestImport(): void {
        if (!this.file) return

        let guestImport = new GuestImport();
        guestImport.eventId = this.eventId;
        guestImport.subeventId = this.subeventId;
        guestImport.fileData = this.file;
        this.isSaving = true;
        const subscribe = this.guestService.importGuestList(guestImport).subscribe(guest => {
            this.isSaving = false;
            this.messageService.open('guest.guest-import.guest-import-success', MessageType.SUCCESS);
            this.navigationService.toGuestList();
        }, (error: IError) => {
            this.isSaving = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscribe);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}