import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Modal, ProgressBar, Text } from 'react-native-paper';
import { widthPercentageToDP } from '../../utils/Size';
import { theme } from '../../core/theme';
import { FormTypeEnum, SyncFormStatus } from '../../utils/constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';

interface Props {
    isVisible: boolean,
    syncingStatus?: SyncFormStatus
}
const SyncFormsModal = ({ isVisible, syncingStatus }: Props) => {

    const getSyncStatusStr = (): string => {
        switch (syncingStatus) {
            case SyncFormStatus.CONNECTING:
                return 'Conectando con el servidor';
            case SyncFormStatus.SYNCING_QUOTE:
                return 'Sincronizando formularios de cotización';
            case SyncFormStatus.SYNCING_NEWSLETTER:
                return 'Sincronizando formularios de newsletter';
            case SyncFormStatus.SYNCING_TESTDRIVE:
                return 'Sincronizando formularios de testdrive';
            case SyncFormStatus.DELETING_FILES:
                return 'Elimiando imágenes de firma';
            default:
                return '';
        }
    }

    return (
        <Modal visible={isVisible} contentContainerStyle={styles.modal} dismissable={false}>
            <Text style={styles.title}>Sincronización de formularios</Text>

            <Divider style={{ width: '100%', height: RFValue(1) }} />

            <Text style={styles.subtitle}>
                Por favor no cierre la app ni apague el dispositivo.
            </Text>
            <View style={styles.progressWrapper}>
                <ProgressBar style={styles.progressIndicator} indeterminate color={theme.colors.accent} />
                <Text style={styles.progressText}>{getSyncStatusStr()}</Text>
            </View>
        </Modal >
    )
}

const styles = StyleSheet.create({
    modal: {
        width: '85%',
        backgroundColor: 'white',
        padding: 18,
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
    subtitle: {
        textAlign: 'center',
        fontSize: RFValue(13),
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLRegular,
        marginTop: 18,
        marginBottom: 36,
        marginHorizontal: 14
    },
    progressWrapper: {
        marginTop: 24,
        marginBottom: 36,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressIndicator: {
        width: widthPercentageToDP('50'),
        marginBottom: 8,
    },
    progressText: {
        textAlign: 'center',
        //fontSize: heightPercentageToDP("1.8%"),
        fontSize: RFValue(12),
        //fontWeight: '400',
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.accent,
        marginBottom: 16
    }
});

export default SyncFormsModal;