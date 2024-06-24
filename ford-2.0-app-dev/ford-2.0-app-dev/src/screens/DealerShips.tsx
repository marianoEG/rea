import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Select from '../components/Select';
import { theme } from '../core/theme';
import { useDealerShips } from '../hooks/useDealerShips';
import { Fonts } from '../utils/fonts';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import DealershipItem from '../components/RowItems/DealershipItem';
import ActionSheetSelectItems from '../components/ActionSheetSelectItems';
import { SheetManager } from 'react-native-actions-sheet';
import { ActionSheetIdEnum } from '../utils/constants';
import { FlashList } from '@shopify/flash-list';
import { Dealership } from '../model/Dealership';

const DealerShips = () => {
    const {
        isGettingFilters,
        isGettingDealerships,
        filters,
        dealerships,
        onSelectDealership,
        selectedVehicle,
        selectedVehicleVersion,
        selectedProvince,
        selectedLocality,
        clearVehicle,
        clearVehicleVersion,
        clearProvince,
        clearLocality,
        snackBarMessage,
        setSnackBarMessage,
        onSelectFilterItem
    } = useDealerShips();

    const openActionSheet = (sheetId: ActionSheetIdEnum) => {
        SheetManager.show(sheetId);
    }

    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {/* Filters */}
                    <View style={styles.filterWrapper}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginRight: 12 }}>
                                <View style={styles.selectWrapper}>
                                    <Text style={styles.selectTitle}>Vehículo de interes</Text>
                                    <Select
                                        title={selectedVehicle?.name}
                                        placeholder='Seleccione vehículo...'
                                        onPress={() => openActionSheet(ActionSheetIdEnum.DEALERSHIPS_VEHICLES)}
                                        onClearPress={clearVehicle}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <View style={styles.selectWrapper}>
                                    <Text style={styles.selectTitle}>Versión de vehículo</Text>
                                    <Select
                                        title={selectedVehicleVersion?.name}
                                        placeholder='Seleccione versión...'
                                        onPress={() => openActionSheet(ActionSheetIdEnum.DEALERSHIPS_VEHICLE_VERSIONS)}
                                        onClearPress={clearVehicleVersion}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginRight: 12 }}>
                                <View style={styles.selectWrapper}>
                                    <Text style={styles.selectTitle}>Provincía</Text>
                                    <Select
                                        title={selectedProvince?.name}
                                        placeholder='Seleccione provincía...'
                                        onPress={() => openActionSheet(ActionSheetIdEnum.DEALERSHIPS_PROVINCES)}
                                        onClearPress={clearProvince}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <View style={styles.selectWrapper}>
                                    <Text style={styles.selectTitle}>Localidad</Text>
                                    <Select
                                        title={selectedLocality?.name}
                                        placeholder='Seleccione localidad...'
                                        onPress={() => openActionSheet(ActionSheetIdEnum.DEALERSHIPS_LOCALITYS)}
                                        onClearPress={clearLocality}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* List items */}
                    {
                        isGettingFilters || isGettingDealerships
                            ?
                            <View style={styles.loadingDealersWrapper}>
                                <ActivityIndicator
                                    size={32}
                                    color={theme.colors.accent}
                                />
                                <Text style={styles.loadingDealersText}>
                                    Obteniendo Concesionarios...
                                </Text>
                            </View>
                            :
                            <>
                                {
                                    (!dealerships || dealerships.length == 0)
                                        ?
                                        <Text style={styles.dealershipsNotFound}>
                                            No se encontraron resultados
                                        </Text>
                                        :
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            style={styles.list}
                                            contentContainerStyle={{ paddingBottom: 40 }}
                                            data={dealerships}
                                            keyExtractor={(item, index) => item.id!.toString()}
                                            renderItem={
                                                ({ item }) =>
                                                    <DealershipItem
                                                        item={item}
                                                        onSelectItem={() => onSelectDealership(item)}
                                                    />
                                            }
                                        />

                                        // <View style={styles.list}>
                                        //     <FlashList<Dealership>
                                        //         data={dealerships}
                                        //         renderItem={({ item }) =>
                                        //             <DealershipItem
                                        //                 item={item}
                                        //                 onSelectItem={() => onSelectDealership(item)}
                                        //             />
                                        //         }
                                        //         estimatedItemSize={40}
                                        //     />
                                        // </View>

                                }
                            </>
                    }
                </View>

                <Snackbar
                    duration={3000}
                    visible={!!snackBarMessage}
                    onDismiss={() => setSnackBarMessage(null)}
                    action={{
                        label: 'Cerrar',
                        color: theme.colors.textLight
                    }}
                    style={{
                        backgroundColor: '#323232',
                    }}
                >
                    <Text style={{ fontSize: RFValue(13) }}>
                        {snackBarMessage}
                    </Text>
                </Snackbar>

            </GestureHandlerRootView>

            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.DEALERSHIPS_VEHICLES}
                items={filters.vehicles.map(v => { return { id: v.id!, name: v.name! } })}
                title={'Seleccione un vehículo'}
                emptyItemsText={'No hay vehículos para seleccionar'}
                onSelect={id => onSelectFilterItem(ActionSheetIdEnum.DEALERSHIPS_VEHICLES, id)}
            />
            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.DEALERSHIPS_VEHICLE_VERSIONS}
                items={selectedVehicle?.versions?.map(l => { return { id: l.id!, name: l.name! } }) ?? []}
                title={'Seleccione una versión de vehículo'}
                emptyItemsText={'No hay versiones vehículos para seleccionar'}
                onSelect={id => onSelectFilterItem(ActionSheetIdEnum.DEALERSHIPS_VEHICLE_VERSIONS, id)}
            />
            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.DEALERSHIPS_PROVINCES}
                items={filters.provinces.map(p => { return { id: p.id!, name: p.name! } })}
                title={'Seleccione una provincía'}
                emptyItemsText={'No hay provincias para seleccionar'}
                onSelect={id => onSelectFilterItem(ActionSheetIdEnum.DEALERSHIPS_PROVINCES, id)}
                height={300}
            />
            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.DEALERSHIPS_LOCALITYS}
                items={selectedProvince?.localities?.map(l => { return { id: l.id!, name: l.name! } }) ?? []}
                title={'Seleccione una ciudad'}
                emptyItemsText={'No hay ciudades para seleccionar, intente con otra Provincía'}
                onSelect={id => onSelectFilterItem(ActionSheetIdEnum.DEALERSHIPS_LOCALITYS, id)}
                height={300}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingBottom: 0,
        backgroundColor: theme.colors.appBackground
    },
    filterWrapper: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8
    },
    selectWrapper: {
        marginBottom: 18,
        width: '100%',
    },
    selectTitle: {
        marginBottom: 4,
        fontSize: RFValue(11),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.darkGrey
    },
    //#region Loading
    loadingDealersWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingDealersText: {
        marginTop: 8,
        fontSize: RFValue(14),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.primary
    },
    //#endregion
    list: {
        marginTop: 20,
        //marginBottom: 20,
        flex: 1
    },
    dealershipsNotFound: {
        flex: 1,
        textAlignVertical: 'center',
        fontSize: RFValue(14),
        fontFamily: Fonts.FordAntennaWGLRegular,
        textAlign: 'center',
        color: theme.colors.primary
    }
});

export default DealerShips;