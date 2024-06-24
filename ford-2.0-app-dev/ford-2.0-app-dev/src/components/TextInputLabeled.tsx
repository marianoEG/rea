import * as React from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { theme } from '../core/theme';
import { Fonts } from '../utils/fonts';

type Props = {
    type?: 'flat' | 'outlined',
    placeholder?: string,
    placeholderColor?: string,
    textColor?: string,
    fontSize?: number,
    fontFamily?: string,
    title?: string;
    titleStyle?: StyleProp<TextStyle>,
    conatinerStyle?: StyleProp<ViewStyle>,
    backgroundColor?: string
} & Omit<React.ComponentProps<typeof TextInput>, "children">;

const TextInputLabeled = ({
    title = '',
    type = 'outlined',
    placeholder = '',
    placeholderColor = theme.colors.darkGrey,
    textColor = theme.colors.textDark,
    fontSize = RFValue(10.5),
    fontFamily = Fonts.FordAntennaWGLMedium,
    titleStyle = {
        fontSize: RFValue(10.5),
        fontFamily: Fonts.FordAntennaWGLMedium,
        color: theme.colors.darkGrey
    },
    conatinerStyle,
    backgroundColor = '#fff',
    ...props
}: Props) => {
    return (
        <View style={[conatinerStyle]}>
            {
                title
                    ?
                    <Text
                        style={[titleStyle]}
                    >
                        {title}
                    </Text>
                    :
                    null
            }
            <TextInput
                label={''}
                {...props}
                dense
                mode={type}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                theme={{
                    ...theme,
                    colors: {
                        ...theme.colors,
                        text: textColor
                    }
                }}
                style={[
                    { backgroundColor: backgroundColor ? backgroundColor : theme.colors.transparent },
                    props.style,
                    !props.multiline && { height: 44 },
                    { textAlignVertical: 'center', },
                    {
                        fontSize: fontSize,
                        fontFamily: fontFamily,
                        color: textColor,
                    }
                ]}
            />
        </View>
    )
}

export default TextInputLabeled;