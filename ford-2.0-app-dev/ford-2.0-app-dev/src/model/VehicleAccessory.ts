import { BaseData } from "./BaseData";

export interface VehicleAccessory extends BaseData {
    name?: string;
    image?: string;
    description?: string;
    observation?: string;
    partNumber?: string;
    modelFor?: string;
}