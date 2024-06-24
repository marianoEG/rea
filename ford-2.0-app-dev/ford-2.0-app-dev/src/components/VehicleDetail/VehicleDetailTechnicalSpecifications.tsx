
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../../utils/fonts';
import { DefaultRootState, useSelector } from 'react-redux';
import { Vehicle } from '../../model/Vehicle';
import { vehicleTechnicalSpecifications } from '../../dummy/vehicleTechnicalSpecifications';
import { Col, Grid, Row } from 'react-native-easy-grid';
import { VehicleFeatureGroup } from '../../model/VehicleFeatureGroup';
import { VehicleFeature } from '../../model/VehicleFeature';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
    vehicle?: Vehicle;
}

const VehicleDetailTechnicalSpecifications = ({ vehicle }: Props) => {
    const { vehicleVersion } = useSelector((st: DefaultRootState) => st.transient.vehicleFeatures);
    const [featuresGroups, setFeatureGroups] = useState<VehicleFeatureGroup[]>([]);

    useEffect(() => {
        console.log("Version Selected:", JSON.stringify(vehicleVersion));
        console.log("Features Groups:", JSON.stringify(vehicle?.featuresGroups));

        const featuresGroups: VehicleFeatureGroup[] = [];
        vehicle?.featuresGroups?.forEach(fg => {
            const features = fg.features?.filter(f => {
                const featureVersion1 = vehicleVersion?.features?.some(vf => vf.featureId == f.id);
                return !!featureVersion1;
            });
            if (features && features.length > 0)
                featuresGroups.push(fg);
        });

        setFeatureGroups(featuresGroups ?? []);
    }, [vehicleVersion]);

    const getFeatureValue = (featureId?: number): string => {
        const value = vehicleVersion?.features
            ?.find(f => f.featureId == featureId)
            ?.value;
        return value ?? '-';
    }

    if (featuresGroups.length == 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                    name='error-outline'
                    size={96}
                />
                <Text style={styles.featuresGroupsNotFound}>
                    No hay características para la versión seleccionada
                </Text>
            </View>
        )
    }

    return (
        <View style={[styles.container]}>
            <Grid>
                <ScrollView>
                    {
                        featuresGroups.map((group, index1) => {
                            //specifications?.map((group, index1) => {
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
                                                    group?.features?.map((feature, index2) => {
                                                        return (
                                                            <Row
                                                                key={`${index1}-${index2}`}
                                                                style={{
                                                                    flex: 0,
                                                                    backgroundColor: index2 % 2 == 0 ? '#0000000A' : theme.colors.transparent
                                                                }}>
                                                                <Col>
                                                                    <Text style={styles.textValue}>
                                                                        {feature.name}
                                                                    </Text>
                                                                </Col>
                                                                <Col>
                                                                    <Text style={styles.textValue}>
                                                                        {getFeatureValue(feature.id)}
                                                                        {/* {feature.value} */}
                                                                    </Text>
                                                                </Col>
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
        textAlign: 'left',
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    featuresGroupsNotFound: {
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(16),
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    featuresNotFound: {
        color: theme.colors.darkGrey,
        fontFamily: Fonts.FordAntennaWGLLight,
        fontSize: RFValue(13),
        textAlign: 'center',
        padding: 18
    }
});

export default VehicleDetailTechnicalSpecifications;