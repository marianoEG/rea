import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Select from '../components/Select';
import { theme } from '../core/theme';
import { Fonts } from '../utils/fonts';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import ActionSheetSelectItems from '../components/ActionSheetSelectItems';
import { SheetManager } from 'react-native-actions-sheet';
import { ActionSheetIdEnum, Item } from '../utils/constants';
import { Col, Grid, Row } from 'react-native-easy-grid';
import ButtonRound from '../components/Buttons/ButtonRound';
import { useSyncGuests } from '../hooks/useSyncGuests';
import { ExtendedGuest } from '../model/Guest';
import GuestSyncItem from '../components/RowItems/GuestSyncItem';
import { FlashList } from '@shopify/flash-list';

const SyncGuests = () => {

    const {
        isGettingGuests,
        subEvents,
        filteredGuests,
        subEventSelected,
        setSubEventSelected,
        syncGuests,
        isSyncingGuests,
        isDeletingGuests,
        snackBarMessage,
        closeSnackBar
    } = useSyncGuests();

    // we set the height of item is fixed
    const getItemLayout = (data: ExtendedGuest[] | undefined | null, index: number) => (
        { length: 56, offset: 56 * index, index }
    );

    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {/* Filters */}
                    <View style={styles.filterWrapper}>
                        <View style={styles.selectWrapper}>
                            <Text style={styles.selectTitle}>Sub evento</Text>
                            <Select
                                title={subEventSelected?.name}
                                placeholder='Seleccione un subEvento...'
                                onPress={() => SheetManager.show(ActionSheetIdEnum.SYNC_GUESTS_SUB_EVENT)}
                                onClearPress={() => setSubEventSelected(undefined)}
                                disabled={isSyncingGuests || isDeletingGuests}
                            />
                        </View>
                    </View>
                    {/* List items */}
                    {
                        isGettingGuests
                            ?
                            <View style={styles.loadingWrapper}>
                                <ActivityIndicator
                                    size={32}
                                    color={theme.colors.accent}
                                />
                                <Text style={styles.loadingText}>
                                    Obteniendo Invitados...
                                </Text>
                            </View>
                            :
                            <>
                                {
                                    (filteredGuests && filteredGuests.length > 0)
                                        ?
                                        <Grid >
                                            <View style={{ width: '100%', paddingBottom: 56 }}>
                                                <Row style={styles.tableHeader}>
                                                    <Col style={{ width: 100 }}>
                                                        <Text style={styles.tableHeaderText}>Fecha y hora</Text>
                                                    </Col>
                                                    <Col style={{ width: 110 }}>
                                                        <Text style={styles.tableHeaderText}>Apellido y nombre</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={styles.tableHeaderText}>Sub evento</Text>
                                                    </Col>
                                                    <Col style={{ width: 160 }} >
                                                        <Text style={[styles.tableHeaderText, { paddingHorizontal: 16 }]}>Estado</Text>
                                                    </Col>
                                                </Row>
                                                {/* <FlatList<ExtendedGuest>
                                                    contentContainerStyle={styles.listContent}
                                                    keyExtractor={item => item.id!.toString()}
                                                    data={filteredGuests}
                                                    showsVerticalScrollIndicator={true}
                                                    renderItem={({ item }) =>
                                                        <GuestSyncItem
                                                            key={item.id}
                                                            guest={item}
                                                            isSyncingGuests={isSyncingGuests}
                                                            isDeletingGuests={isDeletingGuests}
                                                        />}
                                                    getItemLayout={getItemLayout}
                                                    initialNumToRender={50}
                                                    maxToRenderPerBatch={50}
                                                /> */}
                                                <View style={styles.listContent}>
                                                    <FlashList<ExtendedGuest>
                                                        data={filteredGuests}
                                                        renderItem={({ item }) =>
                                                            <GuestSyncItem
                                                                key={item.id}
                                                                guest={item}
                                                                isSyncingGuests={isSyncingGuests}
                                                                isDeletingGuests={isDeletingGuests}
                                                            />}
                                                        estimatedItemSize={100}
                                                    />
                                                </View>
                                            </View>
                                        </Grid>
                                        :
                                        <View style={styles.guestsNotFoundWrapper}>
                                            <Text style={styles.guestsNotFoundText}>
                                                no se encontraron invitados.
                                            </Text>
                                        </View>
                                }
                            </>
                    }
                </View>
                <View style={styles.syncButtonWrapper}>
                    <ButtonRound
                        isLoading={isSyncingGuests}
                        loadingText='Sincronizando...'
                        title='Sincronizar'
                        iconName='sync'
                        reverse={true}
                        contentStyle={{ padding: 8 }}
                        backgroundColor={theme.colors.accent}
                        onPress={() => { syncGuests(true) }}
                        disabled={isDeletingGuests || !filteredGuests || filteredGuests.length == 0}
                    />
                </View>
                <Snackbar
                    duration={3000}
                    visible={!!snackBarMessage}
                    onDismiss={closeSnackBar}
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
                sheetId={ActionSheetIdEnum.SYNC_GUESTS_SUB_EVENT}
                items={subEvents}
                title={'Seleccione un subEvento'}
                emptyItemsText={'No hay subEventos para seleccionar'}
                onSelect={id => setSubEventSelected(subEvents.find(x => x.id == id))}
                height={250}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        backgroundColor: theme.colors.appBackground
    },
    filterWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    selectWrapper: {
        marginRight: 24,
        marginBottom: 12,
        width: '50%',
    },
    selectTitle: {
        marginBottom: 4,
        fontSize: RFValue(11),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.darkGrey
    },
    summaryText: {
        fontSize: RFValue(11),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.darkGrey
    },
    //#region Loading
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 8,
        fontSize: RFValue(14),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.primary
    },
    //#region Not Found Guests
    guestsNotFoundWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.appBackground
    },
    guestsNotFoundText: {
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    },
    //#endregion
    //#region table
    tableHeader: {
        height: 56,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 8,
        marginHorizontal: 12,
        borderBottomColor: '#00000030',
        borderBottomWidth: RFValue(1),
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    tableHeaderText: {
        fontSize: RFValue(10),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.darkGrey
    },
    listContent: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    tableRow: {
        height: 56,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderBottomColor: '#00000010',
        borderBottomWidth: RFValue(1),
    },
    tableRowText: {
        fontSize: RFValue(10.25),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    },
    //#endregion
    syncButtonWrapper: {
        position: 'absolute',
        right: 12,
        bottom: 12
    }
});

export default SyncGuests;