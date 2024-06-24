import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SectionGrid } from 'react-native-super-grid';
import VehicleItem from '../../components/RowItems/VehicleItem';
import { theme } from '../../core/theme';
import { useVehicles } from '../../hooks/useVehicles';
import { Fonts } from '../../utils/fonts';
import { ActivityIndicator } from 'react-native-paper';

const Vehicles = () => {
    const { isGettingVehicles, sections, onSelectVehicle } = useVehicles();

    if (isGettingVehicles) {
        return (
            <View style={styles.loadingWrapper}>
                <ActivityIndicator
                    size='large'
                    color={theme.colors.accent}
                />
                <Text style={styles.loadingText}>
                    Obteniendo vehículos...
                </Text>
            </View>
        )
    }

    if (!sections || sections.length == 0) {
        return (
            <View style={styles.vehiclesNotFoundWrapper}>
                <Text style={styles.vehiclesNotFoundText}>
                    No se encontraron vehículos sincronizados
                </Text>
            </View>
        )
    }

    return (
        <SectionGrid
            showsVerticalScrollIndicator={false}
            spacing={20}
            maxItemsPerRow={1}
            sections={sections}
            style={styles.gridView}
            renderItem={({ item, section, index }) => (
                <VehicleItem
                    item={item}
                    height={330}
                    onPress={() => onSelectVehicle(item)}
                />
            )}
            renderSectionHeader={({ section }) => (
                <Text style={[styles.sectionHeader]}>
                    {section.title}
                </Text>
            )}
            stickySectionHeadersEnabled={false}
        />
    );
}

const styles = StyleSheet.create({
    //#region Loading
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.appBackground
    },
    loadingText: {
        marginTop: 8,
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.accent
    },
    //#endregion
    //#region Not Found Vehicle
    vehiclesNotFoundWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.appBackground
    },
    vehiclesNotFoundText: {
        fontSize: RFValue(16),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    },
    //#endregion
    gridView: {
        flex: 1,
        backgroundColor: theme.colors.appBackground
    },
    sectionHeader: {
        flex: 1,
        fontSize: RFValue(16),
        fontFamily: Fonts.FordAntennaWGLRegular,
        alignItems: 'center',
        //backgroundColor: '#636e7215',
        color: theme.colors.primary,
        padding: 14,
    },
});

export default Vehicles;