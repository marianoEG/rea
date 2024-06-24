import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { theme } from '../core/theme';
import { Snackbar } from 'react-native-paper';
import TextInputLabeled from '../components/TextInputLabeled';
import ButtonRound from '../components/Buttons/ButtonRound';
import { Fonts } from '../utils/fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { Switch } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker'
import DatePickerField from '../components/DatePickerField';
import { format } from 'date-fns';
import { addHoursToDate } from '../utils/utils';
import ButtonText from '../components/Buttons/ButtonText';
import CampaignSearchItem from '../components/RowItems/CampaignSearchItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../utils/rootNavigation';
import HeaderRight from '../navigation/HeaderRight';
import ButtonIcon from '../components/Buttons/ButtonIcon';

const SearchHistory = () => {
    const [patentOrVin, setPatentOrVin] = useState<string>("");
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
    const [currentDatePicker, setCurrentDatePicker] = useState<'date-from' | 'date-to' | undefined>(undefined);
    const [showSent, setShowSent] = useState<boolean | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();

    const {
        isSearching,
        totalSearches,
        searchList,
        getCampaignSearchesFromDB,
        askForDeleteAllSearches,
        seeCampaignInfo,
        isSyncingSearches,
        syncSearches,
        snackBarMessage,
        dismissSnackBarMessage
    } = useSearchHistory();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <HeaderRight
                        showEventName={true}
                    />
                    {/* <ButtonRound
                        title='Eliminar todos'
                        textStyle={{ color: theme.colors.warn }}
                        iconName='delete'
                        iconColor={theme.colors.warn}
                        reverse={true}
                        onPress={askForDeleteAllSearches}
                        rippleColor={theme.colors.warn + '2B'}
                        isTransparent={true}
                        disabled={isSyncingSearches}
                    /> */}
                    <ButtonIcon
                        icon="delete"
                        onPress={askForDeleteAllSearches}
                        size={30}
                        color={theme.colors.warn}
                        style={{ marginRight: 8 }} />
                </View>
            )
        })
    }, [])

    const openDatePicker = (type: 'date-from' | 'date-to' | undefined) => {
        setCurrentDatePicker(type);
        setOpen(true)
    }

    const onSelectDate = (date: Date) => {
        switch (currentDatePicker) {
            case 'date-from': setDateFrom(addHoursToDate(date, 0, 0, 0, 0));
                break;
            case 'date-to': setDateTo(addHoursToDate(date, 23, 59, 59, 999));
                break;
        }
    }

    const getDefaultDateForPicker = (): Date => {
        switch (currentDatePicker) {
            case 'date-from':
                return dateFrom ?? new Date();
            case 'date-to':
                return dateTo ?? new Date();
            default:
                return new Date();
        }
    }

    const getDatePickerTitle = (): string => {
        switch (currentDatePicker) {
            case 'date-from':
                return 'Fecha Desde';
            case 'date-to':
                return 'Fecha Hasta';
            default:
                return '';
        }
    }

    const getSearches = () => {
        getCampaignSearchesFromDB(patentOrVin, dateFrom, dateTo, showSent);
    }

    const clearFilters = () => {
        setPatentOrVin("");
        setDateFrom(undefined);
        setDateTo(undefined);
        setShowSent(undefined);
        getCampaignSearchesFromDB();
    }

    // Este componente se muestra al realizar una busqueda y no encontrar resultados
    let notResultsFoundContent: JSX.Element = <></>;
    if (!isSearching && (!searchList || searchList.length == 0)) {
        notResultsFoundContent = (
            <View style={styles.notFoundTextWrapper}>
                <Icon
                    name='error-outline'
                    size={96}
                />
                <Text style={styles.notFoundText}>
                    No se encontraron resultados
                </Text>
                <Text style={styles.notFoundText}>
                    bajo el criterio de búsqueda actual.
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* Filtros */}
            <View style={{ margin: 24 }}>
                <View style={[styles.row, { marginBottom: 24 }]}>
                    <View style={styles.patentWrapper}>
                        <TextInputLabeled
                            title='Patente o VIN'
                            placeholder='Ingrese patente o VIN'
                            value={patentOrVin}
                            onChangeText={text => setPatentOrVin(text)}
                        />
                    </View>
                    <View style={[styles.pickerWrapper]}>
                        <Text style={styles.pickerTitle}>Fecha desde</Text>
                        <DatePickerField
                            title={dateFrom ? format(dateFrom!, "dd/MM/yy") : ''}
                            placeholder='Ingrese fecha'
                            onPress={() => openDatePicker('date-from')}
                            onClearPress={() => setDateFrom(undefined)}
                        />
                    </View>
                    <View style={[styles.pickerWrapper, { marginRight: 0 }]}>
                        <Text style={styles.pickerTitle}>Fecha hasta</Text>
                        <DatePickerField
                            title={dateTo ? format(dateTo!, "dd/MM/yy") : ''}
                            placeholder='Ingrese fecha'
                            onPress={() => openDatePicker('date-to')}
                            onClearPress={() => setDateTo(undefined)}
                        />
                    </View>
                </View>
                <View style={[styles.row, { alignItems: 'center' }]}>
                    <View style={styles.switchWrapper}>
                        <Switch
                            style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
                            trackColor={{ false: "#767577", true: theme.colors.primary }}
                            thumbColor={"#fff"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={value => { setShowSent(value) }}
                            value={showSent}
                            disabled={isSearching || isSyncingSearches}
                        />
                        <Text style={styles.switchText}>
                            Mostrar enviados
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}></View>
                    <ButtonRound
                        title='Limpiar'
                        backgroundColor={theme.colors.textLight}
                        textStyle={{ color: theme.colors.textDark }}
                        rippleColor={theme.colors.textDark + '2B'}
                        onPress={clearFilters}
                        disabled={isSyncingSearches}
                    />
                    <ButtonRound
                        isLoading={isSearching}
                        loadingText={'Buscando...'}
                        title='Buscar'
                        contentStyle={{ width: 200, marginLeft: 8 }}
                        onPress={getSearches}
                        disabled={isSyncingSearches}
                    />
                </View>
            </View>

            {/* No Results And List */}
            {notResultsFoundContent}
            {
                searchList && searchList.length > 0 &&
                <>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={styles.list}
                        contentContainerStyle={{ paddingHorizontal: 24 }}
                        data={searchList}
                        keyExtractor={(item, index) => item.id!.toString()}
                        renderItem={
                            ({ item }) =>
                                <CampaignSearchItem
                                    item={item}
                                    onSelectItem={() => seeCampaignInfo(item)}
                                    disabled={isSyncingSearches}
                                />
                        }
                    />
                </>
            }

            <DatePicker
                modal
                open={open}
                date={getDefaultDateForPicker()}
                mode='date'
                title={getDatePickerTitle()}
                cancelText={'Cancelar'}
                confirmText={'Aceptar'}
                locale='es-Ar'
                onConfirm={(date: Date) => {
                    setOpen(false)
                    onSelectDate(date);
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />

            {/* Sync Button */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.textFooter}>Búsquedas totales: {totalSearches}</Text>
                    <Text style={styles.textFooter}>Búsquedas filtradas: {searchList ? searchList.length : '-'}</Text>
                </View>
                <ButtonRound
                    isLoading={isSyncingSearches}
                    loadingText='Sincronizando...'
                    title='Sincronizar'
                    iconName='sync'
                    reverse={true}
                    contentStyle={{ padding: 8 }}
                    backgroundColor={theme.colors.accent}
                    onPress={syncSearches}
                />
            </View>

            <Snackbar
                duration={3000}
                visible={!!snackBarMessage}
                onDismiss={dismissSnackBarMessage}
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //padding: 24,
        backgroundColor: theme.colors.appBackground
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    patentWrapper: {
        flex: 1,
        marginRight: 12
    },
    pickerWrapper: {
        width: '100%',
        flex: 1,
        marginRight: 12
    },
    pickerTitle: {
        marginBottom: 6,
        fontSize: RFValue(11.5),
        fontFamily: Fonts.FordAntennaWGLMedium,
        color: theme.colors.darkGrey
    },
    switchWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    switchText: {
        marginLeft: 12,
        fontSize: RFValue(12),
        fontFamily: Fonts.FordAntennaWGLRegular,
        marginBottom: 4,
        color: theme.colors.textDark
    },
    notFoundTextWrapper: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    notFoundText: {
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    },
    list: {
        flex: 1,
        marginBottom: 78
    },
    footer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        left: 0,
        bottom: 0,
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    textFooter: {
        fontSize: RFValue(12),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.darkGrey
    }
});

export default SearchHistory;
