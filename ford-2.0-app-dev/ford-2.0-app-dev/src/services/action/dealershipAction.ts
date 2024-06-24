import { Dealership } from "../../model/Dealership";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";
import { decodeDealershipResponse } from "../types/decodeDealership";

export const GetDealerships = (lastSync?: Date | null): ServiceCallAction<Dealership[]> => ({
  type: "SERVICE_CALL",
  method: "GET",
  //endpoint: `sync/dealerships?lastSync=${lastSync ? lastSync.toISOString() : ''}`,
  endpoint: `sync/dealerships?lastSync=`,
  serviceKey: "dealerships",
  parseResponse: decodeDealershipResponse,
});
