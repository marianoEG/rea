import { Nullable } from "../../utils/constants";

export class NewsletterForm {
    id: Nullable<number>;
    eventId: Nullable<number>;
    email: Nullable<string>;
    firstname: Nullable<string>;
    lastname: Nullable<string>;
    vehicleOfInterest: Nullable<string>;
    recieveInformation: Nullable<boolean>;
    acceptConditions: Nullable<boolean>;
}