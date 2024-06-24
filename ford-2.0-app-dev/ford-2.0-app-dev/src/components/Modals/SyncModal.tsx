import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Divider, Modal, ProgressBar, Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { useSync } from '../../hooks/useSync';
import { SyncStatusEnum } from '../../utils/constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { DefaultRootState, useSelector } from 'react-redux';
import { Fonts } from '../../utils/fonts';
import ButtonText from '../Buttons/ButtonText';
import { widthPercentageToDP } from '../../utils/Size';

interface Props {
    isVisible: boolean
}
const SyncModal = ({ isVisible }: Props) => {
    const {
        getSyncStatusStr,
        isSyncError,
        startBaseSync,
        startCampaignSync,
        startFullSync,
        retrySync,
        closeModal
    } = useSync();
    const { isSynchronizingBaseData, isSynchronizingCampaignData, isSynchronizingFullData } = useSelector((st: DefaultRootState) => st.transient.sync);
    const [isErrorDetailVisible, setIsErrorDetailVisible] = useState<boolean>(false);

    const syncDefaultContent = (
        <>
            <Text style={styles.subtitle}>
                Seleccione que información desea descargar
            </Text>

            <View style={styles.rowContainer}>
                <View style={styles.containerLogo}>
                    <Image
                        source={require('../../assets/img/icons/DatosBaseIcon.png')}
                        resizeMode='contain'
                        style={styles.logo}
                    />
                    <Text style={styles.titleLogo}>DATOS BASE</Text>
                </View>
                <Divider style={{ width:  RFValue(1), height: '100%', marginTop: 12, marginHorizontal: 15 }} />
                <View style={styles.buttonWrapper}>
                    <Text style={styles.buttonHint}>
                        (Eventos, Invitados, Vehículos, Concecionarios, Provincias, Localidades, Imágenes, Archivos PDF)
                    </Text>
                    <ButtonText
                        style={styles.downloadBtn}
                        title='Descargar'
                        textColor={'white'}
                        textTransform='none'
                        
                        onPress={startBaseSync}
                    />
                </View>
            </View>

            <View style={styles.rowContainer}>
                <View style={styles.containerLogo}>
                    <Image
                        source={require('../../assets/img/icons/CampanasIcon.png')}
                        resizeMode='contain'
                        style={styles.logo}
                        />
                    <Text style={styles.titleLogo}>CAMPAÑAS</Text>
                </View>
                <Divider style={{ width:  RFValue(1), height: '100%', marginTop: 12, marginHorizontal: 15 }} />
                <View style={styles.buttonWrapper}>
                    <Text style={styles.buttonHint}>
                        (Campañas para realizar búsquedas.{'\n'}Este proceso puede demorar varios minutos)
                    </Text>
                    <ButtonText
                        style={styles.downloadBtn}
                        title='Descargar'
                        textColor={'white'}
                        textTransform='none'
                        fontSize={18}
                        onPress={startCampaignSync}
                    />
                </View>
            </View>

            <View style={styles.rowContainer}>
                <View style={styles.containerLogo}>
                    <Image
                        source={require('../../assets/img/icons/ALLicon.png')}
                        resizeMode='contain'
                        style={styles.logo}
                    />
                    <Text style={styles.titleLogo}>TODO</Text>
                </View>
                <Divider style={{ width:  RFValue(1), height: '100%', marginTop: 12, marginHorizontal: 15 }} />
                <View style={styles.buttonWrapper}>
                    <Text style={styles.buttonHint}>
                        (Realiza ambas descargar: Datos Base y Campañas.{'\n'}Este proceso puede demorar varios minutos)
                    </Text>
                    <ButtonText
                        style={styles.downloadBtn}
                        title='Descargar'
                        textColor={'white'}
                        fontSize={18}
                        textTransform='none'
                        onPress={startFullSync}
                    />
                </View>
            </View>
        </>
    )

    const syncProgressContent = (
        <>
            <Text style={styles.subtitle}>
                Por favor no cierre la app ni apague el dispositivo.
            </Text>
            <View style={styles.progressWrapper}>
                <ProgressBar style={styles.progressIndicator} indeterminate color={theme.colors.accent} />
                <Text style={styles.progressText}>{getSyncStatusStr()}</Text>
            </View>
        </>
    )

    const syncErrorContent = (
        <>
            <Text style={styles.errorText}>Ocurrió un error en la sincronización</Text>
            <View style={styles.buttonWrapper}>
                <ButtonText
                    title='Reintentar'
                    onPress={() => {
                        setIsErrorDetailVisible(false)
                        retrySync()
                    }}
                />
            </View>
            {
                isErrorDetailVisible &&
                <View style={{ height: 200 }}>
                    <ScrollView>
                        <Text style={styles.errorDetailText}>{getSyncStatusStr()}</Text>
                    </ScrollView>
                </View>
            }
            <View style={[styles.buttonWrapper, { marginBottom: 0 }]}>
                <ButtonText
                    title={isErrorDetailVisible ? 'Ocultar detalles del error' : 'Ver detalles del error'}
                    textColor={theme.colors.darkGrey}
                    textTransform='capitalize'
                    onPress={() => setIsErrorDetailVisible(!isErrorDetailVisible)}
                />
            </View>
        </>
    )

    let content: JSX.Element;
    if (isSynchronizingBaseData || isSynchronizingCampaignData || isSynchronizingFullData)
        content = syncProgressContent;
    else if (isSyncError()) {
        content = syncErrorContent;
    }
    else content = syncDefaultContent;


    return (
        <Modal visible={isVisible} contentContainerStyle={styles.modal} dismissable={false}>
            <Text style={styles.title}>Descarga de datos</Text>
            <Divider style={{ width: '100%', height: RFValue(1) }} />
            <>{content}</>
            <Divider style={{ width: '100%', height: RFValue(1), marginTop: 12 }} />
            <View style={{marginBottom: 0 }}>
                <ButtonText
                    style={styles.closeButton}
                    title='Cerrar'
                    disabled={isSynchronizingBaseData || isSynchronizingCampaignData || isSynchronizingFullData}
                    textColor={theme.colors.primary}
                    onPress={closeModal}
                />
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
        borderRadius: 12,
        justifyContent: 'flex-start'
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
        //fontSize: heightPercentageToDP("1.75%"),
        fontSize: RFValue(13),
        color: theme.colors.darkGrey,
        //fontWeight: '400',
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
    },
    buttonWrapper: {
        display: 'flex',
        width: '70%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 10
    },
    buttonHint: {
        textAlign: 'left',
        fontSize: RFValue(11),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLExtraLight,
        marginTop: -5,
        marginVertical: 5,
        marginHorizontal:10
    },
    closeButton: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 12
    },
    errorText: {
        marginTop: 48,
        textAlign: 'center',
        //fontSize: heightPercentageToDP("2%"),
        fontSize: RFValue(13),
        //fontWeight: '400',
        fontFamily: Fonts.FordAntennaWGLRegular
    },
    errorDetailText: {
        textAlign: 'left',
        fontSize: RFValue(11),
        fontWeight: '100',
        fontFamily: Fonts.FordAntennaWGLLight
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    containerLogo:{
        width: '25%',
        display:'flex',
        alignItems: 'center'
    },
    logo: {
        justifyContent: 'center',
        width: 50, // Ajusta según el tamaño deseado
        height: 50, // Ajusta según el tamaño deseado
        marginRight: 10,
    },
    titleLogo: {
        fontSize: 25,
        color: theme.colors.primary,
        fontWeight:'600'
    },
    downloadBtn:{
        width: '45%',
        fontSize:10,
        marginHorizontal:10,
        marginVertical: 10,
        borderRadius: 50,
        backgroundColor:theme.colors.primary,
    }
});

export default SyncModal;