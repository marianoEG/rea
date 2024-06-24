import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Modal } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import VehicleDetailImage from '../../components/VehicleDetail/VehicleDetailImage';
import VehicleDetailTopbar from '../../components/VehicleDetail/VehicleDetailTopbar';
import VehicleDetailComparatorSelection from '../../components/VehicleDetail/VehicleDetailComparatorSelection';
import VehicleDetailTechnicalSpecifications from '../../components/VehicleDetail/VehicleDetailTechnicalSpecifications';
import CustomTabs from '../../components/CustomTabs';
import { useVehicleDetail } from '../../hooks/useVehicleDetail';
import VehicleDetailColorGallery from '../../components/VehicleDetail/VehicleDetailColorGallery';
import VehicleDetailImageGallery from '../../components/VehicleDetail/VehicleDetailImageGallery';
import VehicleDetailMoreOptions from '../../components/VehicleDetail/VehicleDetailMoreOptions';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import VehicleDetailAccessories from '../../components/VehicleDetail/VehicleDetailAccessories';
import { ActionSheetIdEnum } from '../../utils/constants';
import ActionSheetSelectItems from '../../components/ActionSheetSelectItems';
import { SheetManager } from 'react-native-actions-sheet';

const topBarHeight: number = 56;
const vehicleImageHeight: number = 350;

const VehicleDetail = () => {
    const {
        vehicle,
        isGettingVehicle,
        onSelectVersion,
        navigateToCompareVersions,
        navigateToNewsletter,
        navigateToDealerShips,
        navigateToTestDrive
    } = useVehicleDetail();

    if (isGettingVehicle) {
        return (
            <View style={styles.loadingWrapper}>
                <ActivityIndicator
                    size='large'
                    color={theme.colors.accent}
                />
                <Text style={styles.loadingText}>
                    Cargando ...
                </Text>
            </View>
        )
    }

    if (!vehicle) {
        return (
            <View style={styles.vehicleNotFoundWrapper}>
                <Text style={styles.vehicleNotFoundText}>
                    No se encontró el vehículo
                </Text>
            </View>
        )
    }

    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <>
                    {/* TopBar */}
                    <View style={styles.topbarWrapper}>
                        <VehicleDetailTopbar
                            versions={vehicle.versions ?? []}
                            onPressVehicleVersion={() => SheetManager.show(ActionSheetIdEnum.VEHICLE_DETAIL_VERSIONS)}
                        />
                    </View>
                    {/* Vehicle Iamge */}
                    <VehicleDetailImage
                        vehicleName={vehicle.name}
                        height={vehicleImageHeight}
                    />
                    {/* 'Más Información', 'Contacto con dealers' */}
                    <CustomTabs
                        labels={['Espec.', 'Galería', 'Colores', 'Accesorios', 'Comparador', 'Forms']}
                        tabAligment={'bottom'}
                    >
                        {/* Especificaciones */}
                        <VehicleDetailTechnicalSpecifications
                            vehicle={vehicle}
                        />
                        {/* Imagenes */}
                        <VehicleDetailImageGallery
                            vehicle={vehicle}
                        />
                        {/* Colors */}
                        <VehicleDetailColorGallery
                            vehicle={vehicle}
                        />
                        {/* Accesorios */}
                        <VehicleDetailAccessories
                            vehicle={vehicle}
                        />
                        {/* Comparador */}
                        <VehicleDetailComparatorSelection
                            versions={vehicle.versions ?? []}
                            onAccept={navigateToCompareVersions}
                        />
                        {/* Formularios */}
                        <VehicleDetailMoreOptions
                            navigateToNewsletter={navigateToNewsletter}
                            navigateToDealerShips={navigateToDealerShips}
                            navigateToTestDrive={navigateToTestDrive}
                        />
                    </CustomTabs>
                </>
            </GestureHandlerRootView>
            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.VEHICLE_DETAIL_VERSIONS}
                items={vehicle?.versions?.map(v => { return { id: v.id!, name: v.name! } }) ?? []}
                title={'Seleccione una versión del vehículo'}
                emptyItemsText={'El vehículo no cuenta con versiones para seleccionar'}
                onSelect={onSelectVersion}
                height={300}
            />
        </>
    );
}

const styles = StyleSheet.create({
    //#region Loading
    loadingWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 8,
        fontSize: RFValue(15),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.accent
    },
    //#endregion
    //#region Not Found Vehicle
    vehicleNotFoundWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vehicleNotFoundText: {
        fontSize: RFValue(16),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    },
    //#endregion
    //#region Vehicle
    topbarWrapper: {
        position: 'absolute',
        width: '100%',
        height: topBarHeight,
        top: 0,
        zIndex: 2,
    }
    //#endregion
});

export default VehicleDetail;