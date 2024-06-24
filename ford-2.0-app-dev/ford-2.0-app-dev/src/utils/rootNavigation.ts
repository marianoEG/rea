// RootNavigation.js
import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import { Vehicle } from '../model/Vehicle';
import { VehicleVersion } from '../model/VehicleVersion';
import { Dealership } from '../model/Dealership';

export type RootStackParams = {
  SyncNotFound: undefined;
  NavDrawer: undefined;
  Events: undefined;
  Guests: { subEvent?: string },
  QRCodeGuestScanner: { subEventId?: number, subEventName?: string },
  QRTestDriveScanner: undefined,
  Home: undefined;
  Vehicles: undefined;
  VehicleNavigator: undefined;
  VehicleDetail: { vehicleId?: number };
  VehicleComparator: { vehicle: Vehicle, versions: VehicleVersion[] };
  NewsletterForm: undefined;
  NewsletterFormStack: { vehicle?: Vehicle, newsletterForm?: string };
  DealerShips: { vehicleId?: number };
  DelaerShipQuoteForm: { vehicle?: Vehicle, vehicleVersion?: VehicleVersion, dealership?: Dealership, quoteForm?: string };
  TestDriveForm: undefined;
  TestDriveFormStack: { testDriveForm?: string };
  TestDriveSignature: { testDriveForm?: string };
  CampaignsChecker: undefined;
  SearchHistory: undefined;
  SyncForms: undefined;
  SyncGuests: undefined;
  SyncDevices: undefined;
};

export const rootNavigationRef = createNavigationContainerRef<RootStackParams>()

export function navigate(name: keyof RootStackParams, params: any) {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.navigate(name, params);
  }
}

export function push(name: string, params?: object) {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.dispatch(StackActions.push(name, params));
  }
}

export function reset(name: string, params?: object) {
  if (rootNavigationRef.isReady()) {
    rootNavigationRef.reset({
      index: 0,
      routes: [{ name, params }]
    })
  }
}

// add other navigation functions that you need and export them
