import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { SharedService } from "src/app/shared/shared.service";
import { ExportObjectType, MessageType, UserProfileEnum } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { ResourceService } from "src/app/core/services/resource.service";
import { CampaignSearch } from "src/app/core/models/campaign-search.model";
import { CampaignSearchService } from "src/app/core/services/campaign-search.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Event } from "src/app/core/models/event.model";
import { EventService } from "src/app/core/services/event.service";
import { ISOToDate } from "src/app/utils/iso-to-date";
import { ExcelExportService } from "src/app/core/services/excel-export.service";

@Component({
    selector: 'campaign-list',
    templateUrl: './campaign-search-list.component.html',
    styleUrls: ['./campaign-search-list.component.scss']
})
export class CampaignSearchListComponent implements OnInit, OnDestroy {

    MAX_VALUE = 100000;

    subscriptions: Subscription[];
    campaignSearchesList: CampaignSearch[];
    eventList: Event[];
    breadCrumbItems: Array<{}>;

    selectedEvent: Event;

    currentSearch: CampaignSearch;

    pageNumber: number;
    pageSize: number;
    total: number;

    isGettingList: boolean;
    isDeleting: boolean;

    searchText: string;

    file: File;

    dateFrom: string;
    dateTo: string;

    constructor(
        private translateService: TranslateService,
        private campaignSearchService: CampaignSearchService,
        private resourceService: ResourceService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private eventService: EventService,
        private modalService: NgbModal,
        private excelExportService: ExcelExportService
    ) {
        this.subscriptions = [];
        this.campaignSearchesList = [];
        this.breadCrumbItems = [{ label: this.translateService.instant('campaign-search.campaign-searches') }, { label: this.translateService.instant('campaign-search.campaign-searches'), active: true }];

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
                this.initialize();
            }
        });
        this.subscriptions.push(subscription);

        this.selectedEvent = null;
        this.dateFrom = null;
        this.dateTo = null;
    }

    ngOnInit() {
        this.initialize();
    }

    initialize(): void {
        let subscription = forkJoin([
            this.eventService.getEvents(this.searchText, this.pageNumber, this.pageSize)
        ]).subscribe(([response]) => {

            this.eventList = response.listOfEntities;
            this.selectedEvent = this.eventList[0];
            this.isGettingList = true;
            this.getCampaignsSearchList();

        }, (error: IError) => {
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    getCampaignsSearchList(): void {
        let dateFrom = this.dateFrom ?  new Date(this.dateFrom).toISOString() : null;
        let dateTo = this.dateTo ? new Date(this.dateTo).toISOString() : null;
        const subscription = this.campaignSearchService.getCampaignSearches(
            this.searchText,
            this.pageNumber,
            this.pageSize,
            this.selectedEvent.id,
            dateFrom,
            dateTo)
            .subscribe(response => {
                this.isGettingList = false;
                if (this.pageSize < this.MAX_VALUE) {
                    this.campaignSearchesList = response.listOfEntities;
                    this.pageNumber = response.currentPage;
                    this.pageSize = response.pageSize;
                    this.total = response.totalItems;
                } else {
                    let headersList = [
                        {key: 'event', value:'campaign-search.event'}, 
                        {key: 'search-text', value: this.translateService.instant('campaign-search.search-text')},
                        {key: 'search-date', value: this.translateService.instant('campaign-search.search-date')},
                        {key: 'vin', value: this.translateService.instant('campaign-search.vin')},
                        {key: 'cc', value: this.translateService.instant('campaign-search.cc')},
                        {key: 'pat', value: this.translateService.instant('campaign-search.pat')},
                        {key: 'serv', value: this.translateService.instant('campaign-search.serv')},
                        {key: 'serv-date', value: this.translateService.instant('campaign-search.serv-date')},
                        {key: 'manten', value: this.translateService.instant('campaign-search.manten')},
                        {key: 'sync-date', value: this.translateService.instant('campaign-search.sync-date')}
                    ];
                    this.excelExportService.export(response.listOfEntities, headersList, ExportObjectType.CAMPAIGN_SEARCH);
                }
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

    getFile(event: any): void {
        this.file = event.target.files[0];
        this.uploadFile();
    }

    uploadFile(): void {
        const subscription = this.resourceService.saveAndGetResourceUrl(this.file).subscribe(url => {
            this.isGettingList = true;
            this.getCampaignsSearchList();
        }, (error: IError) => {
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    onChangeDate():void {
        this.getCampaignsSearchList();
    }

    formatDate(date: string): string {
        let isoDate = ISOToDate(date);
        return isoDate.toLocaleDateString();
    }

    onPageChange(pageNumber) {
        if (this.isGettingList) return;

        this.pageNumber = pageNumber;
        this.isGettingList = true;
        this.pageSize = 20;
        this.getCampaignsSearchList();
    }

    isAdmin() {
        return UserProfileEnum.ADMIN;
    }


    isReadOnly() {
        return UserProfileEnum.READONLY;
    }

    openModal(modal: any, search: CampaignSearch): void {
        this.currentSearch = search;
        this.modalService.open(modal);
    }

    onChangeEvent(): void {
        this.getCampaignsSearchList();
    }

    exportCampaignsSearch() {
        this.pageSize = this.MAX_VALUE;
        this.getCampaignsSearchList();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

    
}