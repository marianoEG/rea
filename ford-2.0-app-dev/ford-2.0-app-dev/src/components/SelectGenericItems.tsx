import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';
import { theme } from '../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../utils/fonts';
import { ScrollView } from 'react-native-gesture-handler';
import { Item } from '../utils/constants';

interface Props {
    title: string;
    emptyItemsText: string;
    items: Item[];
    onSelect: (id: number) => void;
}
const SelectGenericItems = ({
    items,
    title,
    emptyItemsText,
    onSelect
}: Props) => {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>
            <Divider style={{ width: '100%', height: RFValue(1), marginBottom: 18 }} />
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                {
                    items.length > 0
                        ?
                        items.map(item => {
                            return (
                                <TouchableRipple
                                    key={item.id}
                                    onPress={() => { onSelect(item.id) }}
                                    rippleColor={theme.colors.primary + '20'}
                                >
                                    <Text style={styles.optionText}>
                                        {item.name}
                                    </Text>
                                </TouchableRipple>
                            )
                        })
                        :
                        <Text style={styles.optionText}>
                            {emptyItemsText}
                        </Text>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24
    },
    title: {
        width: '100%',
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(14),
        //color: theme.colors.textDark,
        textAlign: 'center',
        marginBottom: 4
    },
    optionText: {
        fontFamily: Fonts.FordAntennaWGLRegular,
        fontSize: RFValue(13),
        color: theme.colors.textDark,
        textAlign: 'center',
        padding: 8
    }
});

export default SelectGenericItems;