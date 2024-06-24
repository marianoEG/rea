import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useDbContext } from "../context/DbContext";
import { VehicleVersion } from "../model/VehicleVersion";
import { Screens } from "../navigation/Screens";
import { cleanVehicleFeatures, selectVehicleImage, selectVehicleVersion } from "../store/action/selectedVehicleFeaturesAction";
import { getVehicleById } from "../utils/db";
import { RootStackParams } from "../utils/rootNavigation";
import { Alert } from 'react-native';
import { ExtendedVehicle } from "../model/Vehicle";

export const useVehicleDetail = () => {
    const [vehicle, setVehicle] = useState<ExtendedVehicle | null>(null);
    const [isGettingVehicle, setIsGettingVehicle] = useState<boolean>(true);
    const dispatch = useDispatch();
    const { db } = useDbContext();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();
    const route = useRoute<RouteProp<RootStackParams, Screens.VehicleDetail>>();

    useEffect(() => {
        const getVehicleByIdAsync = async (vehicleId: number) => {
            const currentVehicle = await getVehicleById(db!, vehicleId);
            console.log("accesorios", currentVehicle?.accessories);
            if (currentVehicle) {
                currentVehicle.images = currentVehicle.images?.filter(i => !!i.vehicleImageUrl);
                currentVehicle.colors = currentVehicle.colors?.filter(c => !!c.vehicleImageUrl && !!c.colorImageUrl);
            }

            // Change Header Title
            navigation.setOptions({ title: currentVehicle?.name })

            const vehicleVersion = currentVehicle?.versions ? currentVehicle?.versions[0] : undefined;
            dispatch(selectVehicleVersion(vehicleVersion))

            const vehicleImage = currentVehicle?.images ? currentVehicle?.images[0] : undefined;
            dispatch(selectVehicleImage(vehicleImage))

            setIsGettingVehicle(false);
            setVehicle(currentVehicle);
        }

        const vehicleId = route?.params?.vehicleId;
        console.log("VehicleDetail - useEffect, VehicleId: ", vehicleId);
        navigation.setOptions({ title: '' })
        setIsGettingVehicle(vehicleId != undefined);
        if (vehicleId != undefined)
            getVehicleByIdAsync(vehicleId);

        return () => {
            dispatch(cleanVehicleFeatures());
        };
    }, [route.params]);

    const onSelectVersion = (versionId?: number) => {
        dispatch(selectVehicleVersion(vehicle?.versions?.find(v => v.id == versionId)));
    }

    const navigateToCompareVersions = (versions: VehicleVersion[]) => {
        navigation.navigate(Screens.VehicleComparator, { vehicle: { ...vehicle! }, versions: [...versions] });
    }

    const navigateToNewsletter = () => {
        navigation.navigate(Screens.NewsletterFormStack, { vehicle: vehicle ?? undefined });
    }

    const navigateToDealerShips = () => {
        navigation.navigate(Screens.DealerShips, { vehicleId: vehicle?.id });
    }

    const navigateToTestDrive = () => {
        // navigation.navigate(Screens.TestDrive, { vehicleId: vehicle?.id });
        Alert.alert(
            "Tarea no desarrollada",
            "Esta funcionalidad se desarrollará en próximos sprints.",
            [{ text: "Cerrar" }]
        );
    }

    return {
        vehicle,
        isGettingVehicle,
        onSelectVersion,
        navigateToCompareVersions,
        navigateToNewsletter,
        navigateToDealerShips,
        navigateToTestDrive
    };
};