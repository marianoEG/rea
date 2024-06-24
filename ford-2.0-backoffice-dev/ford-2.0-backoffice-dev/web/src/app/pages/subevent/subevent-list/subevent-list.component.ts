import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { forkJoin, fromEvent, Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import Swal from 'sweetalert2';
import { SharedService } from "src/app/shared/shared.service";
import { MessageType, UserProfileEnum } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { Subevent } from "src/app/core/models/subevent.model";
import { SubeventService } from "src/app/core/services/subevent.service";
import { Event } from "src/app/core/models/event.model";
import { EventService } from "src/app/core/services/event.service";
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'subevent-list',
    templateUrl: './subevent-list.component.html',
    styleUrls: ['./subevent-list.component.scss']
})
export class SubeventListComponent implements OnInit, AfterViewInit, OnDestroy {

    subscriptions: Subscription[];
    subeventList: Subevent[];
    eventList: Event[];
    selectedEvent: Event;

    breadCrumbItems: Array<{}>;

    pageNumber: number;
    pageSize: number;
    total: number;

    isGettingEvents: boolean;
    isGettingList: boolean;
    isGettingPage: boolean;
    isDeleting: boolean;

    searchText: string;
    @ViewChild('inputSearch') inputSearch: ElementRef;

    constructor(
        private translateService: TranslateService,
        private subeventService: SubeventService,
        private eventService: EventService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private localStorageService: LocalStorageService
    ) {
        this.subscriptions = [];
        this.subeventList = [];
        this.eventList = [];
        this.breadCrumbItems = [{ label: this.translateService.instant('subevent.subevents') }, { label: this.translateService.instant('subevent.subevents'), active: true }];

        this.isGettingEvents = false;
        this.isGettingList = false;
        this.isGettingPage = false;

        this.pageNumber = 1;
        this.pageSize = 1000;

        this.searchText = '';

        // It is no longer necessary to use the global input listener because a text filter has been added to this screen. 
        // const subscription = this.sharedService.$searchTextEmitted.subscribe(searchText => {
        //     if (!this.isDeleting) {
        //         this.searchText = searchText;
        //         this.pageNumber = 1;
        //         this.pageSize = 20;
        //         this.isGettingList = true;
        //         if (this.selectedEvent) this.getSubeventsList();
        //     }
        // });
        // this.subscriptions.push(subscription);
    }

    ngAfterViewInit(): void {
        fromEvent(this.inputSearch.nativeElement, 'keyup')
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(event => {
                if (!this.isDeleting) {
                    if (this.selectedEvent) {
                        this.pageNumber = 1;
                        this.pageSize = 1000;
                        this.isGettingList = true;
                        this.getSubeventsList();
                    } else
                        this.messageService.open('subevent.subevent-list.event-not-selected', MessageType.WARNING);
                }
            });
    }

    ngOnInit() {
        this.isGettingEvents = true;
        const subscription = forkJoin([
            this.eventService.getEvents(this.searchText, this.pageNumber, 1000)
        ]).subscribe(([response]) => {
            this.eventList = response.listOfEntities;
            this.isGettingEvents = false;

            if (this.activatedRoute.snapshot.queryParams['eventId']) {
                this.selectedEvent = this.eventList.find(event => event.id == this.activatedRoute.snapshot.queryParams['eventId']);
                this.isGettingList = true;
                this.getSubeventsList();
            }

        }, (error: IError) => {
            this.isGettingEvents = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    getSubeventsList(): void {
        const subscription = this.subeventService.getSubevents(this.searchText, this.pageNumber, this.pageSize, this.selectedEvent.id).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.subeventList = response.listOfEntities;
            this.pageNumber = response.currentPage;
            this.pageSize = response.pageSize;
            this.total = response.totalItems;
        }, (error: IError) => {
            this.isGettingList = false;
            this.isGettingPage = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    selectedEventChange(): void {
        if (this.selectedEvent) {
            this.isGettingList = true;
            this.getSubeventsList();
        }
        else
            this.searchText = ''
    }

    onPageChange(pageNumber) {
        if (this.isGettingList || this.isDeleting || this.isGettingPage) return;

        this.pageNumber = pageNumber;
        this.isGettingPage = true;
        this.getSubeventsList();
    }

    createSubevent(): void {
        if (this.isDeleting) return;
        if (this.selectedEvent) {
            this.navigationService.toSubeventCreation({
                queryParams: {
                    'eventId': this.selectedEvent.id
                }
            });
        } else {
            this.navigationService.toSubeventCreation();
        }

    }

    editSubevent(subeventId: string): void {
        if (this.isDeleting) return;
        this.navigationService.toSubeventEdition({
            queryParams: {
                'eventId': this.selectedEvent.id,
                'subeventId': subeventId
            }
        });
    }

    viewSubevent(subeventId: string): void {
        if (this.isDeleting) return;
        this.navigationService.toSubeventView({
            queryParams: {
                'eventId': this.selectedEvent.id,
                'subeventId': subeventId
            }
        });
    }

    getDateToShow(date: Date): string {
        return new Date(date).toLocaleDateString();
    }

    askForDeleteSubevent(id: number) {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('subevent.subevent-list.are-you-sure'),
            text: this.translateService.instant('subevent.subevent-list.subevent-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('subevent.subevent-list.delete'),
            cancelButtonText: this.translateService.instant('subevent.subevent-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteSubevent(id);
            }
        })
    }

    private deleteSubevent(subEventId: number): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.subeventService.deleteSubevent(this.selectedEvent.id, subEventId)
            .subscribe(() => {
                this.messageService.open('subevent.subevent-list.deleted-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.getSubeventsList();
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

    toGuestList(subevent: Subevent) {
        if (this.isDeleting) return;
        this.localStorageService.saveSubEventData(subevent);
        this.navigationService.toGuestList({
            queryParams: {
                'eventCode': this.selectedEvent.code,
            }
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
