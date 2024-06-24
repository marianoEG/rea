import { GuestStatusEnum, GuestTypeEnum } from "../utils/constants";
import { BaseData } from "./BaseData";

export interface Guest extends BaseData {
    serverId?: number; // this map with the property id from the server (API)
    createdOn?: Date;
    modifiedOn?: Date;
    firstname?: string;
    lastname?: string;
    documentType?: string;
    documentNumber?: string;
    phoneNumber?: string;
    email?: string;
    carLicencePlate?: string;
    type?: GuestTypeEnum;
    companionReference?: string;
    observations1?: string;
    observations2?: string;
    observations3?: string;
    zone?: string;
    status?: GuestStatusEnum;
    isSynchronized?: boolean;
    syncDate?: Date;
    changedByQrscanner?: boolean;
}

export interface ExtendedGuest extends Guest {
    eventId?: number;
    subEventId?: number;
    subEventName?: string;
}