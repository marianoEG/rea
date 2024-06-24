import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { theme } from '../core/theme';
import { RFValue } from "react-native-responsive-fontsize";
import { Fonts } from '../utils/fonts';
import { PieChartGuestValues } from '../utils/constants';
import { PieChart } from "react-native-chart-kit";

const PIE_CHART_SIZE: number = 180;

interface Props {
    values: PieChartGuestValues,
    isLoading: boolean
}
const PieChartGuest = ({ values, isLoading: isGettingSubEvent }: Props) => {

    const canShowPieChart = (): boolean => {
        return values && (values.presentCount > 0 || values.absentCount > 0 || values.absentWithNoticeCount > 0);
    }

    if (isGettingSubEvent) {
        return (
            <View style={styles.container}>
                <View style={styles.pieChartWrapper}>
                    <ActivityIndicator size={'large'} />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.pieChartWrapper}>
                {
                    canShowPieChart()
                        ?
                        <PieChart
                            data={
                                [
                                    {
                                        name: "Presentes",
                                        count: values.presentCount,
                                        color: "#03A9F4"

                                    },
                                    {
                                        name: "Ausentes",
                                        count: values.absentCount,
                                        color: "#FFC107"
                                    },
                                    {
                                        name: "Ausentes con aviso",
                                        count: values.absentWithNoticeCount,
                                        color: "#FF5722"
                                    }
                                ]
                            }
                            hasLegend={false}
                            width={PIE_CHART_SIZE}
                            height={PIE_CHART_SIZE}
                            chartConfig={{
                                width: PIE_CHART_SIZE,
                                height: PIE_CHART_SIZE,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
                            }}
                            accessor={"count"}
                            backgroundColor={"transparent"}
                            paddingLeft={'0'}
                            center={[62, 0]}
                            absolute={true}
                        />
                        :
                        <View style={styles.notValuesToShow}></View>
                }
            </View>
            <View style={styles.pieChartLeyend}>
                <View style={styles.pieChartLeyendContent}>
                    <View style={[styles.pieChartLeyendBadge, { backgroundColor: "#03A9F4" }]}></View>
                    <Text style={styles.pieChartLeyendText}>Presentes: {values.presentCount ?? 0}</Text>
                </View>
                <View style={styles.pieChartLeyendContent}>
                    <View style={[styles.pieChartLeyendBadge, { backgroundColor: "#FFC107" }]}></View>
                    <Text style={styles.pieChartLeyendText}>Ausentes: {values.absentCount ?? 0}</Text>
                </View>
                <View style={styles.pieChartLeyendContent}>
                    <View style={[styles.pieChartLeyendBadge, { backgroundColor: "#FF5722" }]}></View>
                    <Text style={styles.pieChartLeyendText}>Ausentes con aviso: {values.absentWithNoticeCount ?? 0}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pieChartWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: PIE_CHART_SIZE
    },
    pieChartLeyend: {
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        marginTop: 8,
        marginEnd: 70
    },
    pieChartLeyendContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 12
    },
    pieChartLeyendBadge: {
        width: 16,
        height: 16,
        borderRadius: 500,
        borderColor: '#0000002A',
        borderWidth: RFValue(1)
    },
    pieChartLeyendText: {
        fontSize: RFValue(12),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark,
        marginStart: 8,
        marginBottom: 4
    },
    notValuesToShow: {
        width: 250,
        height: 250,
        borderRadius: 500,
        borderColor: '#0000002A',
        borderWidth: RFValue(1)
    }
});

export default PieChartGuest;