import { Nullable } from "../../utils/constants";

export class TestDriveForm {
    id: Nullable<number>;
    eventId: Nullable<number>;
    vehicleId: Nullable<number>;
    email: Nullable<string>;
    firstname: Nullable<string>;
    lastname: Nullable<string>;
    brand: Nullable<string>;
    model: Nullable<string>;
    age: Nullable<number>;
    dateOfPurchase: Nullable<Date>;
    licencePlate: Nullable<string>;
    vehicleOfInterest: Nullable<string>;
    hasVehicle: Nullable<boolean>;
    companions: Nullable<boolean>;
    recieveInformation: Nullable<boolean>;
    acceptConditions: Nullable<boolean>;
}