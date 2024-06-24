import { BaseData } from "./BaseData";
import { SubEvent } from "./SubEvent";

export interface Event extends BaseData {
    name?: string;
    code?: string;
    dateFrom?: Date;
    dateTo?: Date;
    image?: string;
    subEvents?: SubEvent[];
    testDriveDemarcationOwnerEnabled?: boolean;
    testDriveDemarcationOwnerInCaravanEnabled?: boolean;
    testDriveDemarcationFordEnabled?: boolean;
}