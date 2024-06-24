import { Nullable } from "../../utils/constants";

export class Event {
    id: Nullable<number>;
    name: Nullable<string>;
    code: Nullable<string>;
    dateFrom: Nullable<string>;
    dateTo: Nullable<string>;
    enable: Nullable<boolean>;
    image: Nullable<string>;
    testDriveDemarcationOwnerEnabled: Nullable<boolean>;
    testDriveDemarcationOwnerInCaravanEnabled: Nullable<boolean>;
    testDriveDemarcationFordEnabled: Nullable<boolean>;
    testDriveFormsCount: Nullable<number>;
    testDriveFormsQrcount: Nullable<number>;

    getDateFromToLocalTime()
    {
        if (!this.dateFrom)
            return null;
        const fechaUtc = new Date(this.dateFrom);
        const offsetMinutos = fechaUtc.getTimezoneOffset();
        fechaUtc.setMinutes(fechaUtc.getMinutes() - offsetMinutos);
        return fechaUtc;
    }

    getDateToToLocalTime()
    {
        if (!this.dateTo)
            return null;
        const fechaUtc = new Date(this.dateTo);
        const offsetMinutos = fechaUtc.getTimezoneOffset();
        fechaUtc.setMinutes(fechaUtc.getMinutes() - offsetMinutos);
        return fechaUtc;
    }
}