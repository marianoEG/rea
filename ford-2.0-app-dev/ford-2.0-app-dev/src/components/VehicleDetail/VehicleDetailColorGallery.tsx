import React from 'react';
import { StyleSheet, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../../utils/fonts';
import { getFullPath } from '../../utils/file';
import { DefaultRootState, useDispatch, useSelector } from 'react-redux';
import { Vehicle } from '../../model/Vehicle';
import { FlatGrid } from 'react-native-super-grid';
import { VehicleColor } from '../../model/VehicleColor';
import { widthPercentageToDP } from '../../utils/Size';
import { selectVehicleColor } from '../../store/action/selectedVehicleFeaturesAction';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
    vehicle?: Vehicle;
    itemsPerRow?: number;
}

const VehicleDetailColorGallery = ({ vehicle, itemsPerRow = 4 }: Props) => {
    const vehicleColor = useSelector((st: DefaultRootState) => st.transient.vehicleFeatures.vehicleColor);
    const dispatch = useDispatch();

    const onSelectItem = (item: VehicleColor) => {
        dispatch(selectVehicleColor(item));
    }

    const isSelectedItem = (item: VehicleColor): boolean => {
        return vehicleColor?.id == item.id;
    }

    if (!vehicle?.colors || vehicle?.colors.length == 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                    name='error-outline'
                    size={96}
                />
                <Text style={styles.colorsNotFound}>
                    Este vehículo no cuenta con colores para visualizar
                </Text>
            </View>
        )
    }

    return (
        <FlatGrid<VehicleColor>
            style={styles.container}
            maxItemsPerRow={itemsPerRow}
            data={vehicle?.colors ?? []}
            spacing={0}
            keyExtractor={((item) => item.id!.toString())}
            renderItem={({ item }) => (
                <TouchableOpacity
                    activeOpacity={.5}
                    onPress={() => onSelectItem(item)}
                    style={[styles.touchableWrapper, { height: (widthPercentageToDP('100%') / itemsPerRow) }]}>
                    <View
                        style={{
                            borderWidth: isSelectedItem(item) ? RFValue(3) : 0,
                            borderRadius: isSelectedItem(item) ? 4 : 0,
                            borderColor: theme.colors.primary
                        }}>
                        <ImageBackground
                            resizeMode='cover'
                            source={{ uri: getFullPath(item.vehicleImageUrl) }}
                            style={styles.vehicleImage}
                        >
                            <>
                                <LinearGradient
                                    start={{ x: 0.0, y: 1.0 }} end={{ x: 0, y: 0.0 }}
                                    colors={['#000000A0', '#00000030', theme.colors.transparent]}
                                    locations={[0, .4, .5]}
                                    style={[styles.gradientContainer]}
                                />
                                <View style={styles.colorWrapper}>
                                    <Image
                                        resizeMode='cover'
                                        style={styles.colorImage}
                                        source={{ uri: getFullPath(item.colorImageUrl) }}
                                    />
                                    <Text
                                        style={styles.colorName}
                                        numberOfLines={2}
                                        ellipsizeMode='tail'
                                    >
                                        {item.colorName}
                                    </Text>
                                </View>
                            </>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.appBackground
    },
    touchableWrapper: {
        width: '100%',
        borderTopWidth: RFValue(2),
        borderRightWidth: RFValue(2),
        borderColor: '#BCB5B1'
    },
    vehicleImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    },
    colorWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    colorImage: {
        width: 32,
        height: 32,
        borderRadius: 500,
        borderWidth: RFValue(1),
        borderColor: '#00000064',
        marginRight: 8
    },
    colorName: {
        fontSize: RFValue(11.5),
        color: theme.colors.textLight,
        fontFamily: Fonts.FordAntennaWGLRegular,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        textAlign: 'right'
    },
    gradientContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0
    },
    colorsNotFound: {
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(16),
        textAlign: 'center',
        textAlignVertical: 'center',
    }
});

export default VehicleDetailColorGallery;