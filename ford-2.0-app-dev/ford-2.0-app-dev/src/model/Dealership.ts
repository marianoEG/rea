import { BaseData } from "./BaseData";

export interface Dealership extends BaseData {
    name?: string;
    provinceId?: number;
    localityId?: number;
    provinceName?: string;
    localityName?: string;
    code?: string;
    streetNameAndNumber?: string;
    postalCode?: string;
    phone1?: string;
    phone2?: string;
    dealerCode?: string;
    latitude?: number;
    longitude?: number;
}