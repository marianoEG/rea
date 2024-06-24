import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';
import { theme } from '../../core/theme';
import { format } from "date-fns";
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import { Guest } from '../../model/Guest';
import { getGuestStatusStr, getNextGuestStatus } from '../../utils/utils';
import ButtonIcon from '../Buttons/ButtonIcon';
import ButtonRound from '../Buttons/ButtonRound';
import { GuestStatusEnum } from '../../utils/constants';
import { Col, Row } from 'react-native-easy-grid';
import { changeGuestStatus } from '../../utils/db';
import { useDbContext } from '../../context/DbContext';

interface Props {
    guest: Guest;
    onPressEdit?: () => void;
    onStatusChange: (status: GuestStatusEnum) => void;
}
const GuestItem = ({ guest, onPressEdit, onStatusChange }: Props) => {
    const lastItemId = useRef(guest.id);
    const [status, setStatus] = useState<GuestStatusEnum | undefined>(guest.status);
    if (guest.id !== lastItemId.current) {
        lastItemId.current = guest.id;
        setStatus(guest.status);
    }
    const [isChangingStatus, setIsChangingStatus] = useState<boolean>(false);
    const { db } = useDbContext();

    const changeStatus = (): void => {
        if (isChangingStatus) return;

        setIsChangingStatus(true);
        const currentStatus = guest.status;
        const nextStatus = getNextGuestStatus(guest.status);
        const isSynchronized = guest.isSynchronized;
        guest.isSynchronized = false;
        guest.status = nextStatus;
        setStatus(nextStatus);
        changeGuestStatus(db!, guest.id!, nextStatus)
            .then(saved => {
                if (!saved) {
                    guest.isSynchronized = isSynchronized;
                    guest.status = currentStatus;
                    setStatus(currentStatus);
                } else {
                    onStatusChange(nextStatus);
                }
                setIsChangingStatus(false);
            });
    }

    const getGuestStatusColor = useCallback((status?: GuestStatusEnum): string => {
        switch (status) {
            case GuestStatusEnum.PRESENT: return "#03A9F4";
            case GuestStatusEnum.ABSENT_WITH_NOTICE: return "#FF5722";
            case GuestStatusEnum.ABSENT: return "#FFC107";
            default: return "FFC107";
        }
    }, [])

    const getSafeStr = useCallback((text?: string): string => {
        return text?.trim() ? text?.trim() : '-';
    }, [])

    return (
        <Row style={styles.tableRow}>
            <Col style={{ width: 120, marginRight: 4 }}>
                <Text style={styles.tableRowText}>
                    {guest.lastname + ' ' + guest.firstname}
                </Text>
            </Col>
            <Col style={{ width: 80 }}>
                <Text style={styles.tableRowText}>
                    {getSafeStr(guest?.documentNumber)}
                </Text>
            </Col>
            <Col>
                <Text style={styles.tableRowText}>
                    {getSafeStr(guest?.observations3)}
                </Text>
            </Col>
            <Col style={{ width: 160 }}>
                <TouchableRipple
                    onPress={changeStatus}
                    rippleColor={getGuestStatusColor(guest.status) + '2B'}
                    style={{ borderRadius: 24, paddingHorizontal: 4 }}
                    borderless>
                    <Row style={{ alignItems: 'center', width: '100%', height: '100%' }}>
                        <View style={[styles.statusBadge, { backgroundColor: getGuestStatusColor(guest.status) }]}></View>
                        <ButtonRound
                            contentStyle={{ height: 42 }}
                            title={getGuestStatusStr(status)}
                            textStyle={{ color: getGuestStatusColor(guest.status), fontSize: RFValue(9) }}
                            reverse={true}
                            // onPress={changeStatus}
                            // rippleColor={getGuestStatusColor(guest.status) + '2B'}
                            isTransparent={true}
                            paddingHorizontal={8}
                        />
                    </Row>
                </TouchableRipple>
            </Col>
            <Col style={{ width: 36 }}>
                <View>
                    <ButtonIcon
                        icon='edit'
                        size={24}
                        onPress={onPressEdit}
                        color={theme.colors.primary}
                    />
                </View>
            </Col>
        </Row>
    )
}

const styles = StyleSheet.create({
    tableRow: {
        height: 56,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderBottomColor: '#00000010',
        borderBottomWidth: RFValue(1),
    },
    tableRowText: {
        fontSize: RFValue(9),
        fontFamily: Fonts.FordAntennaWGLLight,
        color: theme.colors.textDark
    },
    statusBadge: {
        width: 14,
        height: 15,
        marginRight: 2,
        borderRadius: 500,
        borderColor: '#0000002A',
        borderWidth: RFValue(1)
    },
});

export default GuestItem;