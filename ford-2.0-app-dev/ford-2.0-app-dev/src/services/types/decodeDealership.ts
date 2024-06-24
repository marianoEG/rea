import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { Dealership } from "../../model/Dealership";
import { TNullableBool, TNullableNumber, TNullableString } from "../../utils/constants";
import { getSafeOrUndefined } from "../../utils/utils";

const DealershipCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  provinceId: TNullableNumber,
  cityId: TNullableNumber,
  provinceName: TNullableString,
  cityName: TNullableString,
  code: TNullableString,
  streetNameAndNumber: TNullableString,
  postalCode: TNullableString,
  phone1: TNullableString,
  phone2: TNullableString,
  dealerCode: TNullableString,
  lat: TNullableNumber,
  long: TNullableNumber,
  deleted: TNullableBool
});

const DealershipResponseCodec = t.union([t.null, t.undefined, t.array(DealershipCodec)]);

const toDealerships = (parsed: t.TypeOf<typeof DealershipResponseCodec>): Dealership[] => {
  let dealerships: Dealership[] = [];
  parsed?.map((dealership) => {
    dealerships.push({
      id: getSafeOrUndefined(dealership.id),
      name: getSafeOrUndefined(dealership.name),
      provinceId: getSafeOrUndefined(dealership.provinceId),
      localityId: getSafeOrUndefined(dealership.cityId),
      provinceName: getSafeOrUndefined(dealership.provinceName),
      localityName: getSafeOrUndefined(dealership.cityName),
      code: getSafeOrUndefined(dealership.code),
      streetNameAndNumber: getSafeOrUndefined(dealership.streetNameAndNumber),
      postalCode: getSafeOrUndefined(dealership.postalCode),
      phone1: getSafeOrUndefined(dealership.phone1),
      phone2: getSafeOrUndefined(dealership.phone2),
      dealerCode: getSafeOrUndefined(dealership.dealerCode),
      latitude: getSafeOrUndefined(dealership.lat),
      longitude: getSafeOrUndefined(dealership.long)
    });
  });
  return dealerships
};

export const decodeDealershipResponse = (json: unknown) => {
  return either.map(DealershipResponseCodec.decode(json), toDealerships);
};