
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../../utils/fonts';
import { getFullPath } from '../../utils/file';
import { DefaultRootState, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
    vehicleName?: string;
    height: number;
}

const VehicleDetailImage = ({ vehicleName, height }: Props) => {
    const currentVehicleVersion = useSelector((st: DefaultRootState) => st.transient.vehicleFeatures.vehicleVersion);
    const { vehicleImage, vehicleColor } = useSelector((st: DefaultRootState) => st.transient.vehicleFeatures);
    let image: string = '';
    if (vehicleImage && vehicleImage.vehicleImageUrl)
        image = vehicleImage.vehicleImageUrl;
    else if (vehicleColor && vehicleColor.vehicleImageUrl)
        image = vehicleColor.vehicleImageUrl;


    return (
        <View style={[styles.container, { height: height }]}>
            <>
                <LinearGradient
                    start={{ x: 0.0, y: 0.0 }} end={{ x: 0, y: 1.0 }}
                    colors={['#00000080', '#00000010', theme.colors.transparent, '#00000010', '#00000080']}
                    locations={[0, .25, .5, .75, 1]}
                    style={[styles.gradientContainer, { height: height }]}
                />
                {
                    image
                        ?
                        <Image
                            resizeMode='cover'
                            source={{ uri: getFullPath(image) }}
                            style={styles.image}
                        />
                        :
                        <View style={styles.notImageTextWrapper}>
                            <Text style={styles.notImageText}>
                                El vehículo no cuenta con imagenes para visualizar
                            </Text>
                        </View>
                }
            </>
            {
                currentVehicleVersion?.preLaunch == true &&
                <Image
                    source={require('../../assets/img/pre-launch-flag.jpg')}
                    style={styles.preLaunchImage}
                />
            }
            <Text style={styles.name}>
                {vehicleName}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden'
    },
    gradientContainer: {
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        zIndex: 1
    },
    image: {
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    notImageTextWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    notImageText: {
        textAlign: 'center',
        fontSize: RFValue(14),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.darkGrey,
        zIndex: 2
    },
    name: {
        position: 'absolute',
        bottom: 6,
        right: 12,
        width: '100%',
        textAlign: 'right',
        fontSize: RFValue(16),
        fontFamily: Fonts.FordAntennaWGLMedium,
        color: theme.colors.textLight + 'CC',
        zIndex: 2
    },
    preLaunchImage: {
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        left: 0,
        width: 150,
        height: 30,
        transform: [{ rotateZ: '45deg' }, { translateX: -45 }, { translateY: 5 }]
    },
});

export default VehicleDetailImage;