import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { Vehicle } from "../../model/Vehicle";
import { TNullableBool, TNullableNumber, TNullableString, VehicleTypeEnum } from "../../utils/constants";
import { getSafeOrUndefined } from "../../utils/utils";

const VehicleFeatureCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  order: TNullableNumber,
  featureGroupId: TNullableNumber,
});

const VehicleFeatureGroupCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  order: TNullableNumber,
  features: t.union([t.null, t.undefined, t.array(VehicleFeatureCodec)]),
  deleted: TNullableBool,
});

const VehicleFeatureVersionCodec = t.type({
  featureId: TNullableNumber,
  value: TNullableString,
  deleted: TNullableBool,
});

const VehicleVersionCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  price: TNullableNumber,
  modelYear: TNullableString,
  tma: TNullableString,
  seq: TNullableString,
  preLaunch: TNullableBool,
  features: t.union([t.null, t.undefined, t.array(VehicleFeatureVersionCodec)]),
  deleted: TNullableBool,
});

const VehicleColorCodec = t.type({
  id: TNullableNumber,
  colorName: TNullableString,
  colorImageUrl: TNullableString,
  vehicleImageUrl: TNullableString,
  deleted: TNullableBool,
});

const VehicleImageCodec = t.type({
  id: TNullableNumber,
  vehicleImageUrl: TNullableString,
  deleted: TNullableBool,
});

const VehicleAccessoryCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  image: TNullableString,
  description: TNullableString,
  observation: TNullableString,
  partNumber: TNullableString,
  modelFor: TNullableString,
  deleted: TNullableBool,
});

const VehicleCodec = t.type({
  id: TNullableNumber,
  name: TNullableString,
  type: TNullableString,
  image: TNullableString,
  deleted: TNullableBool,
  versions: t.union([t.null, t.undefined, t.array(VehicleVersionCodec)]),
  colors: t.union([t.null, t.undefined, t.array(VehicleColorCodec)]),
  images: t.union([t.null, t.undefined, t.array(VehicleImageCodec)]),
  featuresGroups: t.union([t.null, t.undefined, t.array(VehicleFeatureGroupCodec)]),
  accessories: t.union([t.null, t.undefined, t.array(VehicleAccessoryCodec)])
});

const VehicleResponseCodec = t.union([t.null, t.undefined, t.array(VehicleCodec)]);

const toVehicles = (parsed: t.TypeOf<typeof VehicleResponseCodec>): Vehicle[] => {
  let vehicles: Vehicle[] = [];
  parsed?.map((vehicle) => {
    vehicles.push({
      id: getSafeOrUndefined(vehicle.id),
      name: getSafeOrUndefined(vehicle.name),
      type: getSafeOrUndefined(vehicle.type) as VehicleTypeEnum,
      image: getSafeOrUndefined(vehicle.image),
      versions: vehicle.versions
        ?
        vehicle.versions.map(version => ({
          id: getSafeOrUndefined(version.id),
          name: getSafeOrUndefined(version.name),
          price: getSafeOrUndefined(version.price),
          modelYear: getSafeOrUndefined(version.modelYear),
          tma: getSafeOrUndefined(version.tma),
          seq: getSafeOrUndefined(version.seq),
          preLaunch: getSafeOrUndefined(version.preLaunch),
          features: version.features
            ?
            version.features.map(feature => ({
              featureId: getSafeOrUndefined(feature.featureId),
              value: getSafeOrUndefined(feature.value)
            }))
            :
            [],
          deleted: getSafeOrUndefined(version.deleted)
        }))
        :
        [],
      colors: vehicle.colors
        ?
        vehicle.colors.map(color => ({
          id: getSafeOrUndefined(color.id),
          colorName: getSafeOrUndefined(color.colorName),
          colorImageUrl: getSafeOrUndefined(color.colorImageUrl),
          vehicleImageUrl: getSafeOrUndefined(color.vehicleImageUrl),
          deleted: getSafeOrUndefined(color.deleted)
        }))
        :
        [],
      images: vehicle.images
        ?
        vehicle.images.map(image => ({
          id: getSafeOrUndefined(image.id),
          vehicleImageUrl: getSafeOrUndefined(image.vehicleImageUrl),
          deleted: getSafeOrUndefined(image.deleted)
        }))
        :
        [],
      featuresGroups: vehicle.featuresGroups
        ?
        vehicle.featuresGroups.map(featureGroup => ({
          id: getSafeOrUndefined(featureGroup.id),
          name: getSafeOrUndefined(featureGroup.name),
          order: getSafeOrUndefined(featureGroup.order) ?? 0,
          features: featureGroup.features
            ?
            featureGroup.features.map(feature => ({
              id: getSafeOrUndefined(feature.id),
              name: getSafeOrUndefined(feature.name),
              order: getSafeOrUndefined(feature.order) ?? 0,
            }))
            :
            [],
          deleted: getSafeOrUndefined(featureGroup.deleted)
        }))
        :
        [],
      accessories: vehicle.accessories
        ?
        vehicle.accessories.map(accessory => ({
          id: getSafeOrUndefined(accessory.id),
          name: getSafeOrUndefined(accessory.name),
          image: getSafeOrUndefined(accessory.image),
          description: getSafeOrUndefined(accessory.description),
          observation: getSafeOrUndefined(accessory.observation),
          partNumber: getSafeOrUndefined(accessory.partNumber),
          modelFor: getSafeOrUndefined(accessory.modelFor),
          deleted: getSafeOrUndefined(accessory.deleted),
        }))
        :
        [],
      deleted: getSafeOrUndefined(vehicle.deleted)
    });
  });
  return vehicles
};

export const decodeVehicleResponse = (json: unknown) => {
  return either.map(VehicleResponseCodec.decode(json), toVehicles);
};