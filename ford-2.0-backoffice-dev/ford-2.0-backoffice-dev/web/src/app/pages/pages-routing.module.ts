import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ScreenViewType, UserProfileEnum } from '../utils/constants';
import { CampaignSearchListComponent } from './campaign-search/campaign-search-list.component';
import { CampaignListComponent } from './campaign/campaign-list.component';
import { DealershipEditionComponent } from './dealership/dealership-edition/dealership-edition.component';
import { DealershipImportComponent } from './dealership/dealership-import/dealership-import.component';
import { DealershipListComponent } from './dealership/dealership-list/dealership-list.component';
import { EventEditionComponent } from './event/event-edition/event-edition.component';
import { EventListComponent } from './event/event-list/event-list.component';
import { FormListComponent } from './form/form-list/form-list.component';
import { NewsletterFormViewComponent } from './form/newsletter-form-view/newsletter-form-view.component';
import { QuoteFormViewComponent } from './form/quote-form-view/quote-form-view.component';
import { TestDriveFormViewComponent } from './form/test-drive-form-view/test-drive-form-view.component';
import { GeneralConfigurationComponent } from './general-configuration/general-configuration.component';
import { GuestEditionComponent } from './subevent/guest/guest-edition/guest-edition.component';
import { GuestImportComponent } from './subevent/guest/guest-import/guest-import.component';
import { GuestListComponent } from './subevent/guest/guest-list/guest-list.component';
import { SubeventEditionComponent } from './subevent/subevent-edition/subevent-edition.component';
import { SubeventListComponent } from './subevent/subevent-list/subevent-list.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { UserEditionComponent } from './user/user-edition/user-edition.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { VehicleAccessoryEditionComponent } from './vehicle/accessory/accessory-edition/accessory-edition.component';
import { VehicleAccessoryListComponent } from './vehicle/accessory/accessory-list/accessory-list.component';
import { VehicleEditionComponent } from './vehicle/vehicle-edition/vehicle-edition.component';
import { VehicleListComponent } from './vehicle/vehicle-list/vehicle-list.component';
import { VersionEditionComponent } from './vehicle/version/version-edition/version-edition.component';
import { VersionListComponent } from './vehicle/version/version-list/version-list.component';
import { DeviceListComponent } from './device/device-list/device-list.component';
import { DeviceDetailComponent } from './device/device-detail/device-detail.component';
import { DeviceNotification } from '../core/models/device-notification.model';
import { DeviceNotificationComponent } from './device/device-notification/device-notification.component';

const routes: Routes = [
  { path: '', redirectTo: 'user-list' },

  // User routes
  { path: 'user-list', component: UserListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'user-creation', component: UserEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.CREATE, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'user-edition', component: UserEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.EDIT, permissions: { only: [UserProfileEnum.ADMIN] } } },

  // Event routes
  { path: 'event-list', component: EventListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },
  { path: 'event-creation', component: EventEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.CREATE, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'event-edition', component: EventEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.EDIT, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'event-view', component: EventEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.VIEW, permissions: { only: [UserProfileEnum.READONLY] } } },

  // Subevent routes
  { path: 'subevent-list', component: SubeventListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },
  { path: 'subevent-creation', component: SubeventEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.CREATE, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'subevent-edition', component: SubeventEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.EDIT, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'subevent-view', component: SubeventEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.VIEW, permissions: { only: [UserProfileEnum.READONLY] } } },

  // Vehicle routes
  { path: 'vehicle-list', component: VehicleListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },
  { path: 'vehicle-creation', component: VehicleEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.CREATE, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'vehicle-edition', component: VehicleEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.EDIT, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'vehicle-view', component: VehicleEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.VIEW, permissions: { only: [UserProfileEnum.READONLY] } } },

  // Accessories routes
  { path: 'vehicle-accessory-list', component: VehicleAccessoryListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },
  { path: 'vehicle-accessory-creation', component: VehicleAccessoryEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.CREATE, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'vehicle-accessory-edition', component: VehicleAccessoryEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.EDIT, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'vehicle-accessory-view', component: VehicleAccessoryEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.VIEW, permissions: { only: [UserProfileEnum.READONLY] } } },

  // Version routes
  { path: 'version-list', component: VersionListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },
  { path: 'version-creation', component: VersionEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.CREATE, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'version-edition', component: VersionEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.EDIT, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'version-view', component: VersionEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.VIEW, permissions: { only: [UserProfileEnum.READONLY] } } },

  // Dealership routes
  { path: 'dealership-list', component: DealershipListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },
  { path: 'dealership-creation', component: DealershipEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.CREATE, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'dealership-edition', component: DealershipEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.EDIT, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'dealership-view', component: DealershipEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.VIEW, permissions: { only: [UserProfileEnum.READONLY] } } },
  { path: 'dealership-import', component: DealershipImportComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN] } } },

  // Guest routes
  { path: 'guest-list', component: GuestListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },
  { path: 'guest-creation', component: GuestEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.CREATE, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'guest-edition', component: GuestEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.EDIT, permissions: { only: [UserProfileEnum.ADMIN] } } },
  { path: 'guest-view', component: GuestEditionComponent, canActivate: [NgxPermissionsGuard], data: { screenViewType: ScreenViewType.VIEW, permissions: { only: [UserProfileEnum.READONLY] } } },
  { path: 'guest-import', component: GuestImportComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN] } } },

  // Form routes
  { path: 'form-list', component: FormListComponent },
  { path: 'quote-form-view', component: QuoteFormViewComponent },
  { path: 'test-drive-form-view', component: TestDriveFormViewComponent },
  { path: 'newsletter-form-view', component: NewsletterFormViewComponent },

  // Terms And Conditions 
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },

  // Campaign
  { path: 'campaign-list', component: CampaignListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },

  // Campaign Searches
  { path: 'campaign-searches-list', component: CampaignSearchListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },


  // General configuration 
  { path: 'general-configuration', component: GeneralConfigurationComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN] } } },

  // Devices 
  { path: 'device-list', component: DeviceListComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },
  { path: 'device-detail', component: DeviceDetailComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } },
  { path: 'device-notification-creation', component: DeviceNotificationComponent, canActivate: [NgxPermissionsGuard], data: { permissions: { only: [UserProfileEnum.ADMIN, UserProfileEnum.READONLY] } } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
