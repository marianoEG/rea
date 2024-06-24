import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import Swal from 'sweetalert2';
import { SharedService } from "src/app/shared/shared.service";
import { MessageType, UserProfileEnum } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { Event } from "src/app/core/models/event.model";
import { EventService } from "src/app/core/services/event.service";
import { LocalStorageService } from "src/app/core/services/local-storage.service";

@Component({
    selector: 'event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    eventList: Event[];
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
        private eventService: EventService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = [];
        this.eventList = [];
        this.breadCrumbItems = [{ label: this.translateService.instant('event.events') }, { label: this.translateService.instant('event.events'), active: true }];

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
                this.getEventsList();
            }
        });
        this.subscriptions.push(subscription);
    }

    ngOnInit() {
        this.isGettingList = true;
        this.getEventsList();
    }

    getEventsList(): void {
        const subscription = this.eventService.getEvents(this.searchText, this.pageNumber, this.pageSize).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.eventList = response.listOfEntities;
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
        this.getEventsList();
    }

    createEvent(): void {
        if (this.isDeleting) return;
        this.navigationService.toEventCreation();
    }

    editEvent(id: string): void {
        if (this.isDeleting) return;
        this.navigationService.toEventEdition({
            queryParams: {
                'id': id
            }
        });
    }

    viewEvent(id: string): void {
        this.navigationService.toEventView({
            queryParams: {
                'id': id
            }
        });
    }

    getDateToShow(date: Date): string {
        return new Date(date).toLocaleDateString();
    }

    askForDeleteEvent(id: number) {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('event.event-list.are-you-sure'),
            text: this.translateService.instant('event.event-list.event-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('event.event-list.delete'),
            cancelButtonText: this.translateService.instant('event.event-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteEvent(id);
            }
        })
    }

    private deleteEvent(id: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.eventService.deleteEvent(id)
            .subscribe(() => {
                this.messageService.open('event.event-list.deleted-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.getEventsList();
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
