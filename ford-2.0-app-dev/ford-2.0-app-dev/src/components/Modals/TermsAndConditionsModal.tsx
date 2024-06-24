import React, { useState, useEffect } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, Modal, Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import { Fonts } from '../../utils/fonts';
import { hideTermsModal } from '../../store/action/termsModalAction';
import ButtonRound from '../Buttons/ButtonRound';
import { useDbContext } from '../../context/DbContext';
import PDFView from 'react-native-view-pdf';
import { getConfiguration } from '../../utils/db';
import { TermsModalType } from '../../store/reducer/termsModalReducer';
import { PlatformEnum } from '../../utils/constants';

interface PdfResource {
    resourceType?: 'url' | 'base64' | 'file';
    file?: string;
}

const pdfResourceDefault: PdfResource = {
    resourceType: undefined,
    file: undefined
}

interface Props {
    isVisible: boolean;
    type: TermsModalType;
}
const TermsAndConditionsModal = ({ isVisible, type }: Props) => {
    const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
    const [pdfResource, setPdfResource] = useState<PdfResource>(pdfResourceDefault);
    const dispatch = useDispatch();
    const { db } = useDbContext();

    const closeModal = () => {
        setIsLoadingPdf(false);
        setPdfResource(pdfResourceDefault);
        dispatch(hideTermsModal());
    }

    const getConfiguraitonsFromDB = async () => {
        setIsLoadingPdf(true);
        try {
            const config = await getConfiguration(db!);
            let pdfPath: string | undefined = undefined;
            switch (type) {
                case 'quote':
                    pdfPath = config?.quoteUrl;
                    break;
                case 'newsletter':
                    pdfPath = config?.newsletterUrl;
                    break;
                case 'test-drive':
                    pdfPath = config?.testDriveTermsUrl;
                    break;
            }

            let pdfSafe: string | undefined = undefined;
            if (Platform.OS == PlatformEnum.ANDROID) {
                pdfSafe = pdfPath?.replace('data:application/octet-stream;base64,', '');
                setPdfResource({
                    resourceType: 'base64',
                    file: pdfSafe,
                });
            } else {
                pdfSafe = pdfPath?.split('/')?.pop();
                setPdfResource({
                    resourceType: 'file',
                    file: pdfSafe,
                });
            }
            if (!pdfSafe) {
                Alert.alert(
                    "Archivo no encontrado",
                    "No se encontraron términos y condiciones",
                    [{ text: "Cerrar", onPress: () => { closeModal() } }]
                );
            }

        } catch (err) {
            console.log("Base64 File Err:", err);
            onPdfError('', true);
        }
    }

    useEffect(() => {
        if (isVisible) {
            getConfiguraitonsFromDB();
        }
    }, [isVisible]);

    const onPdfLoaded = () => {
        setIsLoadingPdf(false);
    }

    const onPdfError = (error: string, hideModal: boolean = false) => {
        Alert.alert(
            "Error al leer el pdf",
            "Ocurrió un error al intentar abrir el pdf: " + error,
            [{
                text: "Cerrar", onPress: () => {
                    if (hideModal)
                        closeModal()
                }
            }]
        );
    }

    return (
        <Modal
            visible={isVisible}
            contentContainerStyle={styles.modal}
            dismissable={true}
            onDismiss={closeModal}
        >
            <Text
                style={styles.title}>
                Términos y condiciones de uso
            </Text>
            <Divider
                style={{ width: '100%', height: RFValue(1) }}
            />

            <View style={{ flex: 1, paddingVertical: 12 }}>
                {
                    isLoadingPdf
                    &&
                    <View style={styles.loadingWrapper}>
                        <ActivityIndicator
                            size={36}
                            color={theme.colors.textDark}
                        />
                        <Text style={styles.loadingText}>
                            Abriendo términos y condiciones...
                        </Text>
                    </View>
                }

                {
                    pdfResource && pdfResource.file
                    &&
                    <PDFView
                        fadeInDuration={250.0}
                        style={styles.pdf}
                        fileFrom='libraryDirectory'
                        resource={pdfResource.file}
                        resourceType={pdfResource.resourceType}
                        onLoad={onPdfLoaded}
                        onError={(error) => onPdfError(error.message, true)}
                    />
                }
            </View>

            <ButtonRound
                title='Cerrar'
                onPress={closeModal}
                contentStyle={{ alignSelf: 'center', width: '50%' }}
            />
        </Modal >
    )
}

const styles = StyleSheet.create({
    modal: {
        width: '85%',
        height: '95%',
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
    loadingWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
    loadingText: {
        marginTop: 8,
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.textDark
    },
    pdf: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    }
});

export default TermsAndConditionsModal;