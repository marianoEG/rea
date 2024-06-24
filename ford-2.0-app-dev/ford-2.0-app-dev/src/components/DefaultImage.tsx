import React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../core/theme';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../utils/fonts';

interface Props {
    backgroundColor?: string;
    text?: string;
    textColor?: string;
    textSize?: number;
    imageWidth?: number;
    imageHeight?: number;
    containerStyle?: StyleProp<ViewStyle>;
}
const DefaultImage = ({
    backgroundColor = theme.colors.transparent,
    text = undefined,
    textColor = theme.colors.textDark,
    //textSize = heightPercentageToDP('1.5%'),
    textSize = RFValue(18),
    imageWidth = 96,
    imageHeight = 96,
    containerStyle
}: Props) => {
    const defaultImagePath: string = '../assets/img/image_not_found.png';

    return (
        <View style={[{ backgroundColor }, styles.container, containerStyle]}>
            <Image source={require(defaultImagePath)}
                resizeMode="contain"
                style={{ width: imageWidth, height: imageHeight }} />
            {text &&
                <Text style={[{ color: textColor, fontSize: textSize }, styles.text]}>
                    {text}
                </Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        marginTop: 8,
        textAlign: 'center',
        fontFamily: Fonts.FordAntennaWGLLight
    }
});

export default DefaultImage;