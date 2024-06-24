import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Divider, Modal, Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { DefaultRootState, useDispatch, useSelector } from 'react-redux';
import { Fonts } from '../../utils/fonts';
import ButtonRound from '../Buttons/ButtonRound';
import { hideAboutModal } from '../../store/action/aboutModalAction';
import { getDeviceName, getVersion } from 'react-native-device-info';
import format from 'date-fns/format';

interface Info {
    deviceName?: string;
    lastSyncBase?: string;
    lastSyncCampaigns?: string;
    lastSyncCampaignSearches?: string;
    lastSyncGuests?: string;
    lastSyncForms?: string;
    quoteFormSynchronizedCount?: number;
    newsletterFormSynchronizedCount?: number;
    testDriveFormSynchronizedCount?: number;
    appVersion?: string;
}

interface Props {
    isVisible: boolean
}
const AboutModal = ({ isVisible }: Props) => {
    const dispatch = useDispatch();
    const [info, setInfo] = useState<Info>();
    const {
        lastSyncBaseDate,
        lastSyncCampaignsDate,
        lastSyncCampaignSearchesDate,
        lastSyncGuestsDate,
        lastSyncFormsDate,
        quoteFormSynchronizedCount,
        newsletterFormSynchronizedCount,
        testDriveFormSynchronizedCount
    } = useSelector((st: DefaultRootState) => st.persisted.lastSyncInfo);
    const { apiHost } = useSelector((st: DefaultRootState) => st.transient.environment);

    useEffect(() => {
        const getInfo = async () => {
            let deviceName: string | undefined = undefined;
            try {
                deviceName = await getDeviceName();
            }
            catch (err) {
                console.log('error to get device name:', JSON.stringify(err))
            }
            setInfo({
                deviceName,
                lastSyncBase: lastSyncBaseDate ? (format(lastSyncBaseDate, "dd/MM/yyyy HH:mm:ss")) : '',
                lastSyncCampaigns: lastSyncCampaignsDate ? (format(lastSyncCampaignsDate, "dd/MM/yyyy HH:mm:ss")) : '',
                lastSyncCampaignSearches: lastSyncCampaignSearchesDate ? (format(lastSyncCampaignSearchesDate, "dd/MM/yyyy HH:mm:ss")) : '',
                lastSyncGuests: lastSyncGuestsDate ? (format(lastSyncGuestsDate, "dd/MM/yyyy HH:mm:ss")) : '',
                lastSyncForms: lastSyncFormsDate ? (format(lastSyncFormsDate, "dd/MM/yyyy HH:mm:ss")) : '',
                quoteFormSynchronizedCount: quoteFormSynchronizedCount ?? 0,
                newsletterFormSynchronizedCount: newsletterFormSynchronizedCount ?? 0,
                testDriveFormSynchronizedCount: testDriveFormSynchronizedCount ?? 0,
                appVersion: getVersion()
            });
        }

        if (isVisible)
            getInfo();
    }, [isVisible])

    return (
        <Modal
            visible={isVisible}
            contentContainerStyle={styles.modal}
            dismissable={true}
            onDismiss={() => { dispatch(hideAboutModal()) }}
        >
            <Text
                style={styles.title}>
                Acerca de esta apliación
            </Text>
            <Divider
                style={{ width: '100%', height: RFValue(1) }}
            />





            <ScrollView contentContainerStyle={styles.content}>

                {/* Device name */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Nombre del dispositivo:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.deviceName ? info.deviceName : '-'}
                    </Text>
                </View>

                {/* Last sync base */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Última sincronización base:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.lastSyncBase ? info.lastSyncBase : '-'}
                    </Text>
                </View>

                {/* Last sync campaigns */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Última sincronización de campañas:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.lastSyncCampaigns ? info.lastSyncCampaigns : '-'}
                    </Text>
                </View>

                {/* Last sync campaign searches */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Última sincronización de búsquedas:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.lastSyncCampaignSearches ? info.lastSyncCampaignSearches : '-'}
                    </Text>
                </View>

                {/* Last sync guests */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Última sincronización de invitados:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.lastSyncGuests ? info.lastSyncGuests : '-'}
                    </Text>
                </View>

                {/* Last sync forms */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Última sincronización de formularios:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.lastSyncForms ? info.lastSyncForms : '-'}
                    </Text>
                </View>

                {/* Quote form sync count */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Formularios de cotización enviados:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.quoteFormSynchronizedCount ? info.quoteFormSynchronizedCount : '0'}
                    </Text>
                </View>

                {/* Newsletter form sync count */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Formularios de newsletter enviados:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.newsletterFormSynchronizedCount ? info.newsletterFormSynchronizedCount : '0'}
                    </Text>
                </View>

                {/* TestDrive form sync count */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Formularios de test drive enviados:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.testDriveFormSynchronizedCount ? info.testDriveFormSynchronizedCount : '0'}
                    </Text>
                </View>

                {/* App version */}
                <View style={styles.keyValueWrapper}>
                    <Text style={styles.keyText}>
                        Versión de la app:
                    </Text>
                    <Text style={styles.valueText}>
                        {info?.appVersion ? info.appVersion : '-'}
                    </Text>
                </View>

                {/* Environment */}
                <View style={[styles.keyValueWrapper, { marginBottom: 0 }]}>
                    <Text style={styles.keyText}>
                        API de FordEventos:
                    </Text>
                    <Text style={styles.valueText}>
                        {apiHost ? apiHost : '-'}
                    </Text>
                </View>
            </ScrollView>

            <Divider
                style={{ width: '100%', height: RFValue(1), marginBottom: 24 }}
            />
            <ButtonRound
                title='Cerrar'
                onPress={() => { dispatch(hideAboutModal()) }}
                contentStyle={{ alignSelf: 'center', width: '50%' }}
            />
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        width: '90%',
        maxHeight: '90%',
        backgroundColor: 'white',
        padding: 24,
        alignSelf: 'center',
        borderRadius: 12
    },
    title: {
        textAlign: 'center',
        fontSize: RFValue(18),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLRegular,
        marginBottom: 6
    },
    content: {
        paddingVertical: 38,
        paddingHorizontal: 8
    },
    keyValueWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 28
    },
    keyText: {
        textAlign: 'left',
        fontSize: RFValue(13),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLRegular
    },
    valueText: {
        textAlign: 'left',
        flexShrink: 1,
        fontSize: RFValue(12),
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        marginStart: 8
    }
});

export default AboutModal;