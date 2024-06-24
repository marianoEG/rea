import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import { DefaultRootState, useSelector } from 'react-redux';
import SubEventItem from '../../components/RowItems/SubEventItem';
import { SubEvent } from '../../model/SubEvent';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../utils/rootNavigation';
import { Screens } from '../../navigation/Screens';
import { FlashList } from '@shopify/flash-list';

const SubEvents = () => {
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();

    const onSelectItem = (subEvent: SubEvent) => {
        navigation.navigate(Screens.Guests, { subEvent: JSON.stringify(subEvent) })
    }

    if (!currentEvent || !currentEvent.subEvents || currentEvent.subEvents.length == 0) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.appBackground }}>
                <Text style={styles.subEventsEmpty}>
                    El evento seleccionado no contiene sub eventos asociados.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>Seleccione una lista de invitados para continuar</Text>
            {
                currentEvent?.subEvents && currentEvent.subEvents.length > 0 &&
                // <FlatList
                //     showsVerticalScrollIndicator={false}
                //     style={styles.list}
                //     contentContainerStyle={{ paddingBottom: 40 }}
                //     data={currentEvent.subEvents}
                //     renderItem={({ item }) => <SubEventItem item={item} onSelectItem={() => { onSelectItem(item) }} />}
                //     keyExtractor={(item, index) => item.id!.toString()}>
                // </FlatList>
                <View style={styles.list}>
                    <FlashList<SubEvent>
                        data={currentEvent.subEvents}
                        renderItem={({ item }) =>
                            <SubEventItem
                                item={item}
                                onSelectItem={() => { onSelectItem(item) }}
                            />
                        }
                        estimatedItemSize={20}
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
    subtitle: {
        alignSelf: 'center',
        marginTop: 6,
        marginHorizontal: 48,
        fontSize: RFValue(16),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLLight,
        textAlign: 'center'
    },
    list: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20
    },
    subEventsEmpty: {
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(14),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        textAlign: 'center'
    },
});

export default SubEvents;