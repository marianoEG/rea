import React from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
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
const ActionSheetSelectItemsAux = ({
    sheetId,
    items,
    title,
    emptyItemsText,
    onSelect,
    height = 400,
}: Props) => {

    console.log('ActionSheetSelectItems - items count:', items.length);
    console.log('ActionSheetSelectItems - items count:', items[items.length - 1]?.name);

    const closeSheet = () => {
        SheetManager.hide(sheetId);
    }

    const onSelectItem = (id: number) => {
        onSelect(id);
        closeSheet();
    }

    const renderItem = ({ item }: ListRenderItemInfo<Item>) => (
        // <TouchableRipple
        //     key={item.id}
        //     onPress={() => { onSelectItem(item.id) }}
        //     rippleColor={theme.colors.primary + '20'}
        // >
        <Text key={item.id} style={styles.optionText}>
            {item.name}
        </Text>
        // </TouchableRipple>
    )

    // we set the height of item is fixed
    const getItemLayout = (data: Item[] | undefined | null, index: number) => (
        { length: 64, offset: 64 * index, index }
    );

    return (
        <ActionSheet
            id={sheetId}
            gestureEnabled={false}
            headerAlwaysVisible={false}
            containerStyle={{ height: height }}
            defaultOverlayOpacity={.75}
        >
            <View style={[styles.container, { height: height }]}>
                <FlatList
                    style={{ height: 100 }}
                    contentContainerStyle={{
                        //width: 500,
                        //height: 200,
                        flexGrow: 1,
                        // justifyContent: 'center',
                        // paddingVertical: 12,
                        height: 100,
                        backgroundColor: 'green'
                    }}
                    //keyExtractor={item => item.id.toString()}
                    data={items}
                    showsVerticalScrollIndicator={true}
                    renderItem={renderItem}
                    getItemLayout={getItemLayout}
                    initialNumToRender={50}
                    maxToRenderPerBatch={50}
                    windowSize={50}
                />
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

                {
                    items.length > 0
                        ?
                        <View style={{ height: 100, backgroundColor: 'red' }}>
                            {/* <FlatList
                                style={{ height: 100 }}
                                contentContainerStyle={{
                                    //width: 500,
                                    //height: 200,
                                    flexGrow: 1,
                                    // justifyContent: 'center',
                                    // paddingVertical: 12,
                                    height: 100,
                                    backgroundColor: 'green'
                                }}
                                keyExtractor={item => item.id.toString()}
                                data={items}
                                showsVerticalScrollIndicator={true}
                                renderItem={renderItem}
                                getItemLayout={getItemLayout}
                                initialNumToRender={50}
                                maxToRenderPerBatch={50}
                                windowSize={50}
                            /> */}
                        </View>
                        :
                        <Text style={styles.optionText}>
                            {emptyItemsText}
                        </Text>
                }
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
        //position: 'absolute',
        right: 0,
        top: 8
    },
    optionText: {
        fontFamily: Fonts.FordAntennaWGLRegular,
        fontSize: RFValue(13),
        color: theme.colors.textDark,
        textAlign: 'center',
        padding: 8,
        height: 64
    }
});

export default ActionSheetSelectItemsAux;