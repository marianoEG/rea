
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { theme } from '../core/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../utils/fonts';
import { widthPercentageToDP } from '../utils/Size';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
    children: any;
    labels: string[];
    defaultIndex?: number;
    tabAligment?: 'top' | 'bottom';
    tabIndicatorAligment?: 'top' | 'bottom';
    tabHegiht?: number;
    tabBackgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    mode?: 'scrollable' | 'fixed';
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
}

const CustomTabs = ({
    children,
    labels,
    defaultIndex = 0,
    tabAligment = 'top',
    tabIndicatorAligment = 'bottom',
    tabHegiht = 64,
    tabBackgroundColor = theme.colors.primary,
    textColor = theme.colors.textLight,
    fontSize = RFValue(8),
    mode = 'fixed',
    textTransform = 'capitalize'
}: Props) => {
    const [currentIndex, setCurrentIndex] = useState<number>(defaultIndex);

    return (
        <View
            style={[styles.container, { flexDirection: tabAligment == 'top' ? 'column' : 'column-reverse' }]}>
            <View
                style={[styles.tabsContainer, { backgroundColor: tabBackgroundColor, height: tabHegiht }]}>
                <ScrollView
                    horizontal={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    {labels.map((label, index) => (
                        <TouchableRipple
                            key={index}
                            rippleColor={textColor + '55'}
                            onPress={() => { setCurrentIndex(index) }}>
                            <View
                                style={[styles.tabItem, {
                                    width: mode == 'fixed' ? widthPercentageToDP('100') / labels.length : 'auto',
                                    borderColor: textColor,
                                    borderBottomWidth: tabIndicatorAligment == 'bottom' && currentIndex == index ? RFValue(3.5) : 0,
                                    borderTopWidth: tabIndicatorAligment == 'top' && currentIndex == index ? RFValue(3.5) : 0
                                }]}
                            >
                                <Text
                                    style={[styles.tabLabel, {
                                        color: textColor,
                                        textTransform: textTransform,
                                        fontSize: fontSize
                                    }]}
                                >
                                    {label}
                                </Text>
                            </View>
                        </TouchableRipple>
                    ))}
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>
                {
                    Array.isArray(children)
                        ?
                        React.Children.map(
                            children.filter((c: any, index: number) => { return index == currentIndex }),
                            (el) => el)
                        :
                        children
                }
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    tabsContainer: {
        width: '100%',
        minHeight: 54,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        borderTopColor: '#00000020',
        borderTopWidth: 1.2,
    },
    tabItem: {
        paddingHorizontal: 12,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabLabel: {
        fontFamily: Fonts.FordAntennaWGLMedium,
        textAlign: 'center'
    }
});
export default CustomTabs;