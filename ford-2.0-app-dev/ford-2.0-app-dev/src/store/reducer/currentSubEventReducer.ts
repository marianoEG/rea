import { SubEvent } from "../../model/SubEvent";

export interface SubEventState {
  subEvent?: SubEvent;
}

const defaultState: SubEventState = {
  subEvent: undefined
};

export type SubEventAction =
  | { type: "unselect-sub-event" }
  | { type: "select-sub-event", payload: SubEventState };

export function currentSubEventReducer(state: SubEventState | undefined = defaultState, action: SubEventAction): SubEventState {
  switch (action.type) {
    case "unselect-sub-event":
      return {
        subEvent: undefined
      };
    case "select-sub-event": {
      return {
        subEvent: action.payload.subEvent
      };
    }
    default:
      return state;
  }
}