import { Component, OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { IError } from "src/app/core/interfaces/error.interface";
import { GeneralConfiguration } from "src/app/core/models/general-configuration.model";
import { GeneralConfigurationService } from "src/app/core/services/general-configuration.service";
import { MessageService } from "src/app/core/services/message.service";
import { ResourceService } from "src/app/core/services/resource.service";
import { GeneralConfigurationsKeys, MessageType } from "src/app/utils/constants";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'general-configuration',
    templateUrl: './general-configuration.component.html',
    styleUrls: ['./general-configuration.component.scss']
})

export class GeneralConfigurationComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[];
    configurations: GeneralConfiguration[];
    breadCrumbItems = [];

    isSaving: boolean;
    loading: boolean;

    file: File;
    pdfToShow: string;

    public Editor = ClassicEditor;

    constructor(
        private configurationService: GeneralConfigurationService,
        private resourceService: ResourceService,
        private translateService: TranslateService,
        private messageService: MessageService,
        private modalService: NgbModal
    ) {
        this.subscriptions = [];
        this.configurations = [];

        this.breadCrumbItems = [{ label: this.translateService.instant('general-configuration.general-configuration') }, { label: this.translateService.instant('general-configuration.general-configuration'), active: true }];

        this.isSaving = false;
        this.loading = false;
        this.file = null;
    }

    ngOnInit(): void {
        this.getConfigurations();
    }

    getConfigurations(): void {
        this.loading = true;
        const subscribe = this.configurationService.getConfigurations()
            .subscribe(configurations => {
                this.loading = false;
                this.configurations = configurations;
            }, (error: IError) => {
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });
        this.subscriptions.push(subscribe);
    }

    getFile(event: any, key: string): void {
        this.file = event.target.files[0];
        const subscribe = this.resourceService.saveAndGetResourceUrl(this.file)
            .subscribe(url => {
                let configToUpdate = this.configurations.find(config => config.key == key);
                configToUpdate.value = url;
            }, (error: IError) => {
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });
        this.subscriptions.push(subscribe);
    }

    resetConfigValue(key: GeneralConfigurationsKeys): void {
        const config = this.configurations.find(c => c.key == key);
        config.value = "/";
    }

    nameToShow(key: GeneralConfigurationsKeys): string {
        const config = this.configurations.find(c => c.key == key);
        return config?.value?.split("files\\")[1];
    }

    showPDFFile(pdfModal, pdfToShow: string): void {
        this.pdfToShow = pdfToShow;
        this.modalService.open(pdfModal);
    }

    sendConfigurations(): void {
        this.isSaving = true;
        const subscribe = this.configurationService.sendConfigurations(this.configurations)
            .subscribe(() => {
                this.isSaving = false;
                this.messageService.open('global.save-success', MessageType.SUCCESS);
            }, (error: IError) => {
                if (error && error.Code) {
                    this.messageService.open('api_responses.' + error.Code, MessageType.ERROR);
                } else {
                    this.messageService.open('global.server_connection_error', MessageType.ERROR);
                }
            });
        this.subscriptions.push(subscribe);
    }

    get GeneralConfigurationsKeysEnum(): typeof GeneralConfigurationsKeys {
        return GeneralConfigurationsKeys;
    }

    get declarationOwner(): string {
        const config = this.configurations.find(c => c.key == GeneralConfigurationsKeys.DEMARCATION_OWNER);
        return config && config.value != '/' && config.value != null ? config.value : null;
    }

    get declarationOwnerInCaravan(): string {
        const config = this.configurations.find(c => c.key == GeneralConfigurationsKeys.DEMARCATION_OWNER_IN_CARAVAN);
        return config && config.value != '/' && config.value != null ? config.value : null;
    }

    get declarationFord(): string {
        const config = this.configurations.find(c => c.key == GeneralConfigurationsKeys.DEMARCATION_FORD);
        return config && config.value != '/' && config.value != null ? config.value : null;
    }

    get testDriveTerms(): string {
        const config = this.configurations.find(c => c.key == GeneralConfigurationsKeys.TEST_DRIVE_TERMS_URL);
        return config && config.value != '/' && config.value != null ? config.value : null;
    }

    get newsletterTerms(): string {
        const config = this.configurations.find(c => c.key == GeneralConfigurationsKeys.NEWSLETTER_TERMS_URL);
        return config && config.value != '/' && config.value != null ? config.value : null;
    }

    get quoteTerms(): string {
        const config = this.configurations.find(c => c.key == GeneralConfigurationsKeys.QUOTE_TERMS_URL);
        return config && config.value != '/' && config.value != null ? config.value : null;
    }

    get contactDataIndex(): number {
        return this.configurations.findIndex(c => c.key == GeneralConfigurationsKeys.CONTACT_DATA);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}