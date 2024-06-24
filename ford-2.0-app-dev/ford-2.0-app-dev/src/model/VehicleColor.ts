import { BaseData } from "./BaseData";

export interface VehicleColor extends BaseData {
    colorName?: string;
    colorImageUrl?: string;
    vehicleImageUrl?: string;
}