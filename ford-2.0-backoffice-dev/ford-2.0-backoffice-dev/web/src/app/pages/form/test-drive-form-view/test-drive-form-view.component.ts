import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavigationService } from "../../../core/services/navigation.service";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { FormType, MessageType } from "src/app/utils/constants";
import { MessageService } from "src/app/core/services/message.service";
import { ActivatedRoute } from "@angular/router";
import { FormService } from "src/app/core/services/form.service";
import { TestDriveForm } from "src/app/core/models/test-drive.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'test-drive-form-view',
    templateUrl: './test-drive-form-view.component.html',
    styleUrls: ['./test-drive-form-view.component.scss']
})
export class TestDriveFormViewComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];

    currentTestDriveForm: TestDriveForm;

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

        this.breadCrumbItems = [{ label: this.translateService.instant('form.forms') }, { label: this.translateService.instant('form.test-drive-form-view.test-drive-form-view'), active: true }];
        

        this.currentTestDriveForm = new TestDriveForm();
    }

    ngOnInit(): void {
        this.getTestDriveForm();
    }

    getTestDriveForm(): void {
        const subscription = this.formService.getTestDriveFormById(this.activatedRoute.snapshot.queryParams['testDriveFormId']).subscribe(testDriveForm => {
       
            this.currentTestDriveForm = testDriveForm;

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
                'formType': FormType.TEST_DRIVE
            }
        });
    }

    getDateToShow(): string {
        return this.currentTestDriveForm.dateOfPurchase ? new Date(this.currentTestDriveForm.dateOfPurchase).toLocaleDateString() : '';
    }

    openTermsAndConditions(modal: any): void {
        this.modalService.open(modal, {size: 'lg'});
    }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => { subscription.unsubscribe() });
    }
}
