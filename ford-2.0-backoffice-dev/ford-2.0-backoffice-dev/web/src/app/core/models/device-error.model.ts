import { ErrorDbType, Nullable, SyncActionTypeEnum } from "src/app/utils/constants";

export class DeviceError {
    id: Nullable<number>;
    appVersion: Nullable<string>;
    brand: Nullable<string>;
    connectionType: Nullable<string>;
    date: Nullable<string>;
    description: Nullable<string>;
    deviceId: Nullable<number>;
    deviceName: Nullable<string>;
    deviceUniqueId: Nullable<string>;
    model: Nullable<string>;
    operativeSystem: Nullable<string>;
    operativeSystemVersion: Nullable<string>;
    type: Nullable<ErrorDbType>;

}