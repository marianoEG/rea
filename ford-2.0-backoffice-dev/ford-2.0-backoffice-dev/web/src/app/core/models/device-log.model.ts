import { Nullable, SyncActionTypeEnum } from "src/app/utils/constants";

export class DeviceLog {
    id: Nullable<number>
    type: Nullable<SyncActionTypeEnum>
    date: Nullable<string>
    ip: Nullable<string>
    connectionType: Nullable<string>
}