import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Snackbar, Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import { Guest } from '../../model/Guest';
import ButtonRound from '../../components/Buttons/ButtonRound';
import { useGuests } from '../../hooks/useGuests';
import GuestModal from '../../components/Modals/GuestModal';
import TextInputLabeled from '../../components/TextInputLabeled';
import PieChartGuest from '../../components/PieChartGuest';
import GuestList from '../../components/GuestList';
import ActionSheetSelectItems from '../../components/ActionSheetSelectItems';
import { ActionSheetIdEnum, GuestStatusEnum } from '../../utils/constants';
import { SheetManager } from 'react-native-actions-sheet';
import { getGuestStatusStr } from '../../utils/utils';

const guestStatus = [
    { id: 1, name: GuestStatusEnum.PRESENT },
    { id: 2, name: GuestStatusEnum.ABSENT },
    { id: 3, name: GuestStatusEnum.ABSENT_WITH_NOTICE }
]

const guestStatusStr = [
    { id: -1, name: 'Todos' },
    { id: 1, name: getGuestStatusStr(GuestStatusEnum.PRESENT) },
    { id: 2, name: getGuestStatusStr(GuestStatusEnum.ABSENT) },
    { id: 3, name: getGuestStatusStr(GuestStatusEnum.ABSENT_WITH_NOTICE) }
]

const Guests = () => {
    //const [searchText, setSearchText] = useState<string>("");
    const [currentGuest, setCurrentGuest] = useState<Guest | undefined>(undefined);
    const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
    const {
        getSubEvent,
        isGettingGuests,
        guests,
        textFilter,
        onTextFilterChange,
        onObservationFilterChange,
        onStatusFilterChange,
        statusFilter,
        observationFilter,
        onGuestStatusChange,
        onPressSort,
        sortType,
        observations,
        isGuestModalVisible,
        showGuestModal,
        closeGuestModal,
        saveGuestToDB,
        isSavingGuest,
        pieChartGuestValues,
        scanQRCode
    } = useGuests();

    const onPressEdit = (guest: Guest) => {
        setCurrentGuest(guest);
        setTimeout(() => {
            showGuestModal()
        }, 50);
    }

    const onPressCreate = () => {
        const subEvent = getSubEvent();
        const guestCount = subEvent?.guests?.length ?? 0;
        const maxGuest = subEvent?.guestNumber ?? 0;
        console.log(`onPressCreate - guestCount: ${guestCount}, maxGuest: ${maxGuest}`)
        if (subEvent && guestCount < maxGuest) {
            setCurrentGuest(undefined);
            setTimeout(() => {
                showGuestModal()
            }, 50);
        }
        else
            setSnackBarMessage('El número de invitados llegó a su máximo');
    }

    return (
        <View style={styles.container}>
            <PieChartGuest values={pieChartGuestValues} isLoading={isGettingGuests} />

            <View style={{ flexDirection: 'row', marginBottom: 12, marginLeft: 8, marginEnd: 8, alignItems: 'center' }}>
                <TextInputLabeled
                    placeholder='Buscar...'
                    value={textFilter}
                    onChangeText={text => {
                        onTextFilterChange(text);
                    }}
                    conatinerStyle={{ flex: 1, marginEnd: 12 }}
                    backgroundColor={theme.colors.transparent}
                />
                {/* <ButtonIcon icon='qr-code' size={42} color={theme.colors.accent} onPress={scanQRCode} /> */}
                <ButtonRound iconName={'qr-code'} title={'Escaner QR'} onPress={scanQRCode} />
            </View>
            {
                isGettingGuests
                    ?
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator
                            size='large'
                            color={theme.colors.accent}
                        />
                        <Text style={styles.loadingText}>
                            Obteniendo invitados...
                        </Text>
                    </View>
                    :
                    <>
                        <GuestList
                            guests={guests}
                            currentSortType={sortType}
                            onPressEdit={onPressEdit}
                            onStatusChange={onGuestStatusChange}
                            onPressSort={onPressSort}
                            onPressObservation={() => SheetManager.show(ActionSheetIdEnum.GUEST_OBSERVATION)}
                            isObservationFilterApplied={!!observationFilter}
                            onPressStatus={() => SheetManager.show(ActionSheetIdEnum.GUEST_STATUS)}
                            isStatusFilterApplied={!!statusFilter} />
                    </>
            }
            {/* Sync Button */}
            <View style={styles.fabWrapper}>
                <ButtonRound
                    title='Nuevo Invitado'
                    iconName='add'
                    reverse={true}
                    contentStyle={{ padding: 8 }}
                    backgroundColor={theme.colors.primary}
                    onPress={onPressCreate}
                />
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
                <Text style={{ fontSize: RFValue(13), color: theme.colors.textLight }}>
                    {snackBarMessage}
                </Text>
            </Snackbar>

            <GuestModal
                isVisible={isGuestModalVisible}
                guest={currentGuest}
                save={saveGuestToDB}
                closeModal={closeGuestModal}
            />

            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.GUEST_OBSERVATION}
                items={observations ?? []}
                title={'Seleccione una observación'}
                emptyItemsText={'No hay observaciones para seleccionar'}
                onSelect={id => onObservationFilterChange(id >= 0 ? observations?.find(x => x.id == id) : undefined)}
                height={300}
            />

            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.GUEST_STATUS}
                items={guestStatusStr}
                title={'Seleccione un estado'}
                emptyItemsText={'No hay estados para seleccionar'}
                onSelect={id => onStatusFilterChange(id >= 0 ? guestStatus.find(x => x.id == id)?.name : undefined)}
                height={300}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 8,
        backgroundColor: theme.colors.appBackground
    },
    //#region Loading
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.appBackground
    },
    loadingText: {
        marginTop: 8,
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.accent
    },
    //#endregion
    fabWrapper: {
        position: 'absolute',
        padding: 0,
        right: 0,
        bottom: 0,
    }
});

export default Guests;