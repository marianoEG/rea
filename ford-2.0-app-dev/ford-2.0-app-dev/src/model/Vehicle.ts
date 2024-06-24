import { VehicleTypeEnum } from "../utils/constants";
import { BaseData } from "./BaseData";
import { VehicleAccessory } from "./VehicleAccessory";
import { VehicleColor } from "./VehicleColor";
import { VehicleFeatureGroup } from "./VehicleFeatureGroup";
import { VehicleImage } from "./VehicleImage";
import { VehicleVersion } from "./VehicleVersion";

export interface ExtendedVehicle extends Vehicle {
    preLaunch?: boolean;
}

export interface Vehicle extends BaseData {
    name?: string;
    type?: VehicleTypeEnum;
    image?: string;
    versions?: VehicleVersion[];
    colors?: VehicleColor[];
    images?: VehicleImage[];
    featuresGroups?: VehicleFeatureGroup[];
    accessories?: VehicleAccessory[];
}