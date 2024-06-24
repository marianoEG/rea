import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { theme } from '../core/theme';
import { Fonts } from '../utils/fonts';
import { getConfiguration } from '../utils/db';
import { useDbContext } from '../context/DbContext';
import { WebView } from 'react-native-webview';
import { ActivityIndicator } from 'react-native-paper';

const ContactInformation = () => {
    const [isGettingContactInfo, setIsGettingContactInfo] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [contactInfo, setContactInfo] = useState<string>("");
    const { db } = useDbContext();

    useEffect(() => {
        const getConactInfoFromDb = async () => {
            const config = await getConfiguration(db!);
            setIsError(!config?.contactData);
            setContactInfo(config?.contactData ?? '');
            setIsGettingContactInfo(false);
        }
        getConactInfoFromDb();
    }, []);

    if (isGettingContactInfo) {
        return (
            <View style={styles.loadingWrapper}>
                <ActivityIndicator
                    size='large'
                    color={theme.colors.accent}
                />
                <Text style={styles.loadingText}>
                    Obteniendo información de contacto...
                </Text>
            </View>
        )
    }

    if (!isGettingContactInfo && (isError || !contactInfo)) {
        return (
            <View style={styles.infoNotFoundWrapper}>
                <Text style={styles.infoNotFoundText}>
                    No se encontró información de contacto
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <WebView
                    originWhitelist={['*']}
                    style={styles.webview}
                    source={{ html: contactInfo }}
                    onError={() => setIsError(true)}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
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
    //#region Not Found Vehicle
    infoNotFoundWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.appBackground
    },
    infoNotFoundText: {
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    },
    //#endregion
    container: {
        flex: 1,
        backgroundColor: theme.colors.appBackground
    },
    webview: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.appBackground
    }
});

export default ContactInformation;