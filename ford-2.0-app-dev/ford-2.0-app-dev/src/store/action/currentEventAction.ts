import { EventAction } from "../reducer/currentEventReducer";

export const selectEvent = (event: Event): EventAction => ({
  type: "select-event",
  payload: { event },
});

export const unselectEvent = (): EventAction => ({
  type: "select-event",
  payload: { event: undefined },
});
