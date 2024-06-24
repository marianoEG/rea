
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useDbContext } from "../context/DbContext";
import { Dealership } from "../model/Dealership";
import { Locality } from '../model/Locality';
import { Province } from "../model/Province";
import { Vehicle } from "../model/Vehicle";
import { VehicleVersion } from "../model/VehicleVersion";
import { Screens } from "../navigation/Screens";
import { ActionSheetIdEnum } from "../utils/constants";
import { getVehicles, getProvinces, getDealerships } from '../utils/db';
import { RootStackParams } from "../utils/rootNavigation";

interface Filters {
    vehicles: Vehicle[];
    provinces: Province[];
}

export const useDealerShips = () => {
    // Filters
    const [isGettingFilters, setIsGettingFilters] = useState<boolean>(true);
    const [filters, setFilters] = useState<Filters>({ vehicles: [], provinces: [] });
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);
    const [selectedVehicleVersion, setSelectedVehicleVersion] = useState<VehicleVersion | undefined>(undefined);
    const [selectedProvince, setSelectedProvince] = useState<Province | undefined>(undefined);
    const [selectedLocality, setSelectedLocality] = useState<Locality | undefined>(undefined);
    // Dealerships
    const [isGettingDealerships, setIsGettingDealerships] = useState<boolean>(false);
    const [dealerships, setDealerships] = useState<Dealership[] | undefined>(undefined);
    // Error Message
    const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
    // Hooks
    const { db } = useDbContext();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();
    const route = useRoute<RouteProp<RootStackParams, Screens.DealerShips>>();

    useEffect(() => {
        const getDataFromDB = async (vehicleId?: number) => {
            setIsGettingFilters(true);
            let vehicles = await getVehicles(db!);
            const filteredVehicles = vehicles
                .map(vehicle => ({
                    ...vehicle,
                    versions: vehicle.versions?.filter(version => version.preLaunch != true) ?? []
                }))
                .filter(vehicle => vehicle.versions?.length > 0)
                .sort((a: Vehicle, b: Vehicle) => {
                    if ((a.name ?? '') > (b.name ?? '')) return 1;
                    if ((a.name ?? '') < (b.name ?? '')) return -1;
                    return 0;
                });

            const provinces = await getProvinces(db!);

            setFilters({ vehicles: filteredVehicles, provinces: provinces });
            const vehicle = filteredVehicles.find(v => v.id == vehicleId)
            setSelectedVehicle(vehicle);
            setIsGettingFilters(false);
            getdealershipsAsync();
        }
        getDataFromDB(route?.params?.vehicleId);
    }, [route.params]);

    useEffect(() => {
        if (selectedProvince && selectedLocality) {
            getdealershipsAsync();
        }
        else setDealerships([]);
    }, [selectedProvince, selectedLocality]);

    const getdealershipsAsync = async () => {
        setIsGettingDealerships(true);
        const dealerships = await getDealerships(db!, selectedProvince?.id, selectedLocality?.id);
        console.log("Dealerships From database count:", dealerships?.length);
        setDealerships(dealerships);
        setIsGettingDealerships(false);
    }

    const onSelectFilterItem = (sheetId: ActionSheetIdEnum, selectedItemId: number) => {
        console.log("onSelectFilterItem:", selectedItemId);
        switch (sheetId) {
            case ActionSheetIdEnum.DEALERSHIPS_VEHICLES:
                const vehicle = filters.vehicles.find(v => v.id == selectedItemId);
                setSelectedVehicle(vehicle);
                if (vehicle?.versions && vehicle?.versions.length == 1)
                    setSelectedVehicleVersion(vehicle?.versions[0]);
                else
                    setSelectedVehicleVersion(undefined);
                break;
            case ActionSheetIdEnum.DEALERSHIPS_VEHICLE_VERSIONS:
                setSelectedVehicleVersion(selectedVehicle?.versions?.find(v => v.id == selectedItemId));
                break;
            case ActionSheetIdEnum.DEALERSHIPS_PROVINCES:
                const province = filters.provinces.find(v => v.id == selectedItemId);
                setSelectedProvince(province);
                if (province?.localities && province.localities.length == 1)
                    setSelectedLocality(province.localities[0]);
                else
                    setSelectedLocality(undefined);
                break;
            case ActionSheetIdEnum.DEALERSHIPS_LOCALITYS:
                setSelectedLocality(selectedProvince?.localities?.find(v => v.id == selectedItemId));
                break;
        }
    }

    const onSelectDealership = (dealership: Dealership) => {
        if (!selectedVehicle)
            setSnackBarMessage('Seleccione un vehículo para continuar');
        else if (!selectedVehicleVersion)
            setSnackBarMessage('Seleccione una versión de vehículo para continuar');
        else
            navigation.navigate(Screens.DelaerShipQuoteForm, { vehicle: selectedVehicle, vehicleVersion: selectedVehicleVersion, dealership: dealership })
    }

    const clearVehicle = () => {
        setSelectedVehicle(undefined);
        clearVehicleVersion();
    }

    const clearVehicleVersion = () => {
        setSelectedVehicleVersion(undefined);
    }

    const clearProvince = () => {
        setSelectedProvince(undefined);
        clearLocality();
    }

    const clearLocality = () => {
        setSelectedLocality(undefined);
    }

    return {
        isGettingFilters,
        isGettingDealerships,
        filters,
        dealerships,
        onSelectDealership,
        //
        selectedVehicle,
        selectedVehicleVersion,
        selectedProvince,
        selectedLocality,
        clearVehicle,
        clearVehicleVersion,
        clearProvince,
        clearLocality,
        //
        snackBarMessage,
        setSnackBarMessage,
        //
        onSelectFilterItem
    };
};