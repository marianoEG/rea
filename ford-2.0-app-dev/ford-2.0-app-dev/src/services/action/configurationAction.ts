import { Configuration } from "../../model/Configuration";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";
import { decodeConfigurationResponse } from "../types/decodeConfiguration";

export const GetConfiguration = (): ServiceCallAction<Configuration> => ({
  type: "SERVICE_CALL",
  method: "GET",
  endpoint: `sync/configurations`,
  serviceKey: "configurations",
  parseResponse: decodeConfigurationResponse,
});