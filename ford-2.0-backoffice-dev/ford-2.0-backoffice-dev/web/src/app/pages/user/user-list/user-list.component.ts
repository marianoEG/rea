import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { User } from "src/app/core/models/user.model";
import { UserService } from "src/app/core/services/user.service";
import Swal from 'sweetalert2';
import { SharedService } from "src/app/shared/shared.service";
import { MessageType } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    userList: User[];
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
        private userService: UserService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService
    ) {
        this.subscriptions = [];
        this.userList = [];
        this.breadCrumbItems = [{ label: this.translateService.instant('user.users') }, { label: this.translateService.instant('user.users'), active: true }];

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
                this.getUsersList();
            }
        });
        this.subscriptions.push(subscription);
    }

    ngOnInit() {
        this.isGettingList = true;
        this.getUsersList();
    }

    getUsersList(): void {
        const subscription = this.userService.getUsers(this.searchText, this.pageNumber, this.pageSize).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.userList = response.listOfEntities;
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
        this.getUsersList();
    }

    createUser(): void {
        if (this.isDeleting) return;
        this.navigationService.toUsersCreation();
    }

    editUser(id: string): void {
        if (this.isDeleting) return;
        this.navigationService.toUsersEdition({
            queryParams: {
                'id': id
            }
        });
    }


    askForDeleteUser(id: string) {
        if (this.isDeleting) return;

        Swal.fire({
            icon: 'warning',
            title: this.translateService.instant('user.user-list.are-you-sure'),
            text: this.translateService.instant('user.user-list.user-will-be-eliminated'),
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#0162e8',
            confirmButtonText: this.translateService.instant('user.user-list.delete'),
            cancelButtonText: this.translateService.instant('user.user-list.cancel'),
            reverseButtons: true

        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteUser(id);
            }
        })
    }

    private deleteUser(id: string): void {
        if (this.isDeleting) return;

        this.isDeleting = true;
        const subscription = this.userService.deleteUser(id)
            .subscribe(() => {
                this.messageService.open('user.user-list.deleted-success', MessageType.SUCCESS);
                this.isDeleting = false;
                this.getUsersList();
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

    getDayDiff(expirationDate: Date): number {
        const msInDay = 24 * 60 * 60 * 1000;
        return Math.round(Math.abs(Number(new Date(expirationDate)) - Number(new Date())) / msInDay);
      }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
