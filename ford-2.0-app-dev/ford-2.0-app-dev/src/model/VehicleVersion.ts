import { BaseData } from "./BaseData";
import { VehicleFeatureVersion } from "./VehicleFeatureVersion";

export interface VehicleVersion extends BaseData {
    name?: string;
    price?: number;
    modelYear?: string;
    tma?: string;
    seq?: string;
    preLaunch?: boolean;
    features?: VehicleFeatureVersion[];
}