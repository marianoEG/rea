import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { SharedService } from "src/app/shared/shared.service";
import { FormType, MessageType } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { QuoteForm } from "src/app/core/models/quote-form.model";
import { TestDriveForm } from "src/app/core/models/test-drive.model";
import { NewsletterForm } from "src/app/core/models/newsletter-form.model";
import { FormService } from "src/app/core/services/form.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];

    testDriveFormList: TestDriveForm[];    
    newsletterFormList: NewsletterForm[];
    quoteFormList: QuoteForm[];

    formTypes: string[];
    selectedFormType: FormType;

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
        private formService: FormService,
        private navigationService: NavigationService,
        private sharedService: SharedService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute
    ) {

        this.subscriptions = [];
        this.testDriveFormList = [];
        this.quoteFormList = [];
        this.newsletterFormList = [];
        
        this.formTypes = [];
        this.formTypes.push(FormType.QUOTE);
        this.formTypes.push(FormType.TEST_DRIVE);
        this.formTypes.push(FormType.NEWSLETTER);

        this.breadCrumbItems = [{ label: this.translateService.instant('form.forms') }, { label: this.translateService.instant('form.forms'), active: true }];

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
                if (this.selectedFormType == FormType.QUOTE) this.getQuoteFormsList();
                if (this.selectedFormType == FormType.TEST_DRIVE) this.getTestDriveFormsList();
                if (this.selectedFormType == FormType.NEWSLETTER) this.getNewsletterFormsList();
            }
        });
        this.subscriptions.push(subscription);
    }

    ngOnInit() {
        if (this.activatedRoute.snapshot.queryParams['formType'] == FormType.QUOTE) {
            this.selectedFormType = FormType.QUOTE;
            this.testDriveFormList = [];
            this.newsletterFormList = [];
            this.isGettingPage = true;
            this.getQuoteFormsList();
        } else if (this.activatedRoute.snapshot.queryParams['formType'] == FormType.TEST_DRIVE) {
            this.selectedFormType = FormType.TEST_DRIVE;
            this.newsletterFormList = [];
            this.quoteFormList = [];
            this.isGettingList = true;
            this.getTestDriveFormsList();
        } else if (this.activatedRoute.snapshot.queryParams['formType'] == FormType.NEWSLETTER) {
            this.selectedFormType = FormType.NEWSLETTER;
            this.testDriveFormList = [];
            this.quoteFormList = [];
            this.isGettingList = true;
            this.getNewsletterFormsList();
        } 
    }

    getTestDriveFormsList(): void {
        const subscription = this.formService.getTestDriveForms(this.searchText, this.pageNumber, this.pageSize).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.testDriveFormList = response.listOfEntities;
            this.pageNumber = response.currentPage;
            this.pageSize = response.pageSize;
            this.total = response.totalItems;
        }, (error: IError) => {
            this.isGettingList = false;
            this.isGettingPage = false;
            if (error && error.Code)  {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    getQuoteFormsList(): void {
        const subscription = this.formService.getQuoteForms(this.searchText, this.pageNumber, this.pageSize).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.quoteFormList = response.listOfEntities;
            this.pageNumber = response.currentPage;
            this.pageSize = response.pageSize;
            this.total = response.totalItems;
        }, (error: IError) => {
            this.isGettingList = false;
            this.isGettingPage = false;
            if (error && error.Code)  {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    getNewsletterFormsList(): void {
        const subscription = this.formService.getNewsletterForms(this.searchText, this.pageNumber, this.pageSize).subscribe(response => {
            this.isGettingList = false;
            this.isGettingPage = false;
            this.newsletterFormList = response.listOfEntities;
            this.pageNumber = response.currentPage;
            this.pageSize = response.pageSize;
            this.total = response.totalItems;
        }, (error: IError) => {
            this.isGettingList = false;
            this.isGettingPage = false;
            if (error && error.Code)  {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    selectedFormChange(): void {
        if (this.selectedFormType == FormType.TEST_DRIVE) {
            this.newsletterFormList = [];
            this.quoteFormList = [];
            this.isGettingList = true;
            this.getTestDriveFormsList();
        } else if (this.selectedFormType == FormType.QUOTE) {
            this.testDriveFormList = [];
            this.newsletterFormList = [];
            this.isGettingList = true;
            this.getQuoteFormsList();
        } else if (this.selectedFormType == FormType.NEWSLETTER) {
            this.testDriveFormList = [];
            this.quoteFormList = [];
            this.isGettingList = true;
            this.getNewsletterFormsList();
        }
    }

    onPageChange(pageNumber) {
        if (this.isGettingList || this.isDeleting || this.isGettingPage) return;

        this.pageNumber = pageNumber;
        this.isGettingPage = true;

        if (this.selectedFormType == FormType.TEST_DRIVE) {
            this.newsletterFormList = [];
            this.quoteFormList = [];
            this.isGettingPage = true;
            this.getTestDriveFormsList();
        } else if (this.selectedFormType == FormType.QUOTE) {
            this.testDriveFormList = [];
            this.newsletterFormList = [];
            this.isGettingPage = true;
            this.getQuoteFormsList();
        } else if (this.selectedFormType == FormType.NEWSLETTER) {
            this.isGettingPage = true;
            this.testDriveFormList = [];
            this.quoteFormList = [];
            this.getNewsletterFormsList();
        }
    }

    quoteFormView(quoteFormId: string): void {
        this.navigationService.toQuoteFormView({
            queryParams: {
                'quoteFormId': quoteFormId
            }
        });        
    }

    testDriveFormView(testDriveFormId: string): void {
        this.navigationService.toTestDriveView({
            queryParams: {
                'testDriveFormId': testDriveFormId
            }
        });        
    }

    newsletterFormView(newsletterFormId: string): void {
        this.navigationService.toNewsletterFormView({
            queryParams: {
                'newsletterFormId': newsletterFormId
            }
        });      
    }

    getDateToShow(date: Date): string {
        return new Date(date).toLocaleDateString();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
