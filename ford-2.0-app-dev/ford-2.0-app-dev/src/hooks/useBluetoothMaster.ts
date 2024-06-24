import { Alert, EmitterSubscription, NativeEventEmitter, NativeModules } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useDbContext } from "../context/DbContext";
import { Screens } from "../navigation/Screens";
import { PermissionStatusEnum } from "../utils/constants";
import { RootStackParams } from "../utils/rootNavigation";
import { usePermissionsContext } from "../context/PermissionsContext/PermissionsContext";

// import BleManager from 'react-native-ble-manager'
// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export enum ViewMode { }

export const useBluetoothMaster = () => {
    const [isBluetoothAvailable, setIsBluetoothAvailable] = useState<boolean>(false);
    const [isBluetoothEnabled, setIsBluetoothEnabled] = useState<boolean>(false);
    const [isDiscovering, setIsDiscovering] = useState<boolean>(false);
    const [isGettingDevices, setIsGettingDevices] = useState<boolean>(false);
    const [isPairingDevice, setIsPairingDevice] = useState<boolean>(false);
    //const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([]);
    //const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice>();
    // Error Message
    const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
    // Hooks
    const { db } = useDbContext();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();
    const route = useRoute<RouteProp<RootStackParams, Screens.DealerShips>>();
    const { askBluetoothPermision, askAccessFineLocationPermision, permissions } = usePermissionsContext();

    useEffect(() => {
        let bleManagerDiscoverPeripheral: EmitterSubscription;
        let bleManagerStopScan: EmitterSubscription;
        let bleManagerDisconnectPeripheral: EmitterSubscription;
        let bleManagerDidUpdateValueForCharacteristic: EmitterSubscription;

        const init = async () => {
            // BleManager.start({ showAlert: false, forceLegacy: true });
            // bleManagerDiscoverPeripheral = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', () => { });
            // bleManagerDiscoverPeripheral = bleManagerEmitter.addListener('BleManagerStopScan', () => { });
            // bleManagerDiscoverPeripheral = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', () => { });
            // bleManagerDiscoverPeripheral = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', () => { });

        }

        init();

        return (() => {
            console.log('unmount useSyncDevices');
            bleManagerDiscoverPeripheral?.remove();
            bleManagerStopScan?.remove();
            bleManagerDisconnectPeripheral?.remove();
            bleManagerDidUpdateValueForCharacteristic?.remove();
        })
    }, []);

    const startDiscovery = async () => {
        if (!isDiscovering) {
            setIsDiscovering(true);
            try {
                const hasPermissions = await checkPermissions();
                if (hasPermissions) {
                    // const unpairedDevices = await RNBluetoothClassic.startDiscovery();
                    // setBluetoothDevices(unpairedDevices);

                    // BleManager.scan([], 10, true).then((results) => {
                    //     console.log('Scanning...');
                    //     console.log("startDiscovery unpairedDevices:");
                    // }).catch(err => {
                    //     console.error(err);
                    //     setIsDiscovering(false);
                    // });

                } else
                    showNotPermissionsGrantedAlert();

                setIsDiscovering(false);
            } catch (error) {
                console.log("startDiscovery unpairedDevicesError:", error);
                setIsDiscovering(false);
            }
        }
    }

    const handleStopScan = () => {
        console.log('Scan is stopped');
        setIsDiscovering(false);
    }

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
        //bluetoothDevices,
        //connectedDevice,
        startDiscovery,
        //cancelDiscovery,
        snackBarMessage,
        closeSnackBarMessage
    };
};