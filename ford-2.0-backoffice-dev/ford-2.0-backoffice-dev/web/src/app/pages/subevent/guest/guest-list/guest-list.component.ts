import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../../core/services/navigation.service";
import { fromEvent, Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import Swal from 'sweetalert2';
import { SharedService } from "src/app/shared/shared.service";
import { ExportObjectType, MessageType, UserProfileEnum } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { LocalStorageService } from "src/app/core/services/local-storage.service";
import { Guest } from "src/app/core/models/guest.model";
import { GuestService } from "src/app/core/services/guest.services";
import { ExcelExportService } from "src/app/core/services/excel-export.service";
import html2canvas from 'html2canvas';
import { capitalize } from "src/app/utils/functions";
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'guest-list',
    templateUrl: './guest-list.component.html',
    styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit, AfterViewInit, OnDestroy {

    subscriptions: Subscription[];
    guestsList: Guest[];
    breadCrumbItems: Array<{}>;

    pageNumber: number;
    pageSize: number;
    total: number;

    isGettingList: boolean;
    isGettingPage: boolean;
    isDeleting: boolean;
    isDeletingAll: boolean;
    isDownloadingQR: boolean;

    changedByQrscanner?: boolean = null;
    searchText: string;
    @ViewChild('inputSearch') inputSearch: ElementRef;

    eventId: number;
    eventCode: string;
    subeventId: number;
    subEventName: string;
    subEventGuestNumber: number;
    isSendingToSaleForce: boolean;

    constructor(
        private translateService: TranslateService,
        private guestService: GuestService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private localStorageService: LocalStorageService,
        private excelExportService: ExcelExportService,
        private activeRoute: ActivatedRoute
    ) {
        this.subscriptions = [];
        this.guestsList = [];
        this.breadCrumbItems = [{ label: this.translateService.instant('subevent.subevents') }, { label: this.translateService.instant('guest.guests') }, { label: this.translateService.instant('guest.guests'), active: true }];

        this.isGettingList = false;
        this.isGettingPage = false;

        this.pageNumber = 1;
        this.pageSize = 20;

        this.searchText = '';

        this.eventId = this.localStorageService.getSubevent().eventID;
        this.eventCode = this.activeRoute.snapshot.queryParamMap.get('eventCode');
        this.subeventId = this.localStorageService.getSubevent().id;
        this.subEventName = this.localStorageService.getSubevent().name;
        this.subEventGuestNumber = this.localStorageService.getSubevent().guestNumber;
        this.isSendingToSaleForce = false;

        // It is no longer necessary to use the global input listener because a text filter has been added to this screen. 
        // const subscription = this.sharedService.$searchTextEmitted.subscribe(searchText => {
        //     if (!this.isDeleting) {
        //         this.searchText = searchText;
        //         this.pageNumber = 1;
        //         this.pageSize = 20;
        //         this.isGettingList = true;
        //         this.getGuestsList();
        //     }
        // });
        // this.subscriptions.push(subscription);
    }

    ngOnInit() {
        this.isGettingList = true;
        this.getGuestsList();
    }

    ngAfterViewInit(): void {
        fromEvent(this.inputSearch.nativeElement, 'keyup')
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(event => {
                if (!this.isGettingList && !this.isDeleting && !this.isDeletingAll) {
                    this.pageNumber = 1;
                    this.pageSize = 20;
                    this.isGettingList = true;
                    this.getGuestsList();
                }
            });
    }

    qrScannerFilterChanged(): void {
        this.pageNumber = 1;
        this.pageSize = 20;
        this.isGettingList = true;
        this.getGuestsList();
    }

    getGuestsList(): void {
        const subscription = this.guestService.getGuests(this.pageNumber, this.pageSize, this.eventId, this.subeventId, this.searchText, this.changedByQrscanner).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.guestsList = response.listOfEntities;
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

    exportGuests() {
        this.isGettingList = true;
        const subscription = this.guestService.getGuests(1, 30000, this.eventId, this.subeventId, this.searchText, this.changedByQrscanner).subscribe(response => {
            this.isGettingList = false;
            let headersList = [
                { key: 'dni', value: this.translateService.instant('guest.guest-edition.dni') },
                { key: 'firstname', value: this.translateService.instant('guest.guest-edition.firstname') },
                { key: 'lastname', value: this.translateService.instant('guest.guest-edition.lastname') },
                { key: 'email', value: this.translateService.instant('guest.guest-edition.email') },
                { key: 'phone', value: this.translateService.instant('guest.guest-edition.phone') },
                { key: 'state', value: this.translateService.instant('guest.guest-edition.state') },
                { key: 'type', value: this.translateService.instant('guest.guest-edition.type') },
                { key: 'licence', value: this.translateService.instant('guest.guest-edition.licence') },
                { key: 'changedByQrscanner', value: this.translateService.instant('guest.guest-list.changed-by-qr-scanner') },
                { key: 'companion-reference', value: this.translateService.instant('guest.guest-edition.companion-reference') },
                { key: 'zone', value: this.translateService.instant('guest.guest-edition.zone') },
                { key: 'observations1', value: this.translateService.instant('guest.guest-edition.observations1') },
                { key: 'observations2', value: this.translateService.instant('guest.guest-edition.observations2') },
                { key: 'observations3', value: this.translateService.instant('guest.guest-edition.observations3') },
                { key: 'date', value: this.translateService.instant('guest.guest-edition.date') },
                { key: 'hour', value: this.translateService.instant('guest.guest-edition.hour') },
                { key: 'vehicle', value: this.translateService.instant('guest.guest-edition.vehicle') }
            ];
            this.excelExportService.export(response.listOfEntities, headersList, ExportObjectType.GUEST);
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

    onPageChange(pageNumber) {
        if (this.isGettingList || this.isDeleting || this.isGettingPage || this.isDeletingAll) return;

        this.pageNumber = pageNumber;
        this.isGettingPage = true;
        this.getGuestsList();
    }

    createGuest(): void {
        if (this.isDeleting || this.isDeletingAll) return;
        this.navigationService.toGuestCreation();
    }

    editGuest(id: string): void {
        if (this.isDeleting || this.isDeletingAll) return;
        this.navigationService.toGuestEdition({
            queryParams: {
                id: id
            }
        });
    }

    viewGuest(id: string): void {
        if (this.isDeleting || this.isDeletingAll) return;
        this.navigationService.toGuestView({
            queryParams: {
                id: id
            }
        });
    }

    importGuestList(): void {
        this.navigationService.toGuestImport();
    }

    askForDeleteGuest(id: number) {
        if (this.isDeleting || this.isDeletingAll) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('guest.guest-list.are-you-sure'),
            text: this.translateService.instant('guest.guest-list.guest-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('guest.guest-list.delete'),
            cancelButtonText: this.translateService.instant('guest.guest-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteGuest(id);
            }
        })
    }

    private deleteGuest(guestId: number): void {
        if (this.isDeleting || this.isDeletingAll) return;

        this.isDeleting = true;
        const subscription = this.guestService.deleteGuest(this.eventId, this.subeventId, guestId)
            .subscribe(() => {
                this.messageService.open('guest.guest-list.deleted-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.getGuestsList();
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

    askForDeleteGuests() {
        if (this.isDeleting || this.isDeletingAll) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('guest.guest-list.are-you-sure'),
            text: this.translateService.instant('guest.guest-list.guests-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('guest.guest-list.delete-all'),
            cancelButtonText: this.translateService.instant('guest.guest-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteGuests();
            }
        })
    }

    private deleteGuests(): void {
        if (this.isDeleting || this.isDeletingAll) return;

        this.isDeletingAll = true;
        const subscription = this.guestService.deleteGuests(this.eventId, this.subeventId)
            .subscribe(() => {
                this.messageService.open('guest.guest-list.deleted-all-success', MessageType.SUCCESS);
                this.isDeletingAll = false;
                this.getGuestsList();
            }, (error: IError) => {
                this.isDeletingAll = false;
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

    backToSubevents(): void {
        this.navigationService.toSubeventList({
            queryParams: {
                eventId: this.eventId
            }
        });
    }

    getGuestNumberText(): string {
        return this.translateService.instant('guest.guest-list.guest-number') + ': ' + this.total + '/' + this.subEventGuestNumber;
    }

    downloadQR(guest: Guest) {
        if (this.isDownloadingQR) return;

        this.isDownloadingQR = true;
        this.guestService.downloadQr(guest.id).subscribe(res => {
            try {
                // Manipula los datos de respuesta (archivo blob)
                const blob = new Blob([res], { type: 'application/octet-stream' });
                // Crea un enlace para descargar el archivo
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const lastname = capitalize(guest.lastname);
                const firstname = capitalize(guest.firstname);
                const currentDate = new Date();
                const hh = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours().toString();
                const mm = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes().toString();
                const ss = currentDate.getSeconds() < 10 ? '0' + currentDate.getSeconds() : currentDate.getSeconds().toString();
                a.download = `${lastname}${firstname}_${hh}${mm}${ss}.png`;
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                this.messageService.open('global.download-qr-code-error', MessageType.ERROR);
            }
            this.isDownloadingQR = false;
        }, error => {
            this.isDownloadingQR = false;
            this.messageService.open('global.download-qr-code-error', MessageType.ERROR);
        });
    }

    sendToSaleForce(): void {
        if (this.isSendingToSaleForce)
            return;

        this.isSendingToSaleForce = true;
        const subscription = this.guestService.sendToSaleForce(this.eventId, this.subeventId)
            .subscribe(res => {
                debugger
                this.isSendingToSaleForce = false;
                this.messageService.open('guest.guest-list.send_to_sale_force_success', MessageType.SUCCESS);
            }, error => {
                debugger
                this.isSendingToSaleForce = false;
                this.messageService.open('guest.guest-list.send_to_sale_force_error', MessageType.ERROR);
            });

        this.subscriptions.push(subscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
