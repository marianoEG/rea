import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { ExtendedGuest } from '../../model/Guest';
import { GuestTypeEnum, TNullableBool, TNullableNumber, TNullableString } from "../../utils/constants";
import { getGuestStatusFromServer, getSafeOrUndefined } from "../../utils/utils";

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
  state: TNullableString,
  eventId: TNullableNumber,
  subeventId: TNullableNumber,
  changedByQrscanner: TNullableBool
});

const GuestResponseCodec = t.union([t.null, t.undefined, t.array(GuestCodec)]);

const toGuests = (parsed: t.TypeOf<typeof GuestResponseCodec>): ExtendedGuest[] => {
  let guests: ExtendedGuest[] = [];
  parsed?.map((guest) => {
    guests.push({
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
      eventId: getSafeOrUndefined(guest.eventId),
      subEventId: getSafeOrUndefined(guest.subeventId),
      changedByQrscanner: getSafeOrUndefined(guest.changedByQrscanner)
    });
  });
  return guests;
};

export const decodeSyncGuest = (json: unknown) => {
  return either.map(GuestResponseCodec.decode(json), toGuests);
};