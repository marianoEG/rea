import { ErrorDbType } from "../utils/constants";

export interface Error {
    Code?: string;
    Message?: string;
}

export interface ErrorDB {
    id?: string;
    description?: string;
    date?: Date;
    type?: ErrorDbType;
    deviceUniqueId?: string;
    deviceName?: string;
    operativeSystem?: string;
    operativeSystemVersion?: string;
    brand?: string;
    model?: string;
    appVersion?: string;
    connectionType?: string;
}