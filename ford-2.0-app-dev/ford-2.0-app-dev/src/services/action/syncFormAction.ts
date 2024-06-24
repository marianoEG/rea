import { SyncformBody } from "../../model/SyncFormBody";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";

export const SyncFormAction = (syncFormBody: SyncformBody[]): ServiceCallAction<void> => ({
  type: "SERVICE_CALL",
  method: "POST",
  endpoint: `sync/forms`,
  serviceKey: "saveForms",
  body: {
    type: "json",
    value: JSON.parse(JSON.stringify(syncFormBody)),
  }
});