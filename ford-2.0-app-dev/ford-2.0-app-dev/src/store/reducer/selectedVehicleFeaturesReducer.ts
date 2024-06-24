import { VehicleColor } from './../../model/VehicleColor';
import { VehicleVersion } from "../../model/VehicleVersion";
import { VehicleImage } from '../../model/VehicleImage';

interface SelectedVehicleFeaturesState {
  vehicleVersion?: VehicleVersion,
  vehicleColor?: VehicleColor,
  vehicleImage?: VehicleImage
}

const defaultState: SelectedVehicleFeaturesState = {
  vehicleVersion: undefined,
  vehicleColor: undefined,
  vehicleImage: undefined
}

export type SelectedVehicleFeaturesAction =
  | { type: "select-vehicle-version", payload?: VehicleVersion }
  | { type: "select-vehicle-color", payload?: VehicleColor }
  | { type: "select-vehicle-image", payload?: VehicleImage }
  | { type: "clean-vehicle-features" };

export function selectedVehicleFeaturesReducer(state: SelectedVehicleFeaturesState | undefined = defaultState, action: SelectedVehicleFeaturesAction): SelectedVehicleFeaturesState {
  switch (action.type) {
    case "select-vehicle-version":
      return {
        ...state,
        vehicleVersion: action.payload
      };
    case "select-vehicle-color":
      return {
        ...state,
        vehicleImage: undefined,
        vehicleColor: action.payload
      };
    case "select-vehicle-image":
      return {
        ...state,
        vehicleColor: undefined,
        vehicleImage: action.payload
      };
    case "clean-vehicle-features":
      return {
        vehicleVersion: undefined,
        vehicleColor: undefined,
        vehicleImage: undefined
      };
    default:
      return state;
  }
}