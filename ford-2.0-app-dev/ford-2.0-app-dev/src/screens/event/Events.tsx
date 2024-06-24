import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Modal, Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { useEvents } from '../../hooks/useEvents';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import EventItem from '../../components/RowItems/EventItem';
import { FlashList } from '@shopify/flash-list';

const Events = () => {
    const { isGettingEvents, events } = useEvents();
    
    if (isGettingEvents) {
        return (
            <View style={styles.loadingWrapper}>
                <ActivityIndicator
                    size='large'
                    color={theme.colors.accent}
                />
                <Text style={styles.loadingText}>
                    Obteniendo eventos...
                </Text>
            </View>
        )
    }

    if (!events || events.length == 0) {
        return (
            <View style={styles.eventsNotFoundWrapper}>
                <Text style={styles.eventsNotFoundText}>
                    No se encontraron eventos sincronizados
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Seleccione un evento para continuar</Text>
            {
                events.length > 0 &&
                <View style={styles.list}>
                    <FlashList<Event>
                        data={events}
                        renderItem={({ item }) =>
                        <EventItem
                        item={item}
                        />
                    }
                    estimatedItemSize={10}
                    />
                </View>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 25,
        backgroundColor: theme.colors.appBackground
    },
    //#region Loading
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.appBackground
    },
    loadingText: {
        marginTop: 8,
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.accent
    },
    //#endregion
    //#region Not Found Event
    eventsNotFoundWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.appBackground
    },
    eventsNotFoundText: {
        fontSize: RFValue(16),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    },
    //#endregion
    subtitle: {
        alignSelf: 'center',
        marginTop: 6,
        //fontSize: heightPercentageToDP("2.5%"),
        fontSize: RFValue(16),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLLight,
    },
    list: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20
    },
});


export default Events;