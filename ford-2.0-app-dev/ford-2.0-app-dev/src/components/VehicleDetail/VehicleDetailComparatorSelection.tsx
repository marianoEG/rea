

import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Snackbar, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../core/theme';
import { VehicleVersion } from '../../model/VehicleVersion';
import { ActionSheetIdEnum } from '../../utils/constants';
import { Fonts } from '../../utils/fonts';
import ActionSheetSelectItems from '../ActionSheetSelectItems';
import ButtonRound from '../Buttons/ButtonRound';
import { SheetManager } from 'react-native-actions-sheet';
import Select from '../Select';

interface Props {
    versions: VehicleVersion[];
    onAccept: (selectedVersions: VehicleVersion[]) => void;
}
const VehicleDetailComparatorSelection = ({ versions, onAccept }: Props) => {
    const [snackBarMessage, setSnackBarMessage] = React.useState<string | null>(null);
    const [version1, setVersion1] = useState<VehicleVersion | undefined>(undefined);
    const [version2, setVersion2] = useState<VehicleVersion | undefined>(undefined);
    const [version3, setVersion3] = useState<VehicleVersion | undefined>(undefined);
    const [currentModalVersion, setCurrentModalVersion] = useState<'first' | 'second' | 'third' | null>(null);

    useEffect(() => {
        if (versions.length >= 1 && !version1)
            setVersion1(versions[0]);
        if (versions.length >= 2 && !version2)
            setVersion2(versions[1]);
        if (versions.length >= 3 && !version3)
            setVersion3(versions[2]);
    }, [versions]);

    const handlePresentModalPress = (version: 'first' | 'second' | 'third') => {
        SheetManager.show(ActionSheetIdEnum.VEHICLE_COMPARATOR_VERSIONS);
        setCurrentModalVersion(version);
    };

    const onSelectVersion = (versionId: number) => {
        const version = versions.find(v => v.id == versionId);
        switch (currentModalVersion) {
            case 'first':
                setVersion1(version);
                break;
            case 'second':
                setVersion2(version);
                break;
            case 'third':
                setVersion3(version);
                break;
        }
    }

    const onPress = () => {
        let message: string | null = null;
        if (versions.length >= 3 && (!version1 || !version2 || !version3))
            message = 'Debe seleccionar tres versiones para continuar';
        else if (versions.length >= 2 && (!version1 || !version2))
            message = 'Debe seleccionar dos versiones para continuar';
        else if (versions.length >= 1 && !version1)
            message = 'Debe seleccionar una versión para continuar';

        if (message) {
            setSnackBarMessage(message);
            return;
        }

        onAccept([version1!, version2!, version3!]);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Seleccione las versiones a comparar y presione aceptar</Text>
            <View style={styles.contentWrapper}>
                {/* Select One */}
                <View style={styles.selectWrapper}>
                    <Text style={styles.selectTitle}>Versión 1</Text>
                    <Select
                        title={version1?.name}
                        placeholder='Seleccione Version...'
                        onPress={() => handlePresentModalPress('first')}
                        onClearPress={() => setVersion1(undefined)}
                    />
                </View>

                {/* Select Two */}
                {versions && versions.length >= 2 &&
                    <>
                        <View style={styles.selectWrapper}>
                            <Text style={styles.selectTitle}>Versión 2</Text>
                            <Select
                                title={version2?.name}
                                placeholder='Seleccione Version...'
                                onPress={() => handlePresentModalPress('second')}
                                onClearPress={() => setVersion2(undefined)}
                            />
                        </View>
                    </>
                }

                {/* Select Three */}
                {versions && versions.length >= 3 &&
                    <>
                        <View style={styles.selectWrapper}>
                            <Text style={styles.selectTitle}>Versión 3</Text>
                            <Select
                                title={version3?.name}
                                placeholder='Seleccione Version...'
                                onPress={() => handlePresentModalPress('third')}
                                onClearPress={() => setVersion3(undefined)}
                            />
                        </View>
                    </>
                }

                <ButtonRound
                    onPress={onPress}
                    title='Comparar'
                    contentStyle={{ width: 350, marginTop: 12 }}
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
                <Text style={{ fontSize: RFValue(13) }}>
                    {snackBarMessage}
                </Text>
            </Snackbar>

            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.VEHICLE_COMPARATOR_VERSIONS}
                items={versions.map(v => { return { id: v.id!, name: v.name! } })}
                title={'Seleccione una versión del vehículo'}
                emptyItemsText={'El vehículo no cuenta con versiones para seleccionar'}
                onSelect={onSelectVersion}
                height={300}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: theme.colors.appBackground
    },
    title: {
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(14),
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        textAlign: 'center',
        marginHorizontal: 16
    },
    contentWrapper: {
        flex: 1,
        marginTop: 12,
        justifyContent: 'center'
    },
    selectWrapper: {
        width: 350,
        marginBottom: 18
    },
    selectTitle: {
        marginBottom: 4,
        fontSize: RFValue(12),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.darkGrey
    },
});

export default VehicleDetailComparatorSelection;