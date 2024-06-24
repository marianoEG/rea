import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { theme } from '../core/theme';
import { Divider, Snackbar } from 'react-native-paper';
import TextInputLabeled from '../components/TextInputLabeled';
import ButtonRound from '../components/Buttons/ButtonRound';
import { useCampaignsChecker } from '../hooks/useCampaignsChecker';
import { Fonts } from '../utils/fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CampaignsChecker = () => {
    const [patent, setPatent] = useState<string>("");
    const { isSearchingCampaign, searchCampaignAtLeastOnce, campaign, searchCampaign, snackBarMessage, dismissSnackBarMessage } = useCampaignsChecker();

    // Este componente se muestra cuando todavía no se realizaron búsquedas
    let searchHintContent: JSX.Element = <></>;
    if (!searchCampaignAtLeastOnce) {
        searchHintContent = (
            <View style={styles.notFoundTextWrapper}>
                <Text style={styles.notFoundText}>
                    Para realizar una búsqueda ingrese el VIN
                </Text>
                <Text style={styles.notFoundText}>
                    o la patente del vehículo y luego presione 'Buscar'.
                </Text>
            </View>
        )
    }

    // Este componente se muestra al realizar una busqueda y no encontrar resultados
    let notResultsFoundContent: JSX.Element = <></>;
    if (searchCampaignAtLeastOnce && !campaign) {
        notResultsFoundContent = (
            <View style={styles.notFoundTextWrapper}>
                <Icon
                    name='error-outline'
                    size={96}
                />
                <Text style={styles.notFoundText}>
                    No se encontraron resultados
                </Text>
                <Text style={styles.notFoundText}>
                    bajo el criterio de búsqueda actual.
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.patentWrapper}>
                    <TextInputLabeled
                        title='Patente o VIN'
                        placeholder='Ingrese patente o VIN'
                        value={patent}
                        onChangeText={text => setPatent(text)}
                    />
                </View>
                <ButtonRound
                    isLoading={isSearchingCampaign}
                    loadingText={'Buscando...'}
                    title='Buscar'
                    contentStyle={{ width: 250 }}
                    onPress={() => { searchCampaign(patent) }}
                />
            </View>

            {searchHintContent}
            {notResultsFoundContent}
            {
                campaign &&
                <>
                    {/* <Divider style={{ width: '100%', height: RFValue(1), marginTop: 24 }} /> */}
                    <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 48 }}>
                        {/* Patente y VIN */}
                        <View style={[styles.row, { marginBottom: 24 }]}>
                            <View style={[{ flex: 1, marginRight: 12 }]}>
                                <TextInputLabeled
                                    title='Patente'
                                    value={campaign.pat ?? '-'}
                                    editable={false}
                                    outlineColor={'#CED4DA'}
                                    backgroundColor='#ffffff7A'
                                    textColor='#495057'
                                />
                            </View>
                            <View style={[{ flex: 1, marginLeft: 12 }]}>
                                <TextInputLabeled
                                    title='VIN'
                                    value={campaign.vin ?? '-'}
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
                                    value={campaign.cc ?? '-'}
                                    editable={false}
                                    outlineColor={'#CED4DA'}
                                    backgroundColor='#ffffff7A'
                                    textColor='#495057'
                                />
                            </View>
                            <View style={[{ flex: 1, marginLeft: 12 }]}>
                                <TextInputLabeled
                                    title='Service'
                                    value={campaign.serv ?? '-'}
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
                                    value={campaign.fecha_serv ?? '-'}
                                    editable={false}
                                    outlineColor={'#CED4DA'}
                                    backgroundColor='#ffffff7A'
                                    textColor='#495057'
                                />
                            </View>
                            <View style={[{ flex: 1, marginLeft: 12 }]}>
                                <TextInputLabeled
                                    multiline={true}
                                    title='Mantenimiento'
                                    //value={'Que pasa si el texto para este campo es demasiado largo? se puede visualizar bien? entran todas y cada una de las palabras? ehhhhhhhhh?'}
                                    value={campaign.manten ?? '-'}
                                    editable={false}
                                    outlineColor={'#CED4DA'}
                                    backgroundColor='#ffffff7A'
                                    textColor='#495057'
                                />
                            </View>
                        </View>
                    </ScrollView>
                </>
            }

            <Snackbar
                duration={3000}
                visible={!!snackBarMessage}
                onDismiss={dismissSnackBarMessage}
                action={{
                    label: 'Cerrar',
                    color: theme.colors.textLight
                }}
                style={{
                    backgroundColor: '#323232',
                }}
            >
                <Text style={{ fontSize: RFValue(13) }}>
                    {snackBarMessage}
                </Text>
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: theme.colors.appBackground
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    patentWrapper: {
        flex: 1,
        marginRight: 24
    },
    notFoundTextWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 24,
    },
    notFoundText: {
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    }
});

export default CampaignsChecker;
