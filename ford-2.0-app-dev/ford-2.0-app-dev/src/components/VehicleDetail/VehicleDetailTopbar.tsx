
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { theme } from '../../core/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../../utils/fonts';
import ModalDropdown from 'react-native-modal-dropdown';
import { VehicleVersion } from '../../model/VehicleVersion';
import NumberFormat from 'react-number-format';
import { DefaultRootState, useSelector } from 'react-redux';
import Select from '../Select';

interface Props {
    versions: VehicleVersion[];
    onPressVehicleVersion: () => void;
}

const VehicleDetailTopbar = ({ versions, onPressVehicleVersion }: Props) => {
    const currentVehicleVersion = useSelector((st: DefaultRootState) => st.transient.vehicleFeatures.vehicleVersion);

    return (
        <View style={styles.topbar}>
            <NumberFormat
                value={currentVehicleVersion?.price}
                displayType={'text'}
                thousandSeparator='.'
                decimalSeparator=','
                prefix={'$ '}
                renderText={(formattedValue) =>
                    <Text style={styles.priceText}>
                        {formattedValue}
                    </Text>
                }
            />
            <View style={{ flex: 1 }}></View>

            <View style={styles.selectWrapper}>
                <Select
                    title={currentVehicleVersion?.name}
                    placeholder='Seleccione Version...'
                    rippleColor='#ffffff20'
                    borderColor='#ffffff7A'
                    backgroundColor=''
                    fontColor={theme.colors.textLight}
                    iconColor={theme.colors.textLight}
                    onPress={onPressVehicleVersion}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    topbar: {
        width: '100%',
        height: '100%',
        //backgroundColor: '#00000034',
        //backgroundColor: theme.colors.primary + '56',
        marginTop: 4,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    image: {
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    priceText: {
        fontSize: RFValue(12),
        color: theme.colors.textLight,
        fontFamily: Fonts.FordAntennaWGLMedium
    },
    selectWrapper: {
        width: 300
    }
});

export default VehicleDetailTopbar;