import { ExtendedGuest, Guest } from "../../model/Guest";
import { ServiceCallAction } from "../../store/middleware/serviceCallMiddleware";
import { decodeSyncGuest } from "../types/decodeSyncGuest";

export const SyncGuestAction = (guests: ExtendedGuest[], deviceName: string): ServiceCallAction<ExtendedGuest[]> => ({
  type: "SERVICE_CALL",
  method: "POST",
  endpoint: `sync/guests`,
  serviceKey: "saveGuests",
  body: {
    type: "json",
    value: {
      guests: JSON.parse(JSON.stringify(guests?.map(guest => ({
        id: guest.serverId,
        eventId: guest.eventId,
        subeventId: guest.subEventId,
        firstname: guest.firstname,
        lastname: guest.lastname,
        documentType: guest.documentType,
        documentNumber: guest.documentNumber,
        phoneNumber: guest.phoneNumber,
        email: guest.email,
        carLicencePlate: guest.carLicencePlate,
        type: guest.type,
        companionReference: guest.companionReference,
        observations1: guest.observations1,
        observations2: guest.observations2,
        observations3: guest.observations3,
        zone: guest.zone,
        state: guest.status,
        createdOn: guest.createdOn,
        modifiedOn: guest.modifiedOn,
        changedByQrscanner: guest.changedByQrscanner
      })))),
      deviceName: deviceName
    },
  },
  parseResponse: decodeSyncGuest,
});