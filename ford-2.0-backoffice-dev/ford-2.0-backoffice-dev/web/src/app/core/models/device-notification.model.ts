import { Nullable, SyncActionTypeEnum } from "src/app/utils/constants";

export class DeviceNotification {
    id: Nullable<number>
    message: Nullable<string>
    createdOnDate: Nullable<string>
    deliveredDate: Nullable<string>
    deviceId: Nullable<number>
    deviceUniqueId: Nullable<string>
}