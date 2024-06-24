import { Nullable } from "../../utils/constants";

export class Dealership {
    id: Nullable<number>;
    name: Nullable<string>;
    code: Nullable<string>;
    provinceId: Nullable<number>;
    cityId: Nullable<number>;
    lat: Nullable<number>;
    long: Nullable<string>;
    streetNameAndNumber: Nullable<string>
    postalCode: Nullable<string>
    phone1: Nullable<string>
    phone2: Nullable<string>
    dealerCode: Nullable<string>
}