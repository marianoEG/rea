import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { DefaultRootState, useSelector } from 'react-redux';
import DefaultImage from '../components/DefaultImage';
import { theme } from '../core/theme';
import { getFullPath } from '../utils/file';

const Home = () => {
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const [showDefaultImage, setShowDefaultImage] = useState(!(currentEvent && currentEvent.image));
    const imagePath = getFullPath(currentEvent?.image);

    return (
        <View style={styles.container}>
            {
                showDefaultImage
                    ?
                    (
                        <DefaultImage
                            text="No se encontró la imagen del evento"
                            //textSize={heightPercentageToDP('2.25%')}
                            textSize={RFValue(16)}
                            imageWidth={128}
                            imageHeight={128}
                            containerStyle={{ flex: 1 }} />
                    )
                    :
                    (
                        <Image
                            source={{ uri: imagePath }}
                            onError={error => {
                                setShowDefaultImage(true);
                            }}
                            resizeMode="cover"
                            style={styles.image}
                        />
                    )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.appBackground
    },
    image: {
        width: '100%',
        height: '100%',
    }
});

export default Home;