import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import ButtonText from '../Buttons/ButtonText';
import { CampaignSearch } from '../../model/CampaignSearch';
import { format } from 'date-fns';
import { isNullOrEmpty, isNotNullOrEmpty } from '../../utils/utils';

interface Props {
    item: CampaignSearch;
    onSelectItem: () => void;
    disabled: boolean;
}
const CampaignSearchItem = ({ item, onSelectItem, disabled }: Props) => {

    const hasCampaign = (): boolean => {
        return isNotNullOrEmpty(item.campaign?.id)
            && isNotNullOrEmpty(item.campaign?.pat)
            && isNotNullOrEmpty(item.campaign?.vin);
    }

    return (
        <View style={styles.shadowContainer}>
            <View style={styles.cardWrapper}>
                <View style={{ flex: 1 }}>
                    {/* <Text style={styles.title}>{item.name}</Text> */}
                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.descriptionTitle}>
                            Fecha:
                        </Text>
                        <Text style={styles.descriptionValue}>
                            {item.searchDate ? format(item.searchDate!, 'dd/MM/yy HH:mm') : '-'}
                        </Text>
                    </View>
                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.descriptionTitle}>
                            Patente/VIN:
                        </Text>
                        <Text style={styles.descriptionValue}>
                            {item.searchText ?? '-'}
                        </Text>
                    </View>
                    <View style={styles.descriptionWrapper}>
                        <Text style={styles.descriptionTitle}>
                            Estado:
                        </Text>
                        <Text style={styles.descriptionValue}>
                            {item.isSynchronized ? 'Enviado' : 'No enviado'}
                        </Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'flex-end' }}>
                    {
                        hasCampaign()
                            ?
                            <ButtonText
                                fontSize={RFValue(11)}
                                uppercase={false}
                                onPress={onSelectItem}
                                textColor={theme.colors.primary}
                                title='Ver campaña'
                                disabled={disabled}
                            />
                            :
                            <Text style={styles.campaignNotExists}>
                                No posee campaña
                            </Text>
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shadowContainer: {
        borderRadius: 6,
        //marginHorizontal: 8,
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
        marginBottom: 6
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
    },
    campaignNotExists: {
        fontSize: RFValue(11.5),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLLight,
        marginBottom: 6
    }
});

export default CampaignSearchItem;