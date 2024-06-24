import { Nullable } from "src/app/utils/constants";

export class Guest {
    id: Nullable<number>;
    subeventId: Nullable<number>;
    type: Nullable<string>;
    firstname: Nullable<string>;
    lastname: Nullable<string>;
    documentNumber: Nullable<string>;
    phoneNumber: Nullable<string>;
    email: Nullable<string>;
    carLicencePlate: Nullable<string>;
    companionReference: Nullable<string>;
    observations1: Nullable<string>;
    observations2: Nullable<string>;
    observations3: Nullable<string>;
    zone: Nullable<string>;
    state: Nullable<string>;
    dataToScan: Nullable<string>;
    changedByQrscanner: Nullable<boolean>;
    preferenceDate: Nullable<string>;
    preferenceHour: Nullable<string>;
    preferenceVehicle: Nullable<string>;
}