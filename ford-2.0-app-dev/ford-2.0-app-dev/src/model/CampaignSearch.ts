import { Campaign } from "./Campaign";

export interface CampaignSearch {
    id?: number;
    eventId?: number;
    eventName?: string;
    searchText?: string;
    searchDate?: Date;
    campaign?: Campaign;
    isSynchronized?: boolean;
    syncDate?: Date;
}