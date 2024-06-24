import { Nullable } from "src/app/utils/constants";

export class VehicleAccessory {
    id: Nullable<number>;
    vehicleId: Nullable<number>; 
    name: Nullable<string>; 
    image: Nullable<string>;
    description: Nullable<string>;
    observation: Nullable<string>;
    partNumber: Nullable<string>;
    modelFor: Nullable<string>;
}