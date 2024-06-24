import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";
import { decodeCampaignResponse } from "../types/decodeCampaigns";

export const GetCampaigns = (): ServiceCallAction<string[]> => ({
  type: "SERVICE_CALL",
  method: "GET",
  endpoint: `sync/campaigns`,
  serviceKey: "campaigns",
  parseResponse: decodeCampaignResponse,
});