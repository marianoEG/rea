import React from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { theme } from '../core/theme';
import { showSyncModal } from '../store/action/syncModalAction';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../utils/fonts';
import ButtonRound from '../components/Buttons/ButtonRound';
import { showAboutModal } from '../store/action/aboutModalAction';

const SyncNotFound = () => {

    const dispatch = useDispatch();

    const onSyncPress = () => {
        dispatch(showSyncModal());
    }

    const showAboutModalInfo = () => {
        dispatch(showAboutModal());
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.appBackground }}>
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => showAboutModalInfo()}
                >
                    <Image
                        source={require('../assets/img/logo/oval_blue.png')}
                        resizeMode='contain'
                        style={styles.logo}
                    />
                </TouchableWithoutFeedback>
                <View style={styles.textWrapper}>
                    <Text style={styles.text}>
                        No se encontraron datos en el dispositivo.
                    </Text>
                    <Text style={styles.text}>
                        Antes de comenzar es necesario realizar una sincronización.
                    </Text>
                </View>
                <ButtonRound
                    title='Sincronizar datos'
                    iconName={'chevron-right'}
                    onPress={onSyncPress}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 192,
    },
    logoWrapper: {
        width: '90%',
        maxWidth: '90%',
        height: 150
    },
    logo: {
        resizeMode: 'contain',
        width: 300,
        maxWidth: '90%',
        height: 150
    },
    textWrapper: {
        marginTop: 60,
        marginBottom: 90
    },
    text: {
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLRegular,
        textAlign: 'center',
        color: theme.colors.primary
    },
    button: {
        marginTop: 24,
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
        borderRadius: 50
    }
});

export default SyncNotFound;