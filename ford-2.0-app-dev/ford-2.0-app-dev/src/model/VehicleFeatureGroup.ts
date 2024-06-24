import { BaseData } from "./BaseData";
import { VehicleFeature } from "./VehicleFeature";

export interface VehicleFeatureGroup extends BaseData {
    name?: string;
    order?: number;
    features?: VehicleFeature[];
}