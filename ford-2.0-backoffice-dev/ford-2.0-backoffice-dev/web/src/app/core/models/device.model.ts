import { Nullable } from "src/app/utils/constants";
import { DeviceLog } from "./device-log.model";
import { DeviceError } from "./device-error.model";
import { DeviceNotification } from "./device-notification.model";

export class Device {
    id: Nullable<number>
    uniqueId: Nullable<string>
    name: Nullable<string>
    operativeSystem: Nullable<string>
    operativeSystemVersion: Nullable<string>
    brand: Nullable<string>
    model: Nullable<string>
    appVersion: Nullable<string>
    ip: Nullable<string>
    freeSpace: Nullable<string>
    lastBaseDataDownloadSyncDate: Nullable<string>
    lastCampaignDownloadSyncDate: Nullable<string>
    lastGuestUploadSyncDate: Nullable<string>
    lastCampaignUploadSyncDate: Nullable<string>
    lastFormsUploadSyncDate: Nullable<string>
    logs: Nullable<DeviceLog[]>
    errors: Nullable<DeviceError[]>
    notifications: Nullable<DeviceNotification[]> 

    get systemStr(): string {
        return `${this.operativeSystem}/${this.operativeSystemVersion}`;
    }

    get brandAndModel(): string {
        return `${this.brand}/${this.model}`;
    }

    get freeSpaceStr(): string {
        try {
            if (this.freeSpace) {
                const freeSpaceNum = parseFloat(this.freeSpace);
                if (!isNaN(freeSpaceNum))
                    return (freeSpaceNum).toFixed(4).toString() + ' GB';
            }
        } catch (error) {
            return '-';
        }
        return '-';
    }
}