
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../../utils/fonts';
import { ScrollView } from 'react-native-gesture-handler';
import ButtonRound from '../Buttons/ButtonRound';
import { DefaultRootState, useSelector } from 'react-redux';

interface Props {
    navigateToNewsletter: () => void;
    navigateToDealerShips: () => void;
    navigateToTestDrive: () => void;
}

const VehicleDetailMoreOptions = ({
    navigateToNewsletter,
    navigateToDealerShips,
    navigateToTestDrive
}: Props) => {

    const currentVehicleVersion = useSelector((st: DefaultRootState) => st.transient.vehicleFeatures.vehicleVersion);

    const itemView = (title: string, description: string, navigationText: string, onPress: () => void) => {
        return (
            <View style={styles.itemWrapper}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Divider style={{ height: RFValue(1) }}></Divider>
                <Text style={styles.itemDescription}>{description}</Text>

                <View style={{ alignSelf: 'center' }}>
                    <ButtonRound
                        title={navigationText}
                        iconName={'chevron-right'}
                        onPress={onPress}
                    />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={styles.rowItem}>
                    <View>
                        {
                            itemView(
                                'Más información',
                                'Adherite al newsletter para recibir informacion sobre todos los vehículos.',
                                'Navegar',
                                navigateToNewsletter
                            )
                        }
                    </View>
                    {
                        currentVehicleVersion?.preLaunch != true &&
                        <View>
                            {
                                itemView(
                                    'Solicitar una cotización',
                                    'Solicitá cotizaciones sobre vehículos de tu interes.',
                                    'Navegar',
                                    navigateToDealerShips
                                )
                            }
                        </View>
                    }
                </View>
                {/* <View style={styles.rowItem}>
                    <View>
                        {
                            itemView(
                                'Test Drive',
                                'Realizá pruebas de conducción.',
                                'Navegar',
                                navigateToTestDrive
                            )
                        }
                    </View>
                </View> */}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: theme.colors.appBackground
    },
    rowItem: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    itemWrapper: {
        width: 320,
        padding: 12,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        marginHorizontal: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        borderRadius: 8,
    },
    itemTitle: {
        fontSize: RFValue(13),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.textDark,
        marginBottom: 2,
        textAlign: 'center'
    },
    itemDescription: {
        fontSize: RFValue(12),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.darkGrey,
        textAlign: 'center',
        margin: 8,
        height: 130,
        textAlignVertical: 'center'
    }
});

export default VehicleDetailMoreOptions;