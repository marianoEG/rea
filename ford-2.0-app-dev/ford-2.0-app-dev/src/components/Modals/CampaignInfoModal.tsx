import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Modal, Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import { Fonts } from '../../utils/fonts';
import ButtonRound from '../Buttons/ButtonRound';
import TextInputLabeled from '../TextInputLabeled';
import { Campaign } from '../../model/Campaign';
import { hideCampaignModal } from '../../store/action/campaignModalAction';

interface Props {
    isVisible: boolean,
    campaign?: Campaign
}
const CampaignInfoModal = ({ isVisible, campaign }: Props) => {
    const dispatch = useDispatch();

    return (
        <Modal
            visible={isVisible}
            contentContainerStyle={styles.modal}
            dismissable={true}
            onDismiss={() => { dispatch(hideCampaignModal()) }}
        >
            <Text
                style={styles.title}>
                Información de campaña
            </Text>
            <Divider
                style={{ width: '100%', height: RFValue(1) }}
            />

            <View style={styles.content}>

                {/* Patente y VIN */}
                <View style={[styles.row, { marginBottom: 24 }]}>
                    <View style={[{ flex: 1, marginRight: 12 }]}>
                        <TextInputLabeled
                            title='Patente'
                            value={campaign?.pat ?? '-'}
                            editable={false}
                            outlineColor={'#CED4DA'}
                            backgroundColor='#ffffff7A'
                            textColor='#495057'
                        />
                    </View>
                    <View style={[{ flex: 1, marginLeft: 12 }]}>
                        <TextInputLabeled
                            title='VIN'
                            value={campaign?.vin ?? '-'}
                            editable={false}
                            outlineColor={'#CED4DA'}
                            backgroundColor='#ffffff7A'
                            textColor='#495057'
                        />
                    </View>
                </View>
                {/* CC y Service */}
                <View style={[styles.row, { marginBottom: 24 }]}>
                    <View style={[{ flex: 1, marginRight: 12 }]}>
                        <TextInputLabeled
                            title='Código de campaña'
                            value={campaign?.cc ?? '-'}
                            editable={false}
                            outlineColor={'#CED4DA'}
                            backgroundColor='#ffffff7A'
                            textColor='#495057'
                        />
                    </View>
                    <View style={[{ flex: 1, marginLeft: 12 }]}>
                        <TextInputLabeled
                            title='Service'
                            value={campaign?.serv ?? '-'}
                            editable={false}
                            outlineColor={'#CED4DA'}
                            backgroundColor='#ffffff7A'
                            textColor='#495057'
                        />
                    </View>
                </View>
                {/* Fecha Servicio y mantenimiento */}
                <View style={[styles.row, { alignItems: 'flex-start', marginBottom: 24 }]}>
                    <View style={[{ flex: 1, marginRight: 12 }]}>
                        <TextInputLabeled
                            title='Último service'
                            value={campaign?.fecha_serv ?? '-'}
                            editable={false}
                            outlineColor={'#CED4DA'}
                            backgroundColor='#ffffff7A'
                            textColor='#495057'
                        />
                    </View>
                    <View style={[{ flex: 1, marginLeft: 12 }]}>
                        <TextInputLabeled
                            title='Mantenimiento'
                            //value={'Que pasa si el texto para este campo es demasiado largo? se puede visualizar bien? entran todas y cada una de las palabras? ehhhhhhhhh?'}
                            value={campaign?.manten ?? '-'}
                            editable={false}
                            outlineColor={'#CED4DA'}
                            backgroundColor='#ffffff7A'
                            textColor='#495057'
                        />
                    </View>
                </View>
            </View>

            <Divider
                style={{ width: '100%', height: RFValue(1), marginBottom: 24 }}
            />
            <ButtonRound
                title='Cerrar'
                onPress={() => { dispatch(hideCampaignModal()) }}
                contentStyle={{ alignSelf: 'center', width: '50%' }}
            />
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        width: '75%',
        maxHeight: '90%',
        backgroundColor: 'white',
        padding: 24,
        alignSelf: 'center',
        borderRadius: 12
    },
    title: {
        textAlign: 'center',
        fontSize: RFValue(18),
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLRegular,
        marginBottom: 6
    },
    content: {
        paddingVertical: 38,
        paddingHorizontal: 28
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    }
});

export default CampaignInfoModal;