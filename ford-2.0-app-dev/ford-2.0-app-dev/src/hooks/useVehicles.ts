import { Screens } from './../navigation/Screens';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { DefaultRootState, useSelector } from "react-redux";
import { useDbContext } from "../context/DbContext";
import { ExtendedVehicle } from "../model/Vehicle";
import { VehicleTypeEnum } from "../utils/constants";
import { getVehicles } from "../utils/db";
import { RootStackParams } from "../utils/rootNavigation";
import { getVehicleTypeStr, groupBy } from "../utils/utils";

interface VehicleTypes {
    all: ExtendedVehicle[];
    suvs: ExtendedVehicle[];
    pickUps: ExtendedVehicle[];
    utilities: ExtendedVehicle[];
    cars: ExtendedVehicle[];
    fleetsAndSpecialSales: ExtendedVehicle[];
}

interface Sections {
    title: string;
    data: ExtendedVehicle[];
}

export const useVehicles = () => {
    const [isGettingVehicles, setIsGettingVehicles] = useState<boolean>(true);
    const [sections, setSections] = useState<Sections[]>([]);
    const { db } = useDbContext();
    const { isSynchronizingBaseData, isSyncBaseDataFinished } = useSelector((st: DefaultRootState) => st.transient.sync);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();

    const getVehiclesFromDB = async () => {
        let vehicles = await getVehicles(db!, true);
        const filteredVehicles = vehicles
            .map<ExtendedVehicle>(vehicle => ({
                ...vehicle,
                preLaunch: vehicle.versions
                    && vehicle.versions.filter(version => version?.preLaunch == true).length > 0
                    ? true
                    : false,
                versions: []
            }));

        console.log("Vehicle From Database: ", filteredVehicles.map(v => ({ id: v.id, name: v.name, image: v.image, preLaunch: v.preLaunch })))

        if (filteredVehicles && filteredVehicles.length > 0) {
            const grouped = groupBy(filteredVehicles, 'type');
            const vehicleTypes: VehicleTypes = {
                all: filteredVehicles ?? [],
                suvs: grouped[VehicleTypeEnum.SUVS] ?? [],
                pickUps: grouped[VehicleTypeEnum.PICK_UPS] ?? [],
                utilities: grouped[VehicleTypeEnum.UTILITIES] ?? [],
                cars: grouped[VehicleTypeEnum.CARS] ?? [],
                fleetsAndSpecialSales: grouped[VehicleTypeEnum.FLEETS_AND_SPECIAL_SALES] ?? []
            }

            const sectionList: Sections[] = [];
            if (vehicleTypes.suvs && vehicleTypes.suvs.length > 0)
                sectionList.push({ title: getVehicleTypeStr(VehicleTypeEnum.SUVS), data: vehicleTypes.suvs })
            if (vehicleTypes.pickUps && vehicleTypes.pickUps.length > 0)
                sectionList.push({ title: getVehicleTypeStr(VehicleTypeEnum.PICK_UPS), data: vehicleTypes.pickUps })
            if (vehicleTypes.cars && vehicleTypes.cars.length > 0)
                sectionList.push({ title: getVehicleTypeStr(VehicleTypeEnum.CARS), data: vehicleTypes.cars })
            if (vehicleTypes.utilities && vehicleTypes.utilities.length > 0)
                sectionList.push({ title: getVehicleTypeStr(VehicleTypeEnum.UTILITIES), data: vehicleTypes.utilities })
            if (vehicleTypes.fleetsAndSpecialSales && vehicleTypes.fleetsAndSpecialSales.length > 0)
                sectionList.push({ title: getVehicleTypeStr(VehicleTypeEnum.FLEETS_AND_SPECIAL_SALES), data: vehicleTypes.fleetsAndSpecialSales })

            setSections(sectionList);
        }
        setIsGettingVehicles(false);
    }

    useEffect(() => {
        getVehiclesFromDB();
    }, []);

    useEffect(() => {
        if (!isSynchronizingBaseData && isSyncBaseDataFinished) {
            getVehiclesFromDB();
        }
    }, [isSynchronizingBaseData, isSyncBaseDataFinished]);

    const onSelectVehicle = (vehicle: ExtendedVehicle) => {
        navigation.navigate(Screens.VehicleDetail, { vehicleId: vehicle.id });
    }

    return {
        isGettingVehicles,
        sections,
        onSelectVehicle
    };
};