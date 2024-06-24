import { GuestDecode } from "../../model/GuestDecode";

export interface GuestState {
  guest?: GuestDecode;
}

const defaultState: GuestState = {
  guest: undefined
};

export type GuestInfoAction =
| { type: "clean-info" }
| { type: "guest-info-success", payload: GuestState };

export function GuestInfoSuccessReducer(state: GuestState | undefined = defaultState, action: GuestInfoAction): GuestState {
  switch (action.type) {
    case "clean-info":
      return {
        guest: undefined
      };
    case "guest-info-success":
      return {
        guest: action.payload.guest
      };
    default:
      return state;
  }
}
