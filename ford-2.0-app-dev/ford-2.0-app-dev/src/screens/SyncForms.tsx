import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Select from '../components/Select';
import { theme } from '../core/theme';
import { Fonts } from '../utils/fonts';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import ActionSheetSelectItems from '../components/ActionSheetSelectItems';
import { SheetManager } from 'react-native-actions-sheet';
import { ActionSheetIdEnum, FormTypeEnum, Item } from '../utils/constants';
import { useSyncForms } from '../hooks/useSyncForms';
import { Col, Grid, Row } from 'react-native-easy-grid';
import ButtonIcon from '../components/Buttons/ButtonIcon';
import { format } from 'date-fns';
import ButtonRound from '../components/Buttons/ButtonRound';
import SyncFormsModal from '../components/Modals/SyncFormsModal';

const SyncForms = () => {
    const [formType, setFormType] = useState<Item>();
    const {
        isGettingForms,
        forms,
        filterFormsByType,
        formsCount,
        onPressEdit,
        sendForms,
        isSyncingForms,
        sendingFormType,
        snackBarMessage,
        closeSnackBar
    } = useSyncForms();

    const formTypes: Item[] = useMemo(() => {
        return [{ id: FormTypeEnum.QUOTE, name: 'Cotización' }, { id: FormTypeEnum.NEWSLETTER, name: 'Newsletter' }, { id: FormTypeEnum.TESTDRIVE, name: 'Testdrive' }];
    }, []);

    const onSelectFormType = (formTypeId?: FormTypeEnum) => {
        setFormType(formTypes.find(x => x.id == formTypeId));
        filterFormsByType(formTypeId);
    }

    const getFormTypeName = (formTypeId?: number): string => {
        return formTypes?.find(x => x.id == formTypeId)?.name ?? '-';
    }

    const getDateToShow = (createdOn?: Date, modifiedOn?: Date): string => {
        if (modifiedOn)
            return format(modifiedOn, 'dd/MM/yyyy HH:mm:ss');
        else if (createdOn)
            return format(createdOn, 'dd/MM/yyyy HH:mm:ss');
        else return '-';
    }

    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {/* Filters */}
                    <View style={styles.filterWrapper}>
                        <View style={styles.selectWrapper}>
                            <Text style={styles.selectTitle}>Tipo de formulario</Text>
                            <Select
                                title={formType?.name}
                                placeholder='Seleccione Tipo de formulario...'
                                onPress={() => SheetManager.show(ActionSheetIdEnum.SYNC_FORMS_TYPE)}
                                onClearPress={() => onSelectFormType()}
                            />
                        </View>
                        <View >
                            <Text style={styles.summaryText}>Cant. de TestDrive SIN SINCRONIZAR: {formsCount.testDriveFormCount ?? 0}</Text>
                            <Text style={styles.summaryText}>Cant. de Newsletter SIN SINCRONIZAR: {formsCount.newsletterFormCount ?? 0}</Text>
                            <Text style={styles.summaryText}>Cant. de Cotización SIN SINCRONIZAR: {formsCount.quoteFormCount ?? 0}</Text>
                        </View>
                    </View>
                    {/* List items */}
                    {
                        isGettingForms
                            ?
                            <View style={styles.loadingWrapper}>
                                <ActivityIndicator
                                    size={32}
                                    color={theme.colors.accent}
                                />
                                <Text style={styles.loadingText}>
                                    Obteniendo Formularios...
                                </Text>
                            </View>
                            :
                            <>
                                {
                                    (forms && forms.length > 0)
                                        ?
                                        <Grid >
                                            <View style={{ width: '100%' }}>
                                                <Row style={styles.tableHeader}>
                                                    <Col style={{ width: 170 }}>
                                                        <Text style={styles.tableHeaderText}>Fecha y hora</Text>
                                                    </Col>
                                                    <Col style={{ justifyContent: 'center' }}>
                                                        <Text style={styles.tableHeaderText}>Apellido y nombre</Text>
                                                    </Col>
                                                    <Col style={{ width: 140 }}>
                                                        <Text style={styles.tableHeaderText}>N. Doc</Text>
                                                    </Col>
                                                    <Col >
                                                        <Text style={styles.tableHeaderText}>Formulario</Text>
                                                    </Col>
                                                    <Col style={{ width: 36 }}></Col>
                                                </Row>
                                                <ScrollView contentContainerStyle={styles.listContent}>
                                                    {
                                                        forms?.map(form =>
                                                            <Row
                                                                key={form.formType + '-' + form.id}
                                                                style={styles.tableRow}
                                                            >
                                                                <Col style={{ width: 170 }}>
                                                                    <Text style={styles.tableRowText}>
                                                                        {getDateToShow(form.createdOn, form.modifiedOn)}
                                                                    </Text>
                                                                </Col>
                                                                <Col>
                                                                    <Text style={styles.tableRowText}>
                                                                        {form.lastname + ' ' + form.firstname}
                                                                    </Text>
                                                                </Col>
                                                                <Col style={{ width: 140 }}>
                                                                    <Text style={styles.tableRowText}>
                                                                        {form.documentNumber ?? '-'}
                                                                    </Text>
                                                                </Col>
                                                                <Col >
                                                                    <Text style={styles.tableRowText}>
                                                                        {getFormTypeName(form.formType)}
                                                                    </Text>
                                                                </Col>
                                                                <Col style={{ width: 36 }}>
                                                                    <View>
                                                                        <ButtonIcon
                                                                            icon='edit'
                                                                            size={24}
                                                                            onPress={() => onPressEdit(form)}
                                                                        />
                                                                    </View>
                                                                </Col>
                                                            </Row>
                                                        )
                                                    }
                                                </ScrollView>
                                            </View>
                                        </Grid>
                                        :
                                        <Text style={styles.formsNotFound}>
                                            No se encontraron resultados
                                        </Text>
                                }
                            </>
                    }
                </View>
                <View style={styles.syncButtonWrapper}>
                    <ButtonRound
                        title='Sincronizar'
                        iconName='sync'
                        reverse={true}
                        contentStyle={{ padding: 8 }}
                        backgroundColor={theme.colors.accent}
                        onPress={sendForms}
                        disabled={isGettingForms || isSyncingForms}
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

            <SyncFormsModal
                isVisible={isSyncingForms}
                syncingStatus={sendingFormType}
            />

            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.SYNC_FORMS_TYPE}
                items={formTypes}
                title={'Seleccione un tipo de formulario'}
                emptyItemsText={''}
                onSelect={id => onSelectFormType(id)}
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
        fontSize: RFValue(10),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.darkGrey,
        marginBottom: 4
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
    //#endregion
    formsNotFound: {
        flex: 1,
        textAlignVertical: 'center',
        fontSize: RFValue(14),
        fontFamily: Fonts.FordAntennaWGLRegular,
        textAlign: 'center',
        color: theme.colors.primary
    },
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
        //height: 56,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderBottomColor: '#00000010',
        borderBottomWidth: RFValue(1),
    },
    tableRowText: {
        fontSize: RFValue(11),
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

export default SyncForms;