import { Event } from "../../model/Event";

export interface EventState {
  event?: Event;
}

const defaultState: EventState = {
  event: undefined
};

export type EventAction =
  | { type: "unselect-event" }
  | { type: "select-event", payload: EventState };

export function currentEventReducer(state: EventState | undefined = defaultState, action: EventAction): EventState {
  switch (action.type) {
    case "unselect-event":
      return {
        event: undefined
      };
    case "select-event": {
      return {
        event: action.payload.event
      };
    }
    default:
      return state;
  }
}
