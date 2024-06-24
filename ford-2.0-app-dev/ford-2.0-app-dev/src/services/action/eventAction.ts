import { Event } from "../../model/Event";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";
import { decodeEventResponse } from "../types/decodeEvent";

export const GetEvents = (lastSync?: Date | null): ServiceCallAction<Event[]> => ({
  type: "SERVICE_CALL",
  method: "GET",
  //endpoint: `sync/events?lastSync=${lastSync ? lastSync.toISOString() : ''}`,
  endpoint: `sync/events?lastSync=`,
  serviceKey: "events",
  parseResponse: decodeEventResponse,
});
