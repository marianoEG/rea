import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(public router: Router) { }

  public navigateTo(url: string, options?: NavigationExtras): void {
    this.router.navigate([url], options);
  }

  public toLogin(options?: NavigationExtras): void {
    this.navigateTo('/auth/login', options);
  }

  public toChangePassword(options?: NavigationExtras): void {
    this.navigateTo('/auth/change-password', options);
  }

  // User services
  public toUsersList(options?: NavigationExtras): void {
    this.navigateTo('/user-list', options);
  }

  public toUsersCreation(options?: NavigationExtras): void {
    this.navigateTo('/user-creation', options);
  }

  public toUsersEdition(options?: NavigationExtras): void {
    this.navigateTo('/user-edition', options);
  }

  // Event services
  public toEventList(options?: NavigationExtras): void {
    this.navigateTo('/event-list', options);
  }

  public toEventCreation(options?: NavigationExtras): void {
    this.navigateTo('/event-creation', options);
  }

  public toEventEdition(options?: NavigationExtras): void {
    this.navigateTo('/event-edition', options);
  }

  public toEventView(options?: NavigationExtras): void {
    this.navigateTo('/event-view', options);
  }

  // Vehicle services
  public toVehiclesList(options?: NavigationExtras): void {
    this.navigateTo('/vehicle-list', options);
  }

  public toVehiclesCreation(options?: NavigationExtras): void {
    this.navigateTo('/vehicle-creation', options);
  }

  public toVehiclesEdition(options?: NavigationExtras): void {
    this.navigateTo('/vehicle-edition', options);
  }

  public toVehiclesView(options?: NavigationExtras): void {
    this.navigateTo('/vehicle-view', options);
  }

  // Vehicle Accessories services
  public toVehicleAccessoryList(options?: NavigationExtras): void {
    this.navigateTo('/vehicle-accessory-list', options);
  }

  public toVehicleAccessoryCreation(options?: NavigationExtras): void {
    this.navigateTo('/vehicle-accessory-creation', options);
  }

  public toVehicleAccessoryEdition(options?: NavigationExtras): void {
    this.navigateTo('/vehicle-accessory-edition', options);
  }

  public toVehicleAccessoryView(options?: NavigationExtras): void {
    this.navigateTo('/vehicle-accessory-view', options);
  }

  // Version services
  public toVersionsList(options?: NavigationExtras): void {
    this.navigateTo('/version-list', options);
  }

  public toVersionsCreation(options?: NavigationExtras): void {
    this.navigateTo('/version-creation', options);
  }

  public toVersionsEdition(options?: NavigationExtras): void {
    this.navigateTo('/version-edition', options);
  }

  public toVersionsView(options?: NavigationExtras): void {
    this.navigateTo('/version-view', options);
  }

  // Subevent services
  public toSubeventList(options?: NavigationExtras): void {
    this.navigateTo('/subevent-list', options);
  }

  public toSubeventCreation(options?: NavigationExtras): void {
    this.navigateTo('/subevent-creation', options);
  }

  public toSubeventEdition(options?: NavigationExtras): void {
    this.navigateTo('/subevent-edition', options);
  }

  public toSubeventView(options?: NavigationExtras): void {
    this.navigateTo('/subevent-view', options);
  }

  // Dealership services
  public toDealershipList(options?: NavigationExtras): void {
    this.navigateTo('/dealership-list', options);
  }

  public toDealershipCreation(options?: NavigationExtras): void {
    this.navigateTo('/dealership-creation', options);
  }

  public toDealershipEdition(options?: NavigationExtras): void {
    this.navigateTo('/dealership-edition', options);
  }
  public toDealershipView(options?: NavigationExtras): void {
    this.navigateTo('/dealership-view', options);
  }

  public toDealershipImport(options?: NavigationExtras): void {
    this.navigateTo('/dealership-import', options);
  }

  // Guest services
  public toGuestList(options?: NavigationExtras): void {
    this.navigateTo('/guest-list', options);
  }

  public toGuestCreation(options?: NavigationExtras): void {
    this.navigateTo('/guest-creation', options);
  }

  public toGuestEdition(options?: NavigationExtras): void {
    this.navigateTo('/guest-edition', options);
  }

  public toGuestView(options?: NavigationExtras): void {
    this.navigateTo('/guest-view', options);
  }

  public toGuestImport(options?: NavigationExtras): void {
    this.navigateTo('/guest-import', options);
  }

  // Form services
  public toFormList(options?: NavigationExtras): void {
    this.navigateTo('/form-list', options);
  }

  public toQuoteFormView(options?: NavigationExtras): void {
    this.navigateTo('/quote-form-view', options);
  }

  public toTestDriveView(options?: NavigationExtras): void {
    this.navigateTo('/test-drive-form-view', options);
  }

  public toNewsletterFormView(options?: NavigationExtras): void {
    this.navigateTo('/newsletter-form-view', options);
  }

  // Devices
  public toDeviceList(options?: NavigationExtras): void {
    this.navigateTo('/device-list', options);
  }

  public toDeviceDetails(options?: NavigationExtras): void {
    this.navigateTo('/device-detail', options);
  }

  public toDeviceNotificationCreation(options?: NavigationExtras): void {
    this.navigateTo('/device-notification-creation', options);
  }
}