import { GuestDecode } from "../../model/GuestDecode";
import { GuestInfoAction, GuestState } from "../reducer/guestReducer";

export const saveInfoCurrentGuest = (guest: GuestDecode): GuestInfoAction => ({
    type: "guest-info-success",
    payload: { guest }
});

export const cleanInfoCurrentGuest = (): GuestInfoAction => ({
  type: "clean-info"
});
