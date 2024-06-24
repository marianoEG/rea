import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Modal, Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import { Fonts } from '../../utils/fonts';
import { FormSavedmodalType } from '../../store/reducer/FormSavedSuccessModalReducer';
import { hideFormSavedSuccessModal } from '../../store/action/formSavedSuccessModalAction';
import ButtonRound from '../Buttons/ButtonRound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../navigation/Screens';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../utils/rootNavigation';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface Props {
    isVisible: boolean;
    formType: FormSavedmodalType;
}
const FormSavedSuccessModal = ({ isVisible, formType = undefined }: Props) => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();

    const iconAnimation = useSharedValue({ opacity: 0 });
    const iconAnimationStyle = useAnimatedStyle(() => ({
        transform: [{
            scale: withTiming(iconAnimation.value.opacity, { duration: 300 })
        }]
    }))

    const thanksAnimation = useSharedValue({ opacity: 0, translateX: 75 });
    const thanksAnimationStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: withTiming(thanksAnimation.value.translateX, { duration: 300 })
        }],
        opacity: withTiming(thanksAnimation.value.opacity, { duration: 300 })
    }))

    const textAnimation = useSharedValue({ opacity: 0, translateY: 50 });
    const textAnimationStyle = useAnimatedStyle(() => ({
        opacity: withTiming(textAnimation.value.opacity, { duration: 400, }),
        transform: [{
            translateY: withTiming(textAnimation.value.translateY, { duration: 300 })
        }],
    }))

    useEffect(() => {
        if (isVisible) {
            iconAnimation.value = { opacity: 1 };
            thanksAnimation.value = { opacity: 1, translateX: 0 };
            textAnimation.value = { opacity: 1, translateY: 0 };
        }
        return () => {
            iconAnimation.value = { opacity: 0 };
            thanksAnimation.value = { opacity: 0, translateX: 100 };
            textAnimation.value = { opacity: 0, translateY: 50 };
        }
    }, [isVisible])

    const getTitle = (): string => {
        switch (formType) {
            case 'quote':
                return 'Formulario de cotización';
            case 'test-drive':
                return 'Formulario de testdrive';
            case 'newsletter':
                return 'Formulario de newsletter';
            default:
                return '';
        }
    }

    const navigateAndClose = () => {
        navigation.navigate(Screens.Home);
        dispatch(hideFormSavedSuccessModal());

    }

    return (
        <Modal
            visible={isVisible}
            contentContainerStyle={styles.modal}
            dismissable={false}
        >
            <Text
                style={styles.title}>
                {getTitle()}
            </Text>
            <Divider style={{ width: '100%', height: RFValue(1) }} />
            {/* <View style={{ flex: 1 }}></View> */}
            <Animated.View style={[iconAnimationStyle]}>
                <Icon
                    style={styles.icon}
                    name='check-circle'
                    size={160}
                    color={theme.colors.success}
                />
            </Animated.View>
            <Animated.View style={thanksAnimationStyle}>
                <Text style={styles.thanks} >
                    ¡Gracias!
                </Text>
            </Animated.View>
            <Animated.View style={textAnimationStyle}>
                <Text style={styles.text} >
                    La información se guardo correctamente.
                    Es necesario sincronizar los formularios para que se envie la información
                </Text>
            </Animated.View>
            <View style={{ flex: 1 }}></View>
            <ButtonRound
                title='Continuar'
                contentStyle={[{
                    alignSelf: 'center',
                    width: '50%',
                }]}
                onPress={navigateAndClose}
            />
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        width: '85%',
        height: '75%',
        maxHeight: '100%',
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
    icon: {
        alignSelf: 'center',
        marginTop: 64
    },
    thanks: {
        textAlign: 'center',
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLRegular,
        marginHorizontal: 14
    },
    text: {
        textAlign: 'center',
        fontSize: RFValue(14),
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLRegular,
        marginHorizontal: 14,
        marginTop: 64
    }
});

export default FormSavedSuccessModal;