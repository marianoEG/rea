import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ImageURISource } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../../utils/fonts';
import { getFullPath } from '../../utils/file';
import { Vehicle } from '../../model/Vehicle';
import { FlatGrid } from 'react-native-super-grid';
import { VehicleAccessory } from '../../model/VehicleAccessory';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import ImageViewerModal from '../Modals/ImageViewerModal';
import { useDispatch } from 'react-redux';
import { showImageViewerModal } from '../../store/action/imageViewerModalAction';

// interface ImageViewState {
//     isVisible: boolean,
//     images: ImageSource[]
//     startIndex: number
// }

// const defaultImageViewState: ImageViewState = {
//     isVisible: false,
//     images: [],
//     startIndex: 0
// }

interface ImageViewState {
    isVisible: boolean,
    image?: ImageURISource
}

const defaultImageViewState: ImageViewState = {
    isVisible: false,
    image: undefined
}

interface Props {
    vehicle?: Vehicle;
}

const VehicleDetailAccessories = ({ vehicle }: Props) => {
    //const [imageViewer, setImageViewer] = useState<ImageViewState>(defaultImageViewState);
    //const [imageViewer, setImageViewer] = useState<ImageViewState>(defaultImageViewState);
    const dispatch = useDispatch();

    // const onSelectItem = (accessory: VehicleAccessory) => {
    //     if (accessory.image) {
    //         const images = vehicle?.accessories
    //             ? vehicle!.accessories!
    //                 .filter(acc => !!acc.image)
    //                 .map(acc => ({
    //                     uri: getFullPath(acc.image),
    //                     width: 500,
    //                     height: 500
    //                 }))
    //             : [];

    //         if (images && images.length > 0) {
    //             setImageViewer({
    //                 isVisible: true,
    //                 images: images,
    //                 startIndex: images.findIndex(i => i.uri! == getFullPath(accessory.image))
    //             })
    //         }
    //     }
    // }

    const onSelectItem = (accessory: VehicleAccessory) => {
        if (accessory.image) {
            dispatch(showImageViewerModal(
                {
                    uri: getFullPath(accessory.image),
                    width: 500,
                    height: 500
                }
            ))
        }
    }

    if (!vehicle?.accessories || vehicle?.accessories.length == 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                    name='error-outline'
                    size={96}
                />
                <Text style={styles.accessoriesNotFound}>
                    Este vehículo no cuenta con accesorios para visualizar
                </Text>
            </View>
        )
    }

    return (
        <View
            style={styles.container}
        >
            <FlatGrid<VehicleAccessory>
                maxItemsPerRow={1}
                data={vehicle?.accessories ?? []}
                spacing={0}
                keyExtractor={((item) => item.id!.toString())}
                renderItem={({ item, index }) => (
                    <View style={[styles.itemContainer, styles.shadow4, { marginTop: index == 0 ? 18 : 0 }]}>
                        <TouchableOpacity
                            activeOpacity={item.image ? .75 : 1}
                            onPress={() => onSelectItem(item)}
                            style={{ padding: 12 }}
                        >
                            {
                                !item.image
                                    ?
                                    <View style={styles.iconWrapper}>
                                        <Icon
                                            name='image'
                                            style={[styles.image]}
                                            size={80}
                                            color={theme.colors.darkGrey}
                                        />
                                    </View>
                                    :
                                    <View style={[styles.imageWrapper, styles.shadow4]}>
                                        <Image
                                            source={{ uri: getFullPath(item.image) }}
                                            resizeMode="cover"
                                            style={styles.image} />
                                    </View>
                            }
                        </TouchableOpacity>
                        <View style={styles.cardWrapper}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.title}>
                                    {item.name}
                                </Text>

                                {/* Description */}
                                <View style={styles.propertyWrapper}>
                                    <Text style={styles.propertyTitle}>
                                        Descripción:
                                    </Text>
                                    <Text style={styles.propertyValue}>
                                        {item.description ?? 'No hay descripción'}
                                    </Text>
                                </View>

                                {/* Observation */}
                                <View style={styles.propertyWrapper}>
                                    <Text style={styles.propertyTitle}>
                                        Observación:
                                    </Text>
                                    <Text style={styles.propertyValue}>
                                        {item.observation ?? 'Sin observaciones'}
                                    </Text>
                                </View>

                                {/* PartNumber */}
                                <View style={styles.propertyWrapper}>
                                    <Text style={styles.propertyTitle}>
                                        Número de pieza:
                                    </Text>
                                    <Text style={styles.propertyValue}>
                                        {item.partNumber ?? '-'}
                                    </Text>
                                </View>

                                {/* ModelFor */}
                                <View style={styles.propertyWrapper}>
                                    <Text style={styles.propertyTitle}>
                                        Modelo al que aplica:
                                    </Text>
                                    <Text style={styles.propertyValue}>
                                        {item.modelFor ?? '-'}
                                    </Text>
                                </View>

                            </View>
                        </View>
                    </View>
                )}
            />
            {/* <ImageView
                images={imageViewer.images}
                imageIndex={imageViewer.startIndex}
                visible={imageViewer.isVisible}
                onRequestClose={() => setImageViewer(defaultImageViewState)}
            /> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.appBackground
    },
    itemContainer: {
        marginBottom: 18,
        marginHorizontal: 28,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#fff'
    },
    imageWrapper: {
        width: 80,
        height: 80,
        borderWidth: RFValue(1),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: '#0000001A',
        borderRadius: 4,
        backgroundColor: '#fff'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 4
    },
    iconWrapper: {
        width: 80,
        height: 80,
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },
    cardWrapper: {
        flex: 1,
        padding: 12,
        height: '100%',
        flexDirection: 'row'
    },
    title: {
        fontSize: RFValue(13.5),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLSemibold,
    },
    propertyWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 4
    },
    propertyTitle: {
        fontSize: RFValue(12),
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight
    },
    propertyValue: {
        fontSize: RFValue(12.5),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLLight,
        marginLeft: 8,
        flexShrink: 1
    },
    accessoriesNotFound: {
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(16),
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    shadow4: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    }
});

export default VehicleDetailAccessories;