import { Nullable } from "src/app/utils/constants";
import { FeatureGroup } from "./feature-group.model";
import { VehicleColor } from "./vehicle-color.model";
import { VehicleImage } from "./vehicle-image.model";

export class Vehicle {
    id: Nullable<number>
    name: Nullable<string>
    type: Nullable<string>
    enabled: Nullable<boolean>
    image: Nullable<string>
    featuresGroups: Nullable<FeatureGroup[]>
    images: Nullable<VehicleImage[]>
    colors: Nullable<VehicleColor[]>
}