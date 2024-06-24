import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';
import { theme } from '../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../utils/fonts';
import { ScrollView } from 'react-native-gesture-handler';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import ButtonIcon from './Buttons/ButtonIcon';
import { ActionSheetIdEnum, Item } from '../utils/constants';

interface Props {
    sheetId: ActionSheetIdEnum;
    title: string;
    emptyItemsText: string;
    items: Item[];
    onSelect: (id: number) => void;
    height?: number,
    scrollHandlers?: any
}
const ActionSheetSelectItems = ({
    sheetId,
    items,
    title,
    emptyItemsText,
    onSelect,
    height = 400,
}: Props) => {

    const closeSheet = () => {
        SheetManager.hide(sheetId);
    }

    const onSelectItem = (id: number) => {
        onSelect(id);
        closeSheet();
    }

    return (
        <ActionSheet
            id={sheetId}
            gestureEnabled={false}
            headerAlwaysVisible={false}
            containerStyle={{ height: height }}
            defaultOverlayOpacity={.75}
        >
            <View style={[styles.container, { height: height }]}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    <ButtonIcon
                        style={styles.closeButton}
                        icon="clear"
                        size={30}
                        color={theme.colors.textDark}
                        onPress={closeSheet}
                    />
                </View>
                <Divider style={{ width: '100%', height: RFValue(1) }} />

                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            paddingVertical: 12
                        }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            items.length > 0
                                ?
                                items.map((item, index) => {
                                    return (
                                        <TouchableRipple
                                            key={index}
                                            onPress={() => { onSelectItem(item.id) }}
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
            </View>
        </ActionSheet>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
    },
    header: {
        paddingVertical: 12
    },
    title: {
        width: '100%',
        fontFamily: Fonts.FordAntennaWGLMedium,
        fontSize: RFValue(14.5),
        //color: theme.colors.textDark,
        textAlign: 'center',
        marginBottom: 4
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 8
    },
    optionText: {
        fontFamily: Fonts.FordAntennaWGLRegular,
        fontSize: RFValue(13),
        color: theme.colors.textDark,
        textAlign: 'center',
        padding: 8
    }
});

export default ActionSheetSelectItems;