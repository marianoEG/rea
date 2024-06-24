import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";

export const isNetworkConnected = (): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        NetInfo.fetch().then(state => {
            console.log("isNetworkConnected - Connection type", state.type);
            console.log("isNetworkConnected - Is connected", state.isConnected);
            resolve(state.isConnected == true); // pregunto por true porque tambien puede ser nulo
        }).catch(error => {
            console.log("isNetworkConnected - Error", error);
            resolve(false);
        });
    });
}

export const getConnectionType = (): Promise<NetInfoStateType> => {
    return new Promise<NetInfoStateType>((resolve) => {
        NetInfo.fetch().then(state => {
            resolve(state.type);
        }).catch(error => {
            resolve(NetInfoStateType.none);
        });
    });
}