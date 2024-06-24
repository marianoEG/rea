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
} & Omit<React.ComponentProps<typeof Button>, "children">;

const ButtonRaised = ({
    title,
    textColor = theme.colors.textLight,
    fontSize = RFValue(11),
    fontFamily = Fonts.FordAntennaWGLMedium,
    ...props
}: Props) => {
    return <Button
        mode="contained"
        labelStyle={{
            fontSize: fontSize,
            fontFamily: fontFamily,
            color: textColor
        }}
        color={theme.colors.primary}
        {...props}
    >
        {title}
    </Button>
}

export default ButtonRaised;