import { Nullable } from "../../utils/constants";

export class CampaignSearch {
    id: Nullable<number>
    eventId: Nullable<number>
    eventName: Nullable<string>
    searchText: Nullable<number>
    searchDate: Nullable<string>;
    campaignId: Nullable<number>
    vin: Nullable<string>;
    cc: Nullable<string>;
    pat: Nullable<string>;
    serv: Nullable<string>;
    servDate: Nullable<string>;
    manten: Nullable<number>
    syncDate: Nullable<string>;
}