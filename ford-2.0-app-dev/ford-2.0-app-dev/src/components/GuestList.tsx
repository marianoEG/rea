import React, { useCallback } from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { Guest } from '../model/Guest';
import { Fonts } from '../utils/fonts';
import { theme } from '../core/theme';
import GuestItem from './RowItems/GuestItem';
import { GuestStatusEnum, SortType } from '../utils/constants';
import { FlashList } from "@shopify/flash-list";
import ButtonIcon from './Buttons/ButtonIcon';

interface Props {
    guests: Guest[];
    currentSortType: SortType;
    onPressEdit: (guest: Guest) => void;
    onStatusChange: (status: GuestStatusEnum) => void;
    onPressSort: () => void;
    onPressObservation: () => void;
    isObservationFilterApplied: boolean;
    onPressStatus: () => void;
    isStatusFilterApplied: boolean;
}
const GuestList = ({
    guests,
    currentSortType,
    onPressEdit,
    onStatusChange,
    onPressSort,
    onPressObservation,
    isObservationFilterApplied,
    onPressStatus,
    isStatusFilterApplied
}: Props) => {

    // This is used before for FlatList, now using FlashList
    // const renderGuestItem = useCallback(
    //     ({ item }: ListRenderItemInfo<Guest>) =>
    //         <GuestItem
    //             guest={item}
    //             onStatusChange={onStatusChange}
    //             onPressEdit={() => onPressEdit(item)}
    //         />,
    //     []
    // );

    // // we set the height of item is fixed
    // const getItemLayout = useCallback((data: Guest[] | undefined | null, index: number) => (
    //     { length: 56, offset: 56 * index, index }
    // ), []);

    // const keyExtractor = useCallback((item: Guest) => item.id!.toString(), [])

    return (
        <Grid >
            <View style={{ width: '100%', paddingBottom: 56 }}>
                <Row style={styles.tableHeader}>
                    <Col style={[{ width: 120, height: '100%' }]}>
                        <TouchableRipple
                            onPress={onPressSort}
                            rippleColor={theme.colors.primary + '20'}
                            style={{ height: '100%' }}
                        >
                            <View style={styles.sortHeader}>
                                <Text style={styles.tableHeaderText}>Apellido y nombre</Text>
                                <ButtonIcon
                                    icon={currentSortType == SortType.ASC || currentSortType == SortType.NONE ? 'north' : 'south'}
                                    size={12}
                                />
                            </View>
                        </TouchableRipple>
                    </Col>
                    <Col style={[{ width: 80, height: '100%' }]}>
                        <View style={styles.normalHeader}>
                            <Text style={styles.tableHeaderText}>N. Doc</Text>
                        </View>
                    </Col>
                    <Col style={[{ height: '100%' }]}>
                        <TouchableRipple
                            onPress={onPressObservation}
                            rippleColor={theme.colors.primary + '20'}
                            style={{ height: '100%' }}
                        >
                            <View style={styles.comboHeader}>
                                <Text style={styles.tableHeaderText}>Obs.</Text>
                                <ButtonIcon
                                    style={{ marginStart: 8 }}
                                    icon={isObservationFilterApplied ? 'filter-alt' : 'arrow-drop-down'}
                                    size={18}
                                />
                            </View>
                        </TouchableRipple>
                    </Col>
                    <Col style={[{ width: 160, height: '100%' }]}>
                        <TouchableRipple
                            onPress={onPressStatus}
                            rippleColor={theme.colors.primary + '20'}
                            style={{ height: '100%' }}
                        >
                            <View style={styles.comboHeader}>
                                <Text style={styles.tableHeaderText}>Estado</Text>
                                <ButtonIcon
                                    style={{ marginStart: 8 }}
                                    icon={isStatusFilterApplied ? 'filter-alt' : 'arrow-drop-down'}
                                    size={18}
                                />
                            </View>
                        </TouchableRipple>
                    </Col>
                    <Col style={{ width: 36 }}></Col>
                </Row>
                {/* <FlatList<Guest>
                    contentContainerStyle={styles.listContent}
                    keyExtractor={keyExtractor}
                    data={guests}
                    showsVerticalScrollIndicator={true}
                    renderItem={renderGuestItem}
                    getItemLayout={getItemLayout}
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                /> */}

                <View style={styles.listContent}>
                    {
                        guests && guests.length > 0
                            ?
                            < FlashList<Guest>
                                data={guests}
                                renderItem={({ item }) => <GuestItem
                                    guest={item}
                                    onStatusChange={onStatusChange}
                                    onPressEdit={() => onPressEdit(item)}
                                />}
                                estimatedItemSize={100}
                            />
                            :
                            <View style={styles.guestsNotFoundWrapper}>
                                <Text style={styles.guestsNotFoundText}>
                                    No se encontraron invitados asociados.
                                </Text>
                                <Text style={styles.guestsNotFoundText}>
                                    Cambie el criterio de búsqueda
                                </Text>
                            </View>
                    }
                </View>
            </View>
        </Grid>
    )
}

const styles = StyleSheet.create({
    tableHeader: {
        height: 56,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginHorizontal: 8,
        paddingHorizontal: 8,
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
        marginHorizontal: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    normalHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%'
    },
    sortHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    comboHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%'
    },
    //#region Not Found Guests
    guestsNotFoundWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.appBackground
    },
    guestsNotFoundText: {
        fontSize: RFValue(16),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    },
    //#endregion
});

export default GuestList;