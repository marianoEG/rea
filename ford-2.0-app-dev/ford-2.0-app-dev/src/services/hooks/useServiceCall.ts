import { useDispatch } from "react-redux";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";

/**
 * Returns a reference to dispatch function to make a service call.
 */
export function useServiceCall() {
  const dispatch = useDispatch();

  return async function <T>(action: ServiceCallAction<T>) {
    return await dispatch(action);
  };
}
