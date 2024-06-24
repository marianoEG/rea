import * as React from 'react';
import { StyleSheet, Text, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { ActivityIndicator, Button, TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../core/theme';
import { Fonts } from '../../utils/fonts';

type Props = {
    title: string;
    textStyle?: StyleProp<TextStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    backgroundColor?: string;
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
    iconStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
    rippleColor?: string;
    onPress?: () => void;
    reverse?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    isTransparent?: boolean;
    paddingHorizontal?: number;
};

const ButtonRound = ({
    title,
    textStyle,
    contentStyle,
    backgroundColor,
    iconName,
    iconSize,
    iconColor,
    iconStyle,
    disabled,
    rippleColor,
    onPress,
    reverse = false,
    isLoading = false,
    loadingText = '',
    isTransparent = false,
    paddingHorizontal = 36
}: Props) => {
    return (
        <TouchableRipple
            style={[contentStyle, { borderRadius: 50 }]}
            borderless
            rippleColor={rippleColor ? rippleColor : theme.colors.textLight + '2B'}
            onPress={onPress}
            disabled={disabled || isLoading}
        >
            <View style={[
                styles.container,
                {
                    flexDirection: reverse ? 'row-reverse' : 'row',
                    backgroundColor: backgroundColor ?? theme.colors.primary,
                    paddingHorizontal: paddingHorizontal
                },
                disabled && { backgroundColor: '#DCDCDC' },
                isTransparent && { shadowColor: theme.colors.transparent, backgroundColor: theme.colors.transparent }
            ]}>
                {
                    isLoading
                        ?
                        <>
                            {
                                loadingText
                                    ?
                                    <Text style={[
                                        styles.text,
                                        textStyle,
                                        disabled && { color: '#00000042' }
                                    ]}>
                                        {loadingText}
                                    </Text>
                                    :
                                    <></>
                            }
                            <ActivityIndicator
                                style={{ marginLeft: reverse ? 0 : 18, marginRight: reverse ? 18 : 0 }}
                                color={
                                    disabled
                                        ? '#00000042'
                                        : (
                                            iconColor
                                                ? iconColor
                                                : theme.colors.textLight
                                        )
                                }
                            />
                        </>
                        :
                        <>
                            <Text style={[
                                styles.text,
                                textStyle,
                                disabled && { color: '#00000042' }
                            ]}>
                                {title}
                            </Text>
                            {
                                iconName
                                    ?
                                    <Icon
                                        style={[
                                            { marginLeft: reverse ? 0 : 18, marginRight: reverse ? 18 : 0 },
                                            iconStyle
                                        ]}
                                        name={iconName}
                                        color={
                                            disabled
                                                ? '#00000042'
                                                : (
                                                    iconColor
                                                        ? iconColor
                                                        : theme.colors.textLight
                                                )
                                        }
                                        size={iconSize ? iconSize : 24}
                                    />
                                    :
                                    null
                            }
                        </>
                }
            </View>
        </TouchableRipple>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    text: {
        fontSize: RFValue(12.5),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.textLight,
        //marginRight: 18
    }
})

export default ButtonRound;