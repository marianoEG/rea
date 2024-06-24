import { Nullable } from "../../utils/constants";

export class QuoteForm {
    id: Nullable<number>;
    eventId: Nullable<number>;
    vehicleId: Nullable<number>;
    dealershipId: Nullable<number>;
    email: Nullable<string>;
    firstname: Nullable<string>;
    lastname: Nullable<string>;
    documentType: Nullable<string>;
    documentNumber: Nullable<string>;
    pointOfSale: Nullable<string>;
    phoneArea1: Nullable<string>;
    phone1: Nullable<string>;
    phoneArea2: Nullable<string>;
    phone2: Nullable<string>;
    recieveInformation: Nullable<boolean>;
    acceptConditions: Nullable<boolean>;
}