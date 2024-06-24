import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { Event } from "../../model/Event";
import { ISOToDate, getGuestStatusFromServer } from "../../utils/utils";
import { GuestStatusEnum, GuestTypeEnum, TNullableBool, TNullableNumber, TNullableString } from "../../utils/constants";
import { getSafeOrUndefined } from "../../utils/utils";
import { Guest } from "../../model/Guest";

const GuestCodec = t.type({
  id: TNullableNumber,
  firstname: TNullableString,
  lastname: TNullableString,
  documentNumber: TNullableString,
  phoneNumber: TNullableString,
  email: TNullableString,
  carLicencePlate: TNullableString,
  type: TNullableString,
  companionReference: TNullableString,
  observations1: TNullableString,
  observations2: TNullableString,
  observations3: TNullableString,
  zone: TNullableString,
  state: TNullableString
});

const SubEventCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  dateFrom: TNullableString,
  dateTo: TNullableString,
  guestNumber: TNullableNumber,
  image: TNullableString,
  guests: t.union([t.null, t.undefined, t.array(GuestCodec)]),
  deleted: TNullableBool
});

const EventCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  code: TNullableString,
  dateFrom: TNullableString,
  dateTo: TNullableString,
  image: TNullableString,
  testDriveDemarcationOwnerEnabled: TNullableBool,
  testDriveDemarcationOwnerInCaravanEnabled: TNullableBool,
  testDriveDemarcationFordEnabled: TNullableBool,
  subEvents: t.union([t.null, t.undefined, t.array(SubEventCodec)]),
  deleted: TNullableBool
});

const EventResponseCodec = t.union([t.null, t.undefined, t.array(EventCodec)]);

const toEvents = (parsed: t.TypeOf<typeof EventResponseCodec>): Event[] => {
  let events: Event[] = [];
  parsed?.map((event) => {
    events.push({
      id: getSafeOrUndefined(event.id),
      name: getSafeOrUndefined(event.name),
      code: getSafeOrUndefined(event.code),
      dateFrom: ISOToDate(event.dateFrom),
      dateTo: ISOToDate(event.dateTo),
      image: getSafeOrUndefined(event.image),
      testDriveDemarcationOwnerEnabled: getSafeOrUndefined(event.testDriveDemarcationOwnerEnabled),
      testDriveDemarcationOwnerInCaravanEnabled: getSafeOrUndefined(event.testDriveDemarcationOwnerInCaravanEnabled),
      testDriveDemarcationFordEnabled: getSafeOrUndefined(event.testDriveDemarcationFordEnabled),
      subEvents: event.subEvents
        ?
        event.subEvents.map((subEvent) => ({
          id: getSafeOrUndefined(subEvent.id),
          name: getSafeOrUndefined(subEvent.name),
          dateFrom: ISOToDate(subEvent.dateFrom),
          dateTo: ISOToDate(subEvent.dateTo),
          guestNumber: getSafeOrUndefined(subEvent.guestNumber),
          image: getSafeOrUndefined(subEvent.image),
          guests: subEvent.guests
            ?
            subEvent.guests.map<Guest>((guest) => ({
              serverId: getSafeOrUndefined(guest.id),
              firstname: getSafeOrUndefined(guest.firstname),
              lastname: getSafeOrUndefined(guest.lastname),
              documentNumber: getSafeOrUndefined(guest.documentNumber),
              phoneNumber: getSafeOrUndefined(guest.phoneNumber),
              email: getSafeOrUndefined(guest.email),
              carLicencePlate: getSafeOrUndefined(guest.carLicencePlate),
              type: getSafeOrUndefined(guest.type) as GuestTypeEnum,
              companionReference: getSafeOrUndefined(guest.companionReference),
              observations1: getSafeOrUndefined(guest.observations1),
              observations2: getSafeOrUndefined(guest.observations2),
              observations3: getSafeOrUndefined(guest.observations3),
              zone: getSafeOrUndefined(guest.zone),
              status: getGuestStatusFromServer(getSafeOrUndefined(guest.state)),
              isSynchronized: true, // los invitados que llegan desde el server ya se encuentran sincronizados
            }))
            :
            []
        }))
        :
        []
    });
  });
  return events
};

export const decodeEventResponse = (json: unknown) => {
  return either.map(EventResponseCodec.decode(json), toEvents);
};