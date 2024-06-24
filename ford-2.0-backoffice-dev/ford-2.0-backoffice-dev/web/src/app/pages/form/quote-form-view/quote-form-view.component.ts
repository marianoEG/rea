import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { FormType, MessageType } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { ActivatedRoute } from "@angular/router";
import { QuoteForm } from "src/app/core/models/quote-form.model";
import { FormService } from "src/app/core/services/form.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'quote-form-view',
    templateUrl: './quote-form-view.component.html',
    styleUrls: ['./quote-form-view.component.scss']
})
export class QuoteFormViewComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];

    currentQuoteForm: QuoteForm;

    breadCrumbItems: Array<{}>;

    constructor(
        private navigationService: NavigationService,
        private formService: FormService,
        private translateService: TranslateService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private modalService: NgbModal
    ) {
        this.subscriptions = [];

        this.breadCrumbItems = [{ label: this.translateService.instant('form.forms') }, { label: this.translateService.instant('form.quote-form-view.quote-form-view'), active: true }];
        

        this.currentQuoteForm = new QuoteForm();
    }

    ngOnInit(): void {
        this.getQuoteForm();
    }

    getQuoteForm(): void {
        const subscription = this.formService.getQuoteFormById(this.activatedRoute.snapshot.queryParams['quoteFormId']).subscribe(quoteForm => {
            this.currentQuoteForm = quoteForm;

        }, (error: IError) => {
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscription);
    }

    back() {
        this.navigationService.toFormList({
            queryParams: {
                'formType': FormType.QUOTE
            }
        });
    }

    openTermsAndConditions(modal: any): void {
        this.modalService.open(modal, {size: 'lg'});
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
