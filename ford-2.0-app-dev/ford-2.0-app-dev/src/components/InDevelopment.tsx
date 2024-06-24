
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../utils/fonts';

const InDevelopment = () => {

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Icon
                name='construction'
                color={theme.colors.disable}
                size={192} />
            <Text style={{
                color: theme.colors.disable,
                fontSize: RFValue(19),
                marginTop: 12,
                textAlign: 'center',
                fontFamily: Fonts.FordAntennaWGLLight,
            }}>
                Esta pantalla se encuentra en desarrollo
            </Text>
        </View>
    )
}


export default InDevelopment;