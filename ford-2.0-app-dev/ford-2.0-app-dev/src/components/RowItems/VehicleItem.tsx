import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { theme } from '../../core/theme';
import { getFullPath } from '../../utils/file';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import { ExtendedVehicle } from '../../model/Vehicle';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
    item: ExtendedVehicle;
    height?: number;
    onPress: () => void;
}
const VehicleItem = ({ item, onPress, height = 300 }: Props) => {

    return (
        <View style={[styles.shadowContainer, { height: height }]}>
            <TouchableRipple
                style={styles.rippleContainer} onPress={onPress}
                rippleColor={'#ffffff20'} borderless>
                <View style={styles.cardWrapper}>
                    {
                        item.preLaunch == true &&
                        <Image
                            source={require('../../assets/img/pre-launch-flag.jpg')}
                            style={styles.preLaunchImage}
                        />
                    }
                    <ImageBackground
                        resizeMode='cover'
                        source={{ uri: getFullPath(item.image) }}
                        style={styles.image}>
                        <LinearGradient
                            start={{ x: 0.0, y: 1.0 }} end={{ x: 0, y: 0.0 }}
                            colors={['#000000A0', '#00000075', '#00000030', theme.colors.transparent]}
                            locations={[0, .2, .25, .5]}
                            style={[styles.gradientContainer, { height: height }]}
                        />
                        <View
                            style={styles.textContainer}>
                            <Text
                                style={styles.name}>
                                {item.name}
                            </Text>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableRipple>
        </View>
    )
}

const styles = StyleSheet.create({
    shadowContainer: {
        marginBottom: 16,
        marginTop: 16,
        borderRadius: 6,
        backgroundColor: 'transparent',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    rippleContainer: {
        height: '100%',
        borderRadius: 6,
        overflow: 'hidden',
        flexDirection: 'row'
    },
    cardWrapper: {
        flex: 1,
        flexDirection: "row"
    },
    image: {
        resizeMode: 'cover',
        height: '100%',
        width: '100%'
    },
    preLaunchImage: {
        position: 'absolute',
        zIndex: 1,
        top: 0,
        right: 0,
        width: 150,
        height: 30,
        transform: [{ rotateZ: '45deg' }, { translateX: 45 }, { translateY: -8 }]
    },
    gradientContainer: {
        width: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0
    },
    textContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    name: {
        marginBottom: 2,
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLMedium,
        color: theme.colors.textLight
    }
});

export default VehicleItem;