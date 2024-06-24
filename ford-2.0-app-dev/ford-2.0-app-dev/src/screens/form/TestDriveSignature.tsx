import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Platform, Alert } from 'react-native';
import ButtonRound from '../../components/Buttons/ButtonRound';
import SignatureView from '../../components/SignatureView';
import { theme } from '../../core/theme';
import PDFView from 'react-native-view-pdf';
import { useTestDriveSignature } from '../../hooks/useTestDriveSignature';
import { ActivityIndicator } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import { widthPercentageToDP } from '../../utils/Size';
import { SIGNATURE_OPTIONS } from '../../utils/constants';

const TestDriveSignature = () => {
    const {
        defaultSignature,
        signature,
        setSignature,
        isLoadingPdf,
        loadingPdfFinished,
        pdfResource,
        saveForm,
        isSavingForm
    } = useTestDriveSignature();

    const onPdfError = (error: string) => {
        loadingPdfFinished();
        Alert.alert(
            "Error al leer el pdf",
            "Ocurrió un error al intentar abrir el pdf: " + error,
            [{ text: "Cerrar" }]
        );
    }

    return (
        <View style={styles.container}>
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
            <View style={styles.pdfWrapper}>
                {
                    // pdfBase64
                    // &&
                    // <PDFView
                    //     fadeInDuration={250.0}
                    //     style={styles.pdf}
                    //     resource={pdfBase64}
                    //     resourceType='base64'
                    //     onLoad={loadingPdfFinished}
                    //     onError={(error) => onPdfError(error.message)}
                    // />

                    pdfResource && pdfResource.file
                    &&
                    <PDFView
                        fadeInDuration={250.0}
                        style={styles.pdf}
                        fileFrom='libraryDirectory'
                        resource={pdfResource.file}
                        resourceType={pdfResource.resourceType}
                        onLoad={loadingPdfFinished}
                        onError={(error) => onPdfError(error.message)}
                    />
                }
            </View>
            <Text style={styles.signatureTextHint}>
                Firme aquí confirmando que acepta los términos y condiciones de uso
            </Text>
            <View style={[styles.signatureWrapper, { width: SIGNATURE_OPTIONS.width, height: SIGNATURE_OPTIONS.height }]}>
                <SignatureView
                    defaultValue={defaultSignature}
                    showClearButton={true}
                    onClear={() => setSignature(undefined)}
                    onDrawEnd={signature => setSignature(signature)}
                />
            </View>
            <ButtonRound
                isLoading={isSavingForm}
                loadingText={'Guardando'}
                title='Guardar'
                contentStyle={{ width: '50%', alignSelf: 'center' }}
                onPress={saveForm}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: theme.colors.appBackground,
        padding: 12
    },
    loadingWrapper: {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
        zIndex: 10
    },
    loadingText: {
        marginTop: 8,
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.textDark
    },
    pdfWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.appBackground
    },
    signatureTextHint: {
        marginTop: 12,
        textAlign: 'center',
        fontSize: RFValue(12),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark,
        marginHorizontal: 64
    },
    signatureWrapper: {
        width: 400,
        height: 200,
        alignSelf: 'center',
        margin: 12,
        marginTop: 0,
    }
});

export default TestDriveSignature;