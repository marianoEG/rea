import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import { check, PERMISSIONS, PermissionStatus, request } from 'react-native-permissions';
import { PermissionStatusEnum, PlatformEnum } from '../../utils/constants';

export interface PermissionsState {
  storageStatus: PermissionStatus;
  accessFineLocationStatus: PermissionStatus;
  bluetoothStatus: PermissionStatus;
  cameraStatus: PermissionStatus;
}

export const permissionInitState: PermissionsState = {
  storageStatus: PermissionStatusEnum.UNAVAILABLE,
  accessFineLocationStatus: PermissionStatusEnum.UNAVAILABLE,
  bluetoothStatus: PermissionStatusEnum.UNAVAILABLE,
  cameraStatus: PermissionStatusEnum.UNAVAILABLE
};

type PermissionsContextProps = {
  permissions: PermissionsState;
  askStoragePermission: () => Promise<boolean>;
  checkStoragePermission: () => void;
  askAccessFineLocationPermision: () => Promise<boolean>;
  checkAccessFineLocationPermision: () => void;
  askBluetoothPermision: () => Promise<boolean>;
  checkBluetoothPermision: () => void;
  askCameraPermission: () => Promise<boolean>;
  checkCameraPermission: () => void;
};

export const PermissionsContext = createContext({} as PermissionsContextProps);

export const usePermissionsContext = () => {
  return useContext(PermissionsContext);
}

export const PermissionsProvider = ({ children }: any) => {
  const [permissions, setPermissions] = useState(permissionInitState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') return;
      checkStoragePermission();
      checkAccessFineLocationPermision();
      checkCameraPermission();
    });
    return () => {
      subscription.remove();
    };
  }, []);

  //#region Storage
  const askStoragePermission = async (): Promise<boolean> => {
    let permission = false;
    if (Platform.OS === PlatformEnum.IOS) {
      permission = true; //(await request(PERMISSIONS.IOS.PHOTO_LIBRARY)) === PermissionStatusEnum.GRANTED;
    } else if (Platform.OS === PlatformEnum.ANDROID) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      ])
      permission =
        result['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionStatusEnum.GRANTED
        && result['android.permission.READ_EXTERNAL_STORAGE'] === PermissionStatusEnum.GRANTED;
    }
    setPermissions({
      ...permissions,
      storageStatus: permission ? PermissionStatusEnum.GRANTED : PermissionStatusEnum.BLOCKED,
    });
    return permission;
  };

  const checkStoragePermission = async () => {
    let permission = false;
    if (Platform.OS === PlatformEnum.IOS) {
      permission = true; //(await check(PERMISSIONS.IOS.PHOTO_LIBRARY)) === PermissionStatusEnum.GRANTED;
    } else if (Platform.OS === PlatformEnum.ANDROID) {
      const writeExternalStorage = await check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      const readExternalStorage = await check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      permission =
        readExternalStorage === PermissionStatusEnum.GRANTED && writeExternalStorage === PermissionStatusEnum.GRANTED;
    }
    setPermissions({
      ...permissions,
      storageStatus: permission ? PermissionStatusEnum.GRANTED : PermissionStatusEnum.BLOCKED,
    });
  };
  //#endregion

  //#region AccessFineLocation
  const askAccessFineLocationPermision = async (): Promise<boolean> => {
    let permission = true;
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      permission = false;
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      permission = result === PermissionStatusEnum.GRANTED;
    }
    setPermissions({
      ...permissions,
      accessFineLocationStatus: permission ? PermissionStatusEnum.GRANTED : PermissionStatusEnum.BLOCKED,
    });
    return permission;
  }

  const checkAccessFineLocationPermision = async () => {
    let permission = true;
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      permission = false;
      const accessFineLocation = await check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      permission = accessFineLocation === PermissionStatusEnum.GRANTED;
    }
    setPermissions({
      ...permissions,
      accessFineLocationStatus: permission ? PermissionStatusEnum.GRANTED : PermissionStatusEnum.BLOCKED,
    });
  }

  //#endregion

  //#region Bluetooth
  const askBluetoothPermision = async (): Promise<boolean> => {
    let permission = true;
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      permission = false;
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      ]);
      permission =
        result['android.permission.BLUETOOTH_ADVERTISE'] === PermissionStatusEnum.GRANTED
        && result['android.permission.BLUETOOTH_CONNECT'] === PermissionStatusEnum.GRANTED
        && result['android.permission.BLUETOOTH_SCAN'] === PermissionStatusEnum.GRANTED;
    }
    setPermissions({
      ...permissions,
      bluetoothStatus: permission ? PermissionStatusEnum.GRANTED : PermissionStatusEnum.BLOCKED,
    });
    return permission;
  }

  const checkBluetoothPermision = async () => {
    let permission = true;
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      permission = false;
      const bluetoothAdvertise = await check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE);
      const bluetoothConnect = await check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      const bluetoothScan = await check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
      permission =
        bluetoothAdvertise === PermissionStatusEnum.GRANTED
        && bluetoothConnect === PermissionStatusEnum.GRANTED
        && bluetoothScan === PermissionStatusEnum.GRANTED;
    }
    setPermissions({
      ...permissions,
      bluetoothStatus: permission ? PermissionStatusEnum.GRANTED : PermissionStatusEnum.BLOCKED,
    });
  }
  //#endregion

  //#region Storage
  const askCameraPermission = async (): Promise<boolean> => {
    let permission = false;
    if (Platform.OS === PlatformEnum.IOS) {
      permission = (await request(PERMISSIONS.IOS.CAMERA)) === PermissionStatusEnum.GRANTED;
    } else if (Platform.OS === PlatformEnum.ANDROID) {
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
      permission = result === PermissionStatusEnum.GRANTED;
    }
    setPermissions({
      ...permissions,
      cameraStatus: permission ? PermissionStatusEnum.GRANTED : PermissionStatusEnum.BLOCKED,
    });
    return permission;
  };

  const checkCameraPermission = async () => {
    let permission = false;
    if (Platform.OS === PlatformEnum.IOS) {
      permission = (await check(PERMISSIONS.IOS.CAMERA)) === PermissionStatusEnum.GRANTED;
    } else if (Platform.OS === PlatformEnum.ANDROID) {
      const cameraPermission = await check(PermissionsAndroid.PERMISSIONS.CAMERA);
      permission = cameraPermission === PermissionStatusEnum.GRANTED;
    }
    setPermissions({
      ...permissions,
      cameraStatus: permission ? PermissionStatusEnum.GRANTED : PermissionStatusEnum.BLOCKED,
    });
  };
  //#endregion

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        askStoragePermission,
        checkStoragePermission,
        askAccessFineLocationPermision,
        checkAccessFineLocationPermision,
        askBluetoothPermision,
        checkBluetoothPermision,
        askCameraPermission,
        checkCameraPermission
      }}>
      {children}
    </PermissionsContext.Provider>
  );
};
