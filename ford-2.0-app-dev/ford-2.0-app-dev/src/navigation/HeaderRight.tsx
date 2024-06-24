import React, { useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { DefaultRootState, useSelector } from 'react-redux';
import ButtonIcon from '../components/Buttons/ButtonIcon';
import DefaultImage from '../components/DefaultImage';
import { useUploadSyncContext } from '../context/UploadSyncContext';
import { theme } from '../core/theme';
import { getFullPath } from '../utils/file';
import { Fonts } from '../utils/fonts';
import { TouchableRipple } from 'react-native-paper';

interface Props {
    showEventName: boolean;
    onPressSync?: () => void;
    onPressDelete?: () => void;
}

const HeaderRight = ({ showEventName, onPressSync, onPressDelete }: Props) => {
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const { isSyncingGuests, isSyncingCampaignSearches, isSyncingForms } = useUploadSyncContext();

    return (
        !showEventName && !onPressSync && !onPressDelete
            ?
            <></>
            :
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {showEventName && <Text style={styles.eventName}>{currentEvent?.name ?? ''}</Text>}
                {onPressSync &&
                    <TouchableRipple
                        disabled={isSyncingGuests || isSyncingCampaignSearches || isSyncingForms}
                        onPress={onPressSync}
                    >
                        <Image
                            source={require('../assets/img/icons/DescargaIcon.png')}
                            resizeMode='contain'
                            style={{height: 25,width:25, marginHorizontal: 8}}
                        />
                    </TouchableRipple>}
            </View>
    )
}

const styles = StyleSheet.create({
    eventName: {
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.primary,
        fontSize: RFValue(11.5),
        marginRight: 8
    }
});

export default HeaderRight;