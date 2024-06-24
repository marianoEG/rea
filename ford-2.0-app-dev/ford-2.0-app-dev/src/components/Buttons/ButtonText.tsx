import * as React from 'react';
import { Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { theme } from '../../core/theme';
import { Fonts } from '../../utils/fonts';

type Props = {
    title: string;
    textColor?: string,
    fontSize?: number,
    fontFamily?: string,
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | undefined
} & Omit<React.ComponentProps<typeof Button>, "children">;

const ButtonText = ({
    title,
    textColor = theme.colors.accent,
    fontSize = RFValue(11),
    fontFamily = Fonts.FordAntennaWGLMedium,
    textTransform = 'uppercase',
    ...props
}: Props) => {
    return <Button
        mode="text"
        labelStyle={{
            fontSize: fontSize,
            fontFamily: fontFamily,
            color: textColor,
            textTransform: textTransform
        }}
        color={theme.colors.accent}
        {...props}
    >
        {title}
    </Button>
}

export default ButtonText;