import { NetInfoStateType } from "@react-native-community/netinfo";

export interface DeviceInfo {
    uniqueId: string;
    name: string;
    operativeSystem: string;
    operativeSystemVersion: string;
    brand: string;
    model: string;
    appVersion: string;
    ip: string;
    freeSpace: number;
    connectionType: NetInfoStateType;
}