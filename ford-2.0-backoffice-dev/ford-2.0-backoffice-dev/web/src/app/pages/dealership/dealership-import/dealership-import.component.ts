import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { DealershipService } from "src/app/core/services/dealership.service";
import { MessageService } from "src/app/core/services/message.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { MessageType } from "src/app/utils/constants";

@Component({
    selector: 'dealership-import',
    templateUrl: './dealership-import.component.html',
    styleUrls: ['./dealership-import.component.scss']
})

export class DealershipImportComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    breadCrumbItems = [];
    isSaving: boolean;

    file: File;

    constructor(
        private navigationService: NavigationService,
        private dealershipService: DealershipService,
        private translateService: TranslateService,
        private messageService: MessageService
    ) {
        this.subscriptions = [];

        this.breadCrumbItems = [{ label: this.translateService.instant('dealership.dealerships') }, { label: this.translateService.instant('dealership.dealership-import.dealership-import'), active: true }];

        this.isSaving = false;

        this.file = null;

    }

    ngOnInit(): void {

    }

    getFile(event: any):void {
        this.file = event.target.files[0];
    }

    cancel(): void {
        this.navigationService.toDealershipList();
    }

    
    dealershipImport(): void {
        if (!this.file) return

        this.isSaving = true;
        
        const subscribe = this.dealershipService.importDealershipList(this.file).subscribe(dealership => {
            this.isSaving = false;
            this.messageService.open('dealership.dealership-import.dealership-import-success', MessageType.SUCCESS);
            this.navigationService.toDealershipList();
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