import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import { Dealership } from '../../model/Dealership';
import ButtonText from '../Buttons/ButtonText';

interface Props {
    item: Dealership;
    onSelectItem: () => void
}
const DealershipItem = ({ item, onSelectItem }: Props) => {

    const getProvinceAndLocalityText = (): string => {
        let str = '-';
        if (item.provinceName)
            str = item.provinceName + '';
        if (item.localityName)
            str += ' - ' + item.localityName;
        return str;
    }

    const getPhones = (): string => {
        let str = '-';
        if (item.phone1)
            str = item.phone1;
        if (item.phone2)
            str += ' / ' + item.phone2;
        return str;
    }

    return (
        <View style={styles.shadowContainer}>
            <View style={styles.cardWrapper}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.name}</Text>
                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.descriptionTitle}>
                            Lugar:
                        </Text>
                        <Text style={styles.descriptionValue}>
                            {getProvinceAndLocalityText()}
                        </Text>
                    </View>
                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.descriptionTitle}>
                            Domicilio:
                        </Text>
                        <Text style={styles.descriptionValue}>
                            {item.streetNameAndNumber ?? '-'}
                        </Text>
                    </View>
                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.descriptionTitle}>
                            Teléfonos:
                        </Text>
                        <Text style={styles.descriptionValue}>
                            {getPhones()}
                        </Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'flex-end' }}>
                    <ButtonText
                        fontSize={RFValue(11)}
                        uppercase={false}
                        onPress={() => onSelectItem()}
                        textColor={theme.colors.primary}
                        title='Cotizar'
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shadowContainer: {
        borderRadius: 6,
        marginHorizontal: 8,
        marginBottom: 18,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 4,
        flexDirection: 'row'
    },
    cardWrapper: {
        //flex: 1,
        padding: 12,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 6,
    },
    title: {
        fontSize: RFValue(13),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLRegular,
        marginBottom: 12
    },
    descriptionWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2
    },
    descriptionTitle: {
        fontSize: RFValue(11),
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight
    },
    descriptionValue: {
        fontSize: RFValue(11.5),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLLight,
        marginLeft: 8
    }
});

export default DealershipItem;