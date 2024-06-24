import React, { useState } from 'react';
import { View, StyleSheet, TouchableHighlight, Text, StatusBar, SafeAreaView, ScrollView, Button, FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../core/theme';
import { useBluetoothMaster } from '../hooks/useBluetoothMaster';
import { useBluetoothSlave } from '../hooks/useBluetoothSlave';
import { useSyncDevices } from '../hooks/useSyncDevices';
import { Fonts } from '../utils/fonts';

const SyncDevices = () => {
    // const {
    //     isBluetoothAvailable,
    //     isBluetoothEnabled,
    //     isDiscovering,
    //     bluetoothDevices,
    //     connectedDevice,
    //     startDiscovery,
    //     cancelDiscovery,
    //     snackBarMessage,
    //     closeSnackBarMessage
    // } = useSyncDevices();

    const {
        isBluetoothAvailable,
        isBluetoothEnabled,
        isDiscovering,
        startDiscovery,
        snackBarMessage,
        closeSnackBarMessage
    } = useBluetoothMaster();

    const {
        startAdvertising,
        stopAdvertising
    } = useBluetoothSlave();

    return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <Button title='start' onPress={startAdvertising} />
            <Button title='stop' onPress={stopAdvertising} />
        </View>
    )


    if (!isBluetoothAvailable || !isBluetoothEnabled) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Icon
                    name='bluetooth-disabled'
                    color={theme.colors.disable}
                    size={96}
                />
                {!isBluetoothAvailable && <Text style={styles.bluetoothUnavailableText}>
                    Bluetooth no se encuentra disponible en tu dispositivo.
                </Text>}
                {!isBluetoothEnabled && <Text style={styles.bluetoothDisableText}>
                    El Bluetooth se encuentra deshabilitado, por favor enciendalo.
                </Text>}
            </View>
        )
    }

    const renderItem = (item: any) => {
        const color = item.connected ? 'green' : '#fff';
        return (
            <TouchableHighlight onPress={() => { }}>
                <View style={{ flexDirection: 'row', backgroundColor: color }}>
                    <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
                    <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text>
                    <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20 }}>{item.id}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    return (
        <>

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.appBackground,
        padding: 24
    },
    bluetoothUnavailableText: {
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark,
        textAlign: 'center',
    },
    bluetoothDisableText: {
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark,
        textAlign: 'center',
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});

export default SyncDevices;