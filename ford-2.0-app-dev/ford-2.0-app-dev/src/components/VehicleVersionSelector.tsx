import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';
import { theme } from '../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../utils/fonts';
import { VehicleVersion } from '../model/VehicleVersion';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
    vehicleVersions: VehicleVersion[];
    onPress: (version: VehicleVersion) => void;
}
const VehicleVersionSelector = ({ vehicleVersions, onPress }: Props) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Seleccione una versión del vehículo
            </Text>
            <Divider style={{ width: '100%', height: RFValue(1), marginBottom: 18 }} />
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                {
                    vehicleVersions.length > 0
                        ?
                        vehicleVersions.map(version => {
                            return (
                                <TouchableRipple
                                    key={version.id}
                                    onPress={() => { onPress(version) }}
                                    rippleColor={theme.colors.primary + '20'}
                                >
                                    <Text style={styles.optionText}>
                                        {version.name}
                                    </Text>
                                </TouchableRipple>
                            )
                        })
                        :
                        <Text style={styles.optionText}>
                            El vehículo no cuenta con versiones para seleccionar
                        </Text>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24
    },
    title: {
        width: '100%',
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(14),
        //color: theme.colors.textDark,
        textAlign: 'center',
        marginBottom: 4
    },
    optionText: {
        fontFamily: Fonts.FordAntennaWGLRegular,
        fontSize: RFValue(13),
        color: theme.colors.textDark,
        textAlign: 'center',
        padding: 8
    }
});

export default VehicleVersionSelector;