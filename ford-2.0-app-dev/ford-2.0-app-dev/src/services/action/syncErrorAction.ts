import { ErrorDB } from "../../model/Error";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";

export const SyncErrorAction = (errors: ErrorDB[]): ServiceCallAction<void> => ({
  type: "SERVICE_CALL",
  method: "POST",
  endpoint: `sync/device-errors`,
  serviceKey: "saveDeviceErrors",
  body: {
    type: "json",
    value: JSON.parse(JSON.stringify(errors))
  },
  parseResponse: undefined
});