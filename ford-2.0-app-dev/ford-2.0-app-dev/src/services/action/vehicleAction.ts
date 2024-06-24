import { Vehicle } from "../../model/Vehicle";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";
import { decodeVehicleResponse } from "../types/decodeVehicle";

export const GetVehicles = (lastSync?: Date | null): ServiceCallAction<Vehicle[]> => ({
  type: "SERVICE_CALL",
  method: "GET",
  //endpoint: `sync/vehicles?lastSync=${lastSync ? lastSync.toISOString() : ''}`,
  endpoint: `sync/vehicles?lastSync=`,
  serviceKey: "vehicles",
  parseResponse: decodeVehicleResponse,
});
