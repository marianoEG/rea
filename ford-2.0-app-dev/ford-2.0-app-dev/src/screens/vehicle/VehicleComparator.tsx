import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {  Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { VehicleVersion } from '../../model/VehicleVersion';
import { Screens } from '../../navigation/Screens';
import { Fonts } from '../../utils/fonts';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { theme } from '../../core/theme';
import { ScrollView } from 'react-native-gesture-handler';
import { Vehicle } from '../../model/Vehicle';
import { VehicleFeatureGroup } from '../../model/VehicleFeatureGroup';
import { RootStackParams } from '../../utils/rootNavigation';

const VehicleComparator = () => {
    const route = useRoute<RouteProp<RootStackParams, Screens.VehicleComparator>>();
    const [vehicle, setVehicle] = useState<Vehicle | undefined>(undefined);

    useEffect(() => {
        console.log("Vehicle Comparator", route.params);
        const vehicle = route.params.vehicle;
        if (vehicle) {
            vehicle.versions = route.params.versions?.filter(v => !!v);

            console.log("Vehicle Versions", JSON.stringify(vehicle.versions));
            const featuresGroups: VehicleFeatureGroup[] = [];
            vehicle?.featuresGroups?.forEach(fg => {
                const features = fg.features?.filter(f => {
                    const version1 = (vehicle.versions && vehicle.versions[0]) ? vehicle.versions[0] : null;
                    const version2 = (vehicle.versions && vehicle.versions[1]) ? vehicle.versions[1] : null;
                    const version3 = (vehicle.versions && vehicle.versions[2]) ? vehicle.versions[2] : null;

                    const featureVersion1 = version1?.features?.some(vf => vf.featureId == f.id);
                    const featureVersion2 = version2?.features?.some(vf => vf.featureId == f.id);
                    const featureVersion3 = version3?.features?.some(vf => vf.featureId == f.id);

                    return (featureVersion1 || featureVersion2 || featureVersion3);
                });
                if (features && features.length > 0)
                    featuresGroups.push(fg);
            });

            vehicle.featuresGroups = featuresGroups;
        }


        setVehicle(vehicle);
    }, [route.params]);

    const getFeatureValue = (version: VehicleVersion, featureId?: number): string => {
        const value = version.features
            ?.find(f => f.featureId == featureId)
            ?.value;
        return value ?? '-';
    }

    if (!vehicle || !vehicle.featuresGroups || vehicle.featuresGroups.length == 0) {
        return (
            <View style={[styles.container]}>
                <Text style={styles.featuresGroupsNotFound}>
                    No hay características para las versiones seleccionadas
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Grid>
                <Row style={styles.header}>
                    <Col style={{ justifyContent: 'center' }}>
                        <Text style={[styles.headerTitle, { textAlign: vehicle?.versions?.length == 1 ? 'left' : 'center' }]}>
                            Comparando
                        </Text>
                    </Col>
                    {
                        vehicle?.versions?.map((version, index) => (
                            <Col key={index} style={{ justifyContent: 'center' }}>
                                <Text style={[styles.headerTitle, { textAlign: vehicle?.versions?.length == 1 ? 'left' : 'center' }]}>
                                    {version.name}
                                </Text>
                            </Col>
                        ))
                    }
                </Row>
                <ScrollView>
                    {
                        vehicle?.featuresGroups?.map((group, index1) => {
                            return (
                                <View key={index1}>
                                    <Row style={styles.titleGruopWrapper}>
                                        <Text style={styles.titleGruopText}>
                                            {group.name}
                                        </Text>
                                    </Row>
                                    {
                                        (!group.features || group.features.length == 0)
                                            ?
                                            <>
                                                <Text style={styles.featuresNotFound}>
                                                    No se encontraron características para este grupo
                                                </Text>
                                            </>
                                            :
                                            <>
                                                {
                                                    group.features?.map((feature, index2) => {
                                                        return (
                                                            <Row
                                                                key={`${index1}-${index2}`}
                                                                style={{ flex: 0, backgroundColor: index2 % 2 == 0 ? '#0000000A' : theme.colors.transparent }}>
                                                                <Col>
                                                                    <Text style={[styles.textValue, { textAlign: vehicle?.versions?.length == 1 ? 'left' : 'center' }]}>
                                                                        {feature.name}
                                                                    </Text>
                                                                </Col>
                                                                {
                                                                    vehicle?.versions?.map((version, index3) => (
                                                                        <Col key={`${index1}-${index2}-${index3}`}>
                                                                            <Text style={[styles.textValue, { textAlign: vehicle?.versions?.length == 1 ? 'left' : 'center' }]}>
                                                                                {getFeatureValue(version, feature.id)}
                                                                            </Text>
                                                                        </Col>
                                                                    ))
                                                                }
                                                            </Row>
                                                        )
                                                    })
                                                }
                                            </>
                                    }
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </Grid>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.appBackground
    },
    header: {
        flex: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: RFValue(14),
        paddingVertical: 12,
        paddingHorizontal: 18,
        color: theme.colors.primary,
        fontFamily: Fonts.FordAntennaWGLLight
    },
    titleGruopWrapper: {
        height: 56,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    titleGruopText: {
        color: theme.colors.primary,
        fontFamily: Fonts.FordAntennaWGLRegular,
        fontSize: RFValue(13)
    },
    textValue: {
        color: theme.colors.textDark,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(12),
        textAlign: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    featuresGroupsNotFound: {
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(14),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    featuresNotFound: {
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(13),
        textAlign: 'center',
        padding: 18
    }
});

export default VehicleComparator;