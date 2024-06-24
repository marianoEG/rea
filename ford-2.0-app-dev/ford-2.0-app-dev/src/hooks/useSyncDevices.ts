//import { BluetoothEventSubscription } from './../../node_modules/react-native-bluetooth-classic/lib/BluetoothEvent.d';
import { Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useDbContext } from "../context/DbContext";
import { Screens } from "../navigation/Screens";
import { PermissionStatusEnum } from "../utils/constants";
import { RootStackParams } from "../utils/rootNavigation";
import { usePermissionsContext } from "../context/PermissionsContext/PermissionsContext";
// import RNBluetoothClassic, { BluetoothDevice } from 'react-native-bluetooth-classic';
// import { StateChangeEvent } from "react-native-bluetooth-classic/lib/BluetoothEvent";

export enum ViewMode { }

export const useSyncDevices = () => {
    const [isBluetoothAvailable, setIsBluetoothAvailable] = useState<boolean>(false);
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState<boolean>(false);
    const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
    const [isGettingDevices, setIsGettingDevices] = useState<boolean>(false);
    const [isPairingDevice, setIsPairingDevice] = useState<boolean>(false);
    const [bluetoothDevices, setBluetoothDevices] = useState<any[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<any>();
    // Error Message
    const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
    // Hooks
    const { db } = useDbContext();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();
    const route = useRoute<RouteProp<RootStackParams, Screens.DealerShips>>();
    const { askBluetoothPermision, askAccessFineLocationPermision, permissions } = usePermissionsContext();

    // useEffect(() => {
    //     let bluetoothEnabledSubscription: BluetoothEventSubscription;
    //     let bluetoothDisableSubscription: BluetoothEventSubscription;

    //     const init = async () => {
    //         try {
    //             const isBluetoothAvailable = await RNBluetoothClassic.isBluetoothAvailable();
    //             setIsBluetoothAvailable(isBluetoothAvailable);

    //             const isBluetoothEnabled = await RNBluetoothClassic.isBluetoothEnabled();
    //             setIsBluetoothEnabled(isBluetoothEnabled);

    //             bluetoothEnabledSubscription = RNBluetoothClassic.onBluetoothEnabled(onStateChange);
    //             bluetoothDisableSubscription = RNBluetoothClassic.onBluetoothDisabled(onStateChange);

    //             // const bondedDevices = await RNBluetoothClassic.getBondedDevices();
    //             // console.log("useSyncDevices - init, bondedDevices:", bondedDevices);
    //         }
    //         catch (error) {
    //             console.log("useSyncDevices - init, bondedDevicesError:", error);
    //         }
    //     }

    //     init();

    //     return (() => {
    //         console.log('unmount useSyncDevices');
    //         bluetoothEnabledSubscription?.remove();
    //         bluetoothDisableSubscription?.remove();
    //     })
    // }, []);

    // const startDiscovery = async () => {
    //     if (!isDiscovering) {
    //         setIsDiscovering(true);
    //         try {
    //             const hasPermissions = await checkPermissions();
    //             if (hasPermissions) {
    //                 const unpairedDevices = await RNBluetoothClassic.startDiscovery();
    //                 setBluetoothDevices(unpairedDevices);
    //                 console.log("startDiscovery unpairedDevices:", unpairedDevices);
    //             } else
    //                 showNotPermissionsGrantedAlert();

    //             setIsDiscovering(false);
    //         } catch (error) {
    //             console.log("startDiscovery unpairedDevicesError:", error);
    //             setIsDiscovering(false);
    //         }
    //     }
    // }

    // const cancelDiscovery = async () => {
    //     try {
    //         const cancelled = await RNBluetoothClassic.cancelDiscovery();
    //         setIsDiscovering(cancelled);
    //     } catch (error) {
    //         setSnackBarMessage('Ocurrió un error al intentar detener el scaneo');
    //     }
    // }

    // const pairDevice = async (address: string) => {
    //     if (!isPairingDevice) {

    //     }
    // }

    // const getBondedDevices = async () => {
    //     if (!isGettingDevices) {
    //         setIsGettingDevices(true);
    //         try {
    //             const hasPermissions = await checkPermissions();
    //             if (hasPermissions) {
    //                 const bondedDevices = await RNBluetoothClassic.getBondedDevices();
    //                 setBluetoothDevices(bondedDevices);
    //                 console.log("startDiscovery unpairedDevices:", bondedDevices);
    //             } else
    //                 showNotPermissionsGrantedAlert();

    //             setIsDiscovering(false);
    //         } catch (error) {
    //             console.log("startDiscovery unpairedDevicesError:", error);
    //             setIsDiscovering(false);
    //         }

    //     }
    // }

    // const connectToDevice = (device: BluetoothDevice) => {

    // }

    // const onStateChange = (event: StateChangeEvent) => {
    //     setIsBluetoothEnabled(event.enabled);
    // }

    const checkPermissions = async (): Promise<boolean> => {
        try {
            return await requestPermissions();
        } catch {
            return false;
        }
    }

    const requestPermissions = async (): Promise<boolean> => {
        let bluetoothGranted: boolean = false;
        if (permissions.bluetoothStatus == PermissionStatusEnum.GRANTED)
            bluetoothGranted = true;
        else bluetoothGranted = await askBluetoothPermision();

        let accessFineLocationGranted: boolean = true;
        if (permissions.accessFineLocationStatus == PermissionStatusEnum.GRANTED)
            accessFineLocationGranted = true;
        else accessFineLocationGranted = await askAccessFineLocationPermision();

        return bluetoothGranted && accessFineLocationGranted;
    }

    const showNotPermissionsGrantedAlert = () => {
        Alert.alert(
            "Permiso denegado",
            "Para realizar una sincronización entre dispositivos es necesario que acepte los permisos solicitados",
            [{ text: "Cerrar" }]
        );
    }

    const closeSnackBarMessage = () => {
        setSnackBarMessage(null);
    }

    return {
        isBluetoothAvailable,
        isBluetoothEnabled,
        isDiscovering,
        bluetoothDevices,
        connectedDevice,
        //startDiscovery,
        //cancelDiscovery,
        snackBarMessage,
        closeSnackBarMessage
    };
};