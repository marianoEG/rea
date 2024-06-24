import { VehicleColor } from '../../model/VehicleColor';
import { VehicleImage } from '../../model/VehicleImage';
import { VehicleVersion } from '../../model/VehicleVersion';
import { SelectedVehicleFeaturesAction } from "../reducer/selectedVehicleFeaturesReducer";

export const selectVehicleVersion = (vehicleVersion?: VehicleVersion): SelectedVehicleFeaturesAction => ({
  type: "select-vehicle-version",
  payload: vehicleVersion,
});

export const selectVehicleColor = (vehicleColor?: VehicleColor): SelectedVehicleFeaturesAction => ({
  type: "select-vehicle-color",
  payload: vehicleColor,
});

export const selectVehicleImage = (vehicleImage?: VehicleImage): SelectedVehicleFeaturesAction => ({
  type: "select-vehicle-image",
  payload: vehicleImage,
});

export const cleanVehicleFeatures = (): SelectedVehicleFeaturesAction => ({
  type: "clean-vehicle-features"
});
