import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Divider, Text, TouchableRipple } from 'react-native-paper';
import { theme } from '../../core/theme';
import { format } from "date-fns";
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import { ExtendedGuest, Guest } from '../../model/Guest';
import { getGuestStatusStr, getNextGuestStatus } from '../../utils/utils';
import ButtonIcon from '../Buttons/ButtonIcon';
import ButtonRound from '../Buttons/ButtonRound';
import { GuestStatusEnum } from '../../utils/constants';
import { Col, Row } from 'react-native-easy-grid';
import { changeGuestStatus } from '../../utils/db';
import { useDbContext } from '../../context/DbContext';

interface Props {
    guest: ExtendedGuest;
    isSyncingGuests: boolean;
    isDeletingGuests: boolean;
}
const GuestSyncItem = ({ guest, isSyncingGuests, isDeletingGuests }: Props) => {
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
                }
                setIsChangingStatus(false);
            });
    }

    const getGuestStatusColor = (status?: GuestStatusEnum): string => {
        switch (status) {
            case GuestStatusEnum.PRESENT: return "#03A9F4";
            case GuestStatusEnum.ABSENT_WITH_NOTICE: return "#FF5722";
            case GuestStatusEnum.ABSENT: return "#FFC107";
            default: return "FFC107";
        }
    }

    const getDateToShow = useCallback((createdOn?: Date, modifiedOn?: Date): string => {
        if (modifiedOn)
            return format(modifiedOn, 'dd/MM/yyyy HH:mm:ss');
        else if (createdOn)
            return format(createdOn, 'dd/MM/yyyy HH:mm:ss');
        else return format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    }, []);

    const getFullname = useCallback((guest: Guest): string => {
        const fullname = (guest.lastname ?? '') + ' ' + (guest.firstname ?? '');
        if (fullname.length > 11)
            return fullname.substring(0, 11) + '...';
        return fullname;
    }, []);

    return (
        <Row key={guest.id} style={styles.tableRow}>
            <Col style={{ width: 100 }}>
                <Text style={styles.tableRowText}>
                    {getDateToShow(guest.createdOn, guest.modifiedOn)}
                </Text>
            </Col>
            <Col style={{ width: 110 }}>
                <Text style={styles.tableRowText}>
                    {getFullname(guest)}
                </Text>
            </Col>
            <Col >
                <Text style={styles.tableRowText}>
                    {guest?.subEventName + ' (Turno tarde)'}
                </Text>
            </Col>
            <Col style={{ width: 160 }} >
                <TouchableRipple
                    onPress={changeStatus}
                    rippleColor={getGuestStatusColor(guest.status) + '2B'}
                    style={{ borderRadius: 24, paddingHorizontal: 4 }}
                    borderless>
                    <Row style={{ alignItems: 'center', width: '100%', height: '100%' }}>
                        <View style={[styles.statusBadge, { backgroundColor: getGuestStatusColor(guest.status) }]}></View>
                        <ButtonRound
                            contentStyle={{ height: 40 }}
                            title={getGuestStatusStr(status)}
                            textStyle={{ color: getGuestStatusColor(guest.status), fontSize: RFValue(9) }}
                            isTransparent={true}
                            paddingHorizontal={8}
                            disabled={isSyncingGuests}
                        />
                    </Row>
                </TouchableRipple>
            </Col>
        </Row >
    )
}

const styles = StyleSheet.create({
    tableRow: {
        height: 56,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingStart: 8,
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
        height: 14,
        marginRight: 2,
        borderRadius: 500,
        borderColor: '#0000002A',
        borderWidth: RFValue(1)
    },
});

export default GuestSyncItem;