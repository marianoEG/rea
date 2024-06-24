import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../core/theme';

interface Props {
    icon: string;
    onPress?: () => void;
    color?: string;
    disabled?: boolean;
    size?: number;
    style?: StyleProp<ViewStyle>;
}
const ButtonIcon = ({ icon, onPress, color = theme.colors.accent, disabled = false, size = 28, style }: Props) => {

    return (
        <TouchableRipple
            onPress={onPress}
            rippleColor={color + '20'}
            borderless
            disabled={disabled}
            style={[styles.container, style]}>
            <Icon
                name={icon}
                color={disabled ? theme.colors.disable : color}
                size={size} />
        </TouchableRipple>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 200,
        padding: 6
    }
});

export default ButtonIcon;