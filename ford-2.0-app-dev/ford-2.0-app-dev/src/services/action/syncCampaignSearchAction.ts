import { CampaignSearch } from "../../model/CampaignSearch";
import { ExtendedGuest, Guest } from "../../model/Guest";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";
import { decodeSyncGuest } from "../types/decodeSyncGuest";

export const SyncCampaignSearchAction = (campaignSearches: CampaignSearch[], deviceName: string): ServiceCallAction<void> => ({
  type: "SERVICE_CALL",
  method: "POST",
  endpoint: `sync/campaignSearches`,
  serviceKey: "saveCampaignSearches",
  body: {
    type: "json",
    value: {
      searches: JSON.parse(JSON.stringify(campaignSearches)),
      deviceName: deviceName
    },
  }
});