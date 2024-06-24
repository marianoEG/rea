import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { theme } from '../../core/theme';
import { Event } from '../../model/Event';
import { selectEvent } from '../../store/action/currentEventAction';
import { Size, widthPercentageToDP } from '../../utils/Size';
import { format } from "date-fns";
import { getFullPath } from '../../utils/file';
import DefaultImage from '../DefaultImage';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import ButtonRound from '../Buttons/ButtonRound';

interface Props {
    item: Event;
    height?: number;
}
const EventItem = ({ item, height = 300 }: Props) => {
    const dispatch = useDispatch();
    const [showDefaultImage, setShowDefaultImage] = useState(!item.image);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    useEffect(() => {
        if (item.image) {
            Image.getSize(getFullPath(item.image), (width, height) => {
                console.log(`width: ${width}, height: ${height}`);
                setSize({ width, height });
            }, error => {
                console.log('Error to get image size', error);
            })
        }
    }, []);

    const onSelectItem = () => {
        console.log("Selected Event:", item)
        dispatch(selectEvent(item))
    }

    return (
        <View style={[styles.shadowContainer, { height: height }]}>
            <LinearGradient
                start={{ x: 0.0, y: 0.0 }} end={{ x: 1, y: 0.0 }}
                colors={[theme.colors.primary, '#1d2eca']}
                locations={[0, .8]}
                style={styles.gradientContainer}>
                <TouchableRipple
                    style={styles.rippleContainer} onPress={() => onSelectItem()}
                    rippleColor={theme.colors.primary + '20'} borderless>
                    <View style={styles.cardWrapper}>
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>
                                {item.name}
                            </Text>
                            <Text style={styles.date}>
                                {format(item.dateFrom!, "dd/MM")} - {format(item.dateTo!, "dd/MM")}
                            </Text>
                            <ButtonRound
                                title='Conocé Más'
                                backgroundColor='#fff'
                                textStyle={styles.buttonText}
                                contentStyle={{ marginTop: 18 }}
                            />
                        </View>
                        {showDefaultImage
                            ?
                            (
                                <DefaultImage
                                    backgroundColor='#ffffffda'
                                    text="No se encontró la imagen del evento"
                                    // textSize={heightPercentageToDP('2%')}
                                    textSize={RFValue(18)}
                                    containerStyle={{ width: 225, padding: 24 }} />
                            )
                            :
                            (
                                <>
                                    {(size.width > 0 && size.height > 0) && <View style={[styles.imageWrapper, { width: Math.min(height * size.width / size.height, widthPercentageToDP('45%')) }]}>
                                        <Image
                                            source={{ uri: getFullPath(item.image) }}
                                            onError={error => {
                                                setShowDefaultImage(true);
                                            }}
                                            style={styles.image} />
                                    </View>}
                                </>
                            )}
                    </View>
                </TouchableRipple >
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    shadowContainer: {
        elevation: 4,
        borderRadius: 6,
        marginBottom: 48,
        marginHorizontal: 24,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    gradientContainer: {
        height: '100%',
        borderRadius: 6,
        overflow: 'hidden',
    },
    rippleContainer: {
        height: '100%',
        flexDirection: 'row',
    },
    cardWrapper: {
        flex: 1,
        flexDirection: "row",
    },
    textContainer: {
        flex: 1,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 24
    },
    name: {
        width: '60%',
        fontSize: RFValue(23),
        color: theme.colors.textLight,
        fontFamily: Fonts.FordAntennaWGLRegular
    },
    date: {
        fontSize: RFValue(13.5),
        marginTop: 0,
        color: theme.colors.textLight,
        fontFamily: Fonts.FordAntennaWGLMedium
    },
    imageWrapper: {
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    image: {
        resizeMode: 'contain',
        height: '100%',
        width: '100%',
        borderRadius: 2
    },
    buttonText: {
        fontFamily: Fonts.FordAntennaWGLMedium,
        color: theme.colors.accent,
        fontSize: RFValue(12.5)
    }
});

export default EventItem;