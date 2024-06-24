
import React from 'react';
import { StyleSheet, View, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { theme } from '../../core/theme';
import { RFValue } from "react-native-responsive-fontsize";
import { getFullPath } from '../../utils/file';
import { DefaultRootState, useDispatch, useSelector } from 'react-redux';
import { Vehicle } from '../../model/Vehicle';
import { FlatGrid } from 'react-native-super-grid';
import { widthPercentageToDP } from '../../utils/Size';
import { VehicleImage } from '../../model/VehicleImage';
import { selectVehicleImage } from '../../store/action/selectedVehicleFeaturesAction';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Fonts } from '../../utils/fonts';

interface Props {
    vehicle?: Vehicle;
    itemsPerRow?: number;
}

const VehicleDetailImageGallery = ({ vehicle, itemsPerRow = 4 }: Props) => {
    const vehicleImage = useSelector((st: DefaultRootState) => st.transient.vehicleFeatures.vehicleImage);
    const dispatch = useDispatch();

    const onSelectItem = (item: VehicleImage) => {
        dispatch(selectVehicleImage(item))
    }

    const isSelectedItem = (item: VehicleImage): boolean => {
        return vehicleImage?.id == item.id;
    }

    if (!vehicle?.images || vehicle?.images.length == 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                    name='error-outline'
                    size={96}
                />
                <Text style={styles.imagesNotFound}>
                    Este vehículo no cuenta con imágenes para visualizar
                </Text>
            </View>
        )
    }

    return (
        <FlatGrid<VehicleImage>
            style={styles.container}
            maxItemsPerRow={itemsPerRow}
            data={vehicle?.images ?? []}
            spacing={0}
            keyExtractor={((item) => item.id!.toString())}
            renderItem={({ item }) => (
                <TouchableOpacity
                    activeOpacity={.5}
                    onPress={() => onSelectItem(item)}
                    style={[
                        styles.touchableWrapper,
                        { height: (widthPercentageToDP('100%') / itemsPerRow) }
                    ]}
                >
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
        height: (widthPercentageToDP('100%') / 4),
        borderTopWidth: RFValue(2),
        borderRightWidth: RFValue(2),
        borderColor: '#BCB5B1'
    },
    vehicleImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    },
    imagesNotFound: {
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(16),
        textAlign: 'center',
        textAlignVertical: 'center',
    }
});

export default VehicleDetailImageGallery;