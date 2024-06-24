import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import Swal from 'sweetalert2';
import { SharedService } from "src/app/shared/shared.service";
import { MessageType, UserProfileEnum } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { CampaignService } from "src/app/core/services/campaign.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { ResourceService } from "src/app/core/services/resource.service";

@Component({
    selector: 'campaign-list',
    templateUrl: './campaign-list.component.html',
    styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    campaignsList: string[];
    breadCrumbItems: Array<{}>;

    pageNumber: number;
    pageSize: number;
    total: number;

    isGettingList: boolean;
    isDeleting: boolean;

    searchText: string;

    file: File;

    constructor(
        private translateService: TranslateService,
        private campaignService: CampaignService,
        private resourceService: ResourceService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = [];
        this.campaignsList = [];
        this.breadCrumbItems = [{ label: this.translateService.instant('campaign.campaigns') }, { label: this.translateService.instant('campaign.campaigns'), active: true }];

        this.isGettingList = false;

        this.pageNumber = 1;
        this.pageSize = 20;

        this.searchText = '';

        const subscription = this.sharedService.$searchTextEmitted.subscribe(searchText => {
            if (!this.isDeleting) {
                this.searchText = searchText;
                this.pageNumber = 1;
                this.pageSize = 20;
                this.isGettingList = true;
                this.getCampaignsList();
            }
        });
        this.subscriptions.push(subscription);
    }

    ngOnInit() {
        this.isGettingList = true;
        this.getCampaignsList();
    }

    getCampaignsList(): void {
        const subscription = this.campaignService.getCampaigns().subscribe(campaignsList => {
            this.isGettingList = false;
            this.campaignsList = campaignsList
        }, (error: IError) => {
            this.isGettingList = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    getFile(event: any):void {
        this.file = event.target.files[0];
        this.uploadFile();
    }

    uploadFile(): void {
        const subscription = this.resourceService.saveAndGetResourceUrl(this.file).subscribe(url => {
            this.isGettingList = true;
            this.getCampaignsList();
        }, (error: IError) => {
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    askForDeleteCampaign(url: string) {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('campaign.are-you-sure'),
            text: this.translateService.instant('campaign.campaign-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('campaign.delete'),
            cancelButtonText: this.translateService.instant('campaign.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteCampaign(url);
            }
        })
    }

    private deleteCampaign(url: string): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.campaignService.deleteCampaign(url)
            .subscribe(() => {
                this.messageService.open('campaign.deleted-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.getCampaignsList();
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

    getCampaignName(url: string): string {
        return url.split('campaigns/')[1]; 
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