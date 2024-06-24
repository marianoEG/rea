import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { Province } from "../../model/Province";
import { TNullableBool, TNullableNumber, TNullableString } from "../../utils/constants";
import { getSafeOrUndefined } from "../../utils/utils";

const LocalityCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  deleted: TNullableBool
});

const ProvinceCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  cities: t.union([t.null, t.undefined, t.array(LocalityCodec)]),
  deleted: TNullableBool
});

const ProvinceResponseCodec = t.union([t.null, t.undefined, t.array(ProvinceCodec)]);

const toProvinces = (parsed: t.TypeOf<typeof ProvinceResponseCodec>): Province[] => {
  let provinces: Province[] = [];
  parsed?.map((province) => {
    provinces.push({
      id: getSafeOrUndefined(province.id),
      name: getSafeOrUndefined(province.name),
      localities: province.cities
        ?
        province.cities.map(city => {
          return {
            id: getSafeOrUndefined(city.id),
            name: getSafeOrUndefined(city.name),
            deleted: getSafeOrUndefined(city.deleted)
          }
        })
        :
        []
    });
  });
  return provinces
};

export const decodeProvinceResponse = (json: unknown) => {
  return either.map(ProvinceResponseCodec.decode(json), toProvinces);
};