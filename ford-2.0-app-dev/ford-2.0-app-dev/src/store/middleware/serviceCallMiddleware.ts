import { Action, AnyAction, Dispatch, MiddlewareAPI } from "redux";
import * as t from "io-ts";
import { Either, isRight, left, right } from "fp-ts/lib/Either";
import { StoreContent } from "../store";
import { Error } from "../../model/Error";
import { getDeviceInfoForRequests } from "../../utils/utils";
import { APP_ID } from "../../utils/constants";

type HTTPMethod = "GET" | "POST" | "PUT";
type JSONValue =
  | string
  | [string]
  | number
  | boolean
  | null
  | undefined
  | JSONObject
  | [JSONValue];
type JSONObject = { [key: string]: JSONValue } | null;
export const ServerErrorCode = 500;

export interface ServiceCallAction<T> extends Action {
  method: HTTPMethod;
  endpoint: string;
  body?:
  | { type: "json"; value: JSONObject }
  | { type: "multipart"; value: FormData };

  useBaseUrl?: boolean;
  serviceKey: string;
  onStart?: () => Action;
  parseResponse?: (bodyJson: JSONValue) => Either<t.Errors, T>
  onSuccess?: (result: T) => Action;
  onFailure?: (error: ServiceCallError) => Action;
}

export type ServiceCallError =
  | { type: "FETCH_ERROR"; error: any }
  | { type: "PARSE_ERROR"; errorCode: number; errorCodeMessage: string; errorMessage: string }
  | { type: "SERVER_ERROR"; errorCode: number; errorCodeMessage: string; errorMessage: string };

async function performServiceCall<E, T>(
  apiHost: string,
  action: ServiceCallAction<T>
): Promise<
  Either<
    ServiceCallError,
    {
      parsed: T;
    }
  >
> {
  try {
    if (action.useBaseUrl == undefined || action.useBaseUrl == null)
      action.useBaseUrl = true;

    const request = {
      method: action.method,
      body:
        action.body != null
          ? action.body.type === "multipart"
            ? action.body.value
            : JSON.stringify(action.body.value)
          : undefined,
      headers: {
        ...(
          action.body && action.body.type === "multipart"
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }
        ),
        'device-info': JSON.stringify(await getDeviceInfoForRequests()),
        'app-id': APP_ID
      },
    };

    console.log(`Fetching ${apiHost}/${action.endpoint} headers:`, JSON.stringify(request.headers));
    const response = await fetch(`${apiHost}/${action.endpoint}`, request);
    console.log(`Fetching Response: ${apiHost}/${action.endpoint}`, JSON.stringify(response));

    if (response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (!contentType || contentType.indexOf('application/json') == -1) {
          return right({ parsed: {} as any });
        }
        const data = await response.json();
        const parsed = action?.parseResponse(data);
        console.log(`Fetching ${apiHost}/${action.endpoint} Response:`, JSON.stringify(parsed));
        if (!isRight(parsed)) {
          return left({
            type: "PARSE_ERROR",
            errorCode: response.status,
            errorCodeMessage: '',
            errorMessage: '',
          });
        }
        return right({
          parsed: parsed.right,
        });
      } catch (error) {
        return left({
          type: "PARSE_ERROR",
          errorCode: response.status,
          errorCodeMessage: '',
          errorMessage: '',
        });
      }
    } else {
      try {
        const data = await response.json() as Error;
        console.log(`Response from ${apiHost}/${action.endpoint}:`, JSON.stringify(data));
        return left({
          type: "SERVER_ERROR",
          errorCode: response.status,
          errorCodeMessage: data.Code ?? '',
          errorMessage: data.Message ?? '',
        });
      } catch (error) {
        return left({
          type: "PARSE_ERROR",
          errorCode: response.status,
          errorCodeMessage: '',
          errorMessage: '',
        });
      }
    }
  } catch (error) {
    console.log("error", error)
    return left({
      type: "FETCH_ERROR",
      error,
    });
  }
}

export const serviceCallMiddleware =
  (store: MiddlewareAPI<Dispatch, StoreContent>) =>
    (next: Dispatch<AnyAction>) =>
      async <T>(action: ServiceCallAction<T>) => {
        if (action.type !== "SERVICE_CALL") {
          return next(action as any);
        }

        if (action.onStart) {
          store.dispatch(action.onStart());
        }
        store.dispatch({
          type: "SERVICE_CALL_START",
          serviceKey: action.serviceKey,
        });

        const apiHost = store.getState().transient.environment.apiHost;
        const result = await performServiceCall(apiHost, action);

        store.dispatch({
          type: "SERVICE_CALL_END",
          serviceKey: action.serviceKey,
        });

        if (isRight(result)) {
          if (action.onSuccess) {
            store.dispatch(action.onSuccess(result.right.parsed));
          }
          return right(result.right.parsed);
        } else {
          if (action.onFailure) {
            store.dispatch(action.onFailure(result.left));
          }
          return result;
        }
      };

// Overload to add type info to dispatch calls
declare module "redux" {
  export interface Dispatch<A extends Action> {
    <T>(action: ServiceCallAction<T>): Promise<Either<ServiceCallError, T>>;
  }
}
