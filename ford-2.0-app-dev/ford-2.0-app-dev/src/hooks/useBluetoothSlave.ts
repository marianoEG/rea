import { useEffect } from "react";
import { Alert } from "react-native";
import { usePermissionsContext } from "../context/PermissionsContext/PermissionsContext";
import { PermissionStatusEnum } from "../utils/constants";
//const BLEPeripheral = require('react-native-ble-peripheral');
const SERVICE_UUID = 'd4fed820-4991-11ed-b878-0242ac120002';
const CHARASTERISTIC_UUID = 'a598537e-4994-11ed-b878-0242ac120002';

export const useBluetoothSlave = () => {
    const { askBluetoothPermision, askAccessFineLocationPermision, permissions } = usePermissionsContext();

    useEffect(() => {
        const init = async () => {
            // BLEPeripheral.addService(SERVICE_UUID, true).then((algo: any) => {
            //     console.log("Service:", algo);
            // })

            //const characteristic = await BLEPeripheral.addCharacteristicToService(SERVICE_UUID, CHARASTERISTIC_UUID, 16 | 1, 8) //this is a Characteristic with read and write permissions and notify property
            //console.log("Characteristic:", characteristic);
        }
        init();
    }, []);

    const startAdvertising = async () => {
        const hasPermissions = await checkPermissions();
        if (hasPermissions) {
            // BLEPeripheral.start()
            //     .then((res: any) => {
            //         console.log(res)
            //     }).catch((error: any) => {
            //         console.log(error)
            //     })
        } else {
            showNotPermissionsGrantedAlert();
        }

    }

    const stopAdvertising = () => {
        //BLEPeripheral.stop();
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

    return {
        startAdvertising,
        stopAdvertising
    };
};