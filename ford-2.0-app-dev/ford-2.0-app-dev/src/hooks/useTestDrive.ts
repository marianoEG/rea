import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useDbContext } from "../context/DbContext";
import { Vehicle } from "../model/Vehicle";
import { DocumentTypeEnum, DriverTypeEnum, DriverYesOrNoTypeEnum, Item, TestDriveTimeZoneEnum } from "../utils/constants";
import { getVehicles } from '../utils/db';
import { RootStackParams } from "../utils/rootNavigation";
import { Screens } from '../navigation/Screens';
import { TestDriveForm } from "../model/form/TestDriveForm";
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { showTermsModal } from "../store/action/termsModalAction";
type Items = Item[];

interface Options {
    vehicles: Items;
    documentTypes: Items;
    driverTypes: Items;
    driverBool: Items;
}

export const useTestDrive = () => {
    const [isGettingOptions, setIsGettingOptions] = useState<boolean>(true);
    const [options, setOptions] = useState<Options>({ vehicles: [], documentTypes: [], driverTypes: [], driverBool: [] });
    // Hooks
    const { db } = useDbContext();
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();
    const placeholderVehicle = {
        id: -1,
        name: 'Vehiculo propio',
        versions: []
    };
    
    useEffect(() => {
        const getDataFromDB = async () => {
            setIsGettingOptions(true);
            let vehiclesDB = await getVehicles(db!, true);
            const filteredVehicles = vehiclesDB
                .map(vehicle => ({
                    ...vehicle,
                    versions: (!vehicle.versions || vehicle.versions.length == 0)
                        ? undefined
                        : vehicle.versions.filter(version => version.preLaunch != true)
                }))
                .filter(vehicle => vehicle.versions == undefined || vehicle.versions.length > 0)
                .sort((a: Vehicle, b: Vehicle) => {
                    if ((a.name ?? '') > (b.name ?? '')) return 1;
                    if ((a.name ?? '') < (b.name ?? '')) return -1;
                    return 0;
                })
            const vehicles = filteredVehicles?.map(x => ({ id: x.id!, name: x.name! })) ?? [];
            vehicles.unshift(placeholderVehicle);

            let driverTypes: Items = [];
            if (currentEvent?.testDriveDemarcationFordEnabled)
                driverTypes.push({ id: 1, name: DriverTypeEnum.WITHOUT_OWN_VEHICLE });
            if (currentEvent?.testDriveDemarcationOwnerEnabled)
                driverTypes.push({ id: 2, name: DriverTypeEnum.WITH_OWN_VEHICLE });
            if (currentEvent?.testDriveDemarcationOwnerInCaravanEnabled)
                driverTypes.push({ id: 3, name: DriverTypeEnum.WITH_OWN_VEHICLE_IN_CARAVAN });

            let driverBool: Items = [
                { id: 1, name: DriverYesOrNoTypeEnum.YES },
                { id: 2, name: DriverYesOrNoTypeEnum.NO }
            ]

            setOptions({
                vehicles,
                documentTypes: [
                    { id: 1, name: DocumentTypeEnum.CUIL },
                    { id: 2, name: DocumentTypeEnum.CUIT },
                    { id: 3, name: DocumentTypeEnum.DNI },
                    { id: 4, name: DocumentTypeEnum.LC },
                    { id: 5, name: DocumentTypeEnum.LE }
                ],
                driverTypes: driverTypes,
                driverBool: driverBool
            });
            setIsGettingOptions(false);
        }

        getDataFromDB();
    }, []);

    const showTerms = () => {
        dispatch(showTermsModal('test-drive'))
    }

    const navigateToTestDriveSignature = (form: TestDriveForm) => {
        navigation.navigate(Screens.TestDriveSignature, { testDriveForm: JSON.stringify(form) })
    }

    const openScanner = () => {
        navigation.navigate(Screens.QRTestDriveScanner);
    }

    return {
        isGettingOptions,
        options,
        showTerms,
        navigateToTestDriveSignature,
        openScanner
    };
};