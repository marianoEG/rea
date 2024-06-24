import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../core/theme';
import { Fonts } from '../utils/fonts';
import ButtonIcon from './Buttons/ButtonIcon';

type Props = {
    title?: string;
    onPress: () => void;
    rippleColor?: string,
    borderColor?: string,
    iconColor?: string,
    iconSize?: number,
    fontColor?: string,
    fontSize?: number,
    fontFamily?: string,
    placeholder?: string,
    backgroundColor?: string,
    onClearPress?: () => void
    disabled?: boolean
};

const Select = ({
    title,
    onPress,
    rippleColor,
    borderColor = '#0000009A',
    iconColor = '#000000',
    iconSize = 24,
    fontColor = '#000000',
    fontSize = RFValue(10.5),
    fontFamily = Fonts.FordAntennaWGLRegular,
    placeholder = '',
    backgroundColor = '#fff',
    onClearPress,
    disabled = false,
}: Props) => {
    return (
        <TouchableRipple
            onPress={onPress}
            borderless
            rippleColor={rippleColor}
            disabled={disabled}>
            <View style={[styles.selectWrapper, { borderColor: borderColor, backgroundColor: backgroundColor ? backgroundColor : theme.colors.transparent }]}>
                <Text style={[
                    {
                        fontSize: title ? fontSize : RFValue(11),
                        fontFamily: title ? fontFamily : Fonts.FordAntennaWGLLight,
                        color: disabled
                            ? theme.colors.disable
                            : (title
                                ? fontColor
                                : theme.colors.darkGrey
                            )

                    }
                ]}
                >
                    {title ? title : placeholder}
                </Text>
                <View style={{ flex: 1 }}></View>
                {
                    onClearPress && title
                        ?
                        <ButtonIcon
                            icon='clear'
                            onPress={onClearPress}
                            size={16}
                            color={iconColor}
                            disabled={disabled}
                        />
                        :
                        <></>
                }
                <Icon
                    name='arrow-drop-down'
                    color={disabled ? theme.colors.disable : iconColor}
                    size={iconSize} />
            </View>
        </TouchableRipple >
    )
}

const styles = StyleSheet.create({
    selectWrapper: {
        backgroundColor: theme.colors.transparent,
        paddingVertical: 6,
        height: 45,
        paddingHorizontal: 12,
        borderRadius: 5,
        borderWidth: RFValue(1),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
})

export default Select;