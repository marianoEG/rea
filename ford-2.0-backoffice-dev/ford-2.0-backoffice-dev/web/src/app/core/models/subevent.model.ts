import { Nullable } from "../../utils/constants";

export class Subevent {
    id: Nullable<number>;
    eventID: Nullable<number>
    name: Nullable<string>;
    dateFrom: Nullable<string>;
    dateTo: Nullable<string>;
    enable: Nullable<boolean>;
    guestNumber: Nullable<number>;
    image: Nullable<string>;
}