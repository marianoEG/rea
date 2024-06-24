import { Nullable } from "src/app/utils/constants";
import { Feature } from "./Feature.model";

export class FeatureGroup {
    id: Nullable<number>
    name: Nullable<string>
    vehicleId: Nullable<number>
    features: Nullable<Feature[]>
    order: Nullable<number>;
}