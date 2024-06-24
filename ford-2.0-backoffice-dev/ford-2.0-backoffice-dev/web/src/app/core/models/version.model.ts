import { Nullable } from "src/app/utils/constants";
import { FeatureVersion } from "./feature-version.model";

export class Version {
    id: Nullable<number>
    name: Nullable<string>
    price: Nullable<number>
    vehicleId: Nullable<number>
    currency: Nullable<string>
    tma: Nullable<string>
    seq: Nullable<string>
    modelYear: Nullable<string>
    preLaunch: Nullable<boolean>
    enabled: Nullable<boolean>
    featureVersions: Nullable<FeatureVersion[]>

    /* Front Stuffs */
    isSelected: boolean;
    newPrice: Nullable<number>;
    newCurrency: Nullable<string>;
    isChangingPrice: Nullable<boolean>;
}