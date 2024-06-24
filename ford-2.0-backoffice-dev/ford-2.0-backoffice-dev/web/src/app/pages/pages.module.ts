import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule, NgbCollapseModule, NgbPaginationModule, NgbAlertModule, NgbModal, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { LightboxModule } from 'ngx-lightbox';
import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';
import { PagesRoutingModule } from './pages-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserListComponent } from './user/user-list/user-list.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserEditionComponent } from './user/user-edition/user-edition.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { EventEditionComponent } from './event/event-edition/event-edition.component';
import { DropzoneConfigInterface, DropzoneModule, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { UiSwitchModule } from 'ngx-ui-switch';
import { VehicleListComponent } from './vehicle/vehicle-list/vehicle-list.component';
import { VehicleEditionComponent } from './vehicle/vehicle-edition/vehicle-edition.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VersionListComponent } from './vehicle/version/version-list/version-list.component';
import { VersionEditionComponent } from './vehicle/version/version-edition/version-edition.component';
import { SubeventListComponent } from './subevent/subevent-list/subevent-list.component';
import { SubeventEditionComponent } from './subevent/subevent-edition/subevent-edition.component';
import { DealershipListComponent } from './dealership/dealership-list/dealership-list.component';
import { DealershipEditionComponent } from './dealership/dealership-edition/dealership-edition.component';
import { VehicleAccessoryListComponent } from './vehicle/accessory/accessory-list/accessory-list.component';
import { VehicleAccessoryEditionComponent } from './vehicle/accessory/accessory-edition/accessory-edition.component';
import { GuestListComponent } from './subevent/guest/guest-list/guest-list.component';
import { GuestEditionComponent } from './subevent/guest/guest-edition/guest-edition.component';
import { FormListComponent } from './form/form-list/form-list.component';
import { QuoteFormViewComponent } from './form/quote-form-view/quote-form-view.component';
import { TestDriveFormViewComponent } from './form/test-drive-form-view/test-drive-form-view.component';
import { NewsletterFormViewComponent } from './form/newsletter-form-view/newsletter-form-view.component';
import { GuestImportComponent } from './subevent/guest/guest-import/guest-import.component';
import { DealershipImportComponent } from './dealership/dealership-import/dealership-import.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GeneralConfigurationComponent } from './general-configuration/general-configuration.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CampaignListComponent } from './campaign/campaign-list.component';
import { CampaignSearchListComponent } from './campaign-search/campaign-search-list.component';
import { QRCodeModule } from 'angularx-qrcode';
import { DeviceListComponent } from './device/device-list/device-list.component';
import { DeviceDetailComponent } from './device/device-detail/device-detail.component';
import { PipeModule } from '../core/pipes/pipe.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { DeviceNotificationComponent } from './device/device-notification/device-notification.component';



FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: environment.api.url + '/Resource/upload-file',
  maxFilesize: 50,
};

@NgModule({
  declarations: [
    UserListComponent,
    UserEditionComponent,
    EventListComponent,
    EventEditionComponent,
    VehicleListComponent,
    VehicleEditionComponent,
    VersionListComponent,
    VersionEditionComponent,
    SubeventListComponent,
    SubeventEditionComponent,
    DealershipListComponent,
    DealershipEditionComponent,
    DealershipImportComponent,
    VehicleAccessoryListComponent,
    VehicleAccessoryEditionComponent,
    GuestListComponent,
    GuestEditionComponent,
    GuestImportComponent,
    FormListComponent,
    QuoteFormViewComponent,
    TestDriveFormViewComponent,
    NewsletterFormViewComponent,
    TermsAndConditionsComponent,
    GeneralConfigurationComponent,
    CampaignListComponent,
    CampaignSearchListComponent,
    DeviceListComponent,
    DeviceDetailComponent,
    DeviceNotificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModalModule,
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UIModule,
    WidgetModule,
    FullCalendarModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SimplebarAngularModule,
    LightboxModule,
    NgbPaginationModule,
    TranslateModule,
    NgbAlertModule,
    DropzoneModule,
    QRCodeModule,
    UiSwitchModule,
    NgSelectModule,
    NgbModalModule,
    NgbCarouselModule,
    NgbTooltipModule,
    CKEditorModule,
    PdfViewerModule,
    NgxPermissionsModule.forChild(),
    PipeModule,
    DragDropModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]
})
export class PagesModule { }
