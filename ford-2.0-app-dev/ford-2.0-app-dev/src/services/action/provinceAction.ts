import { Province } from "../../model/Province";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";
import { decodeProvinceResponse } from "../types/decodeProvince";

export const GetProvinces = (lastSync?: Date | null): ServiceCallAction<Province[]> => ({
  type: "SERVICE_CALL",
  method: "GET",
  //endpoint: `sync/provinces?lastSync=${lastSync ? lastSync.toISOString() : ''}`,
  endpoint: `sync/provinces?lastSync=`,
  serviceKey: "provinces",
  parseResponse: decodeProvinceResponse,
});
