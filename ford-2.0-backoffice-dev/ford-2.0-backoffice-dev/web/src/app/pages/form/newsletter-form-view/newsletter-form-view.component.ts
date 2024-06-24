import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { FormType, MessageType } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { ActivatedRoute } from "@angular/router";
import { FormService } from "src/app/core/services/form.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NewsletterForm } from "src/app/core/models/newsletter-form.model";

@Component({
    selector: 'newsletter-form-view',
    templateUrl: './newsletter-form-view.component.html',
    styleUrls: ['./newsletter-form-view.component.scss']
})
export class NewsletterFormViewComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];

    currentNewsletterForm: NewsletterForm;

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

        this.breadCrumbItems = [{ label: this.translateService.instant('form.forms') }, { label: this.translateService.instant('form.newsletter-form-view.newsletter-form-view'), active: true }];
        

        this.currentNewsletterForm = new NewsletterForm();
    }

    ngOnInit(): void {
        this.getNewsletterForm();
    }

    getNewsletterForm(): void {
        const subscription = this.formService.getNewsletterFormById(this.activatedRoute.snapshot.queryParams['newsletterFormId']).subscribe(newsletterForm => {
            this.currentNewsletterForm = newsletterForm;

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
                'formType': FormType.NEWSLETTER
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
