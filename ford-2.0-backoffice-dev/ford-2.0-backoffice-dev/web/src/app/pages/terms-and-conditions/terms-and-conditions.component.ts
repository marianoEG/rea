import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { TermsAndConditions } from "src/app/core/models/terms-and-conditions.model";
import { MessageService } from "src/app/core/services/message.service";
import { TermsAndConditionsService } from "src/app/core/services/terms-and-conditions.services";
import { MessageType } from "src/app/utils/constants";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
    selector: 'terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    currentTermsAndConditions: TermsAndConditions;

    breadCrumbItems: Array<{}>;
    loading: boolean;
    saving: boolean;

    public Editor = ClassicEditor;

    constructor(
        private termsAndConditionsService: TermsAndConditionsService,
        private translateService: TranslateService,
        private messageService: MessageService
    ) {
        this.subscriptions = [];

        this.loading = false;
        this.saving = false;
        this.breadCrumbItems = [{ label: this.translateService.instant('terms-and-conditions.terms-and-conditions') }, { label: this.translateService.instant('terms-and-conditions.terms-and-conditions'), active: true }];


        this.currentTermsAndConditions = new TermsAndConditions();
    }

    ngOnInit(): void {
        this.getLatestTermsAndConditions();
    }

    getLatestTermsAndConditions() {
        this.loading = true
        const subscription = this.termsAndConditionsService.getLatestTermsAndConditions().subscribe(termsAndConditions => {
            this.currentTermsAndConditions = termsAndConditions;
            this.loading = false;
        }, (error: IError) => {
            this.loading = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });

        this.subscriptions.push(subscription);
    }

    updateVersion(): void {
        let update = parseInt(this.currentTermsAndConditions.version) + 1;
        this.currentTermsAndConditions.version = update.toString();
    }

    saveTermsAndConditions(): void {
        this.saving = true;
        this.updateVersion();
        const subscribe = this.termsAndConditionsService.createTermsAndConditions(this.currentTermsAndConditions).subscribe(termsAndConditions => {
            this.saving = false;
            this.messageService.open('global.save-success', MessageType.SUCCESS);
        }, (error: IError) => {
            this.saving = false;
            if (error && error.Code) {
                this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
            } else {
                this.messageService.open('global.server_connection_error', MessageType.ERROR);
            }
        });
        this.subscriptions.push(subscribe);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }

}