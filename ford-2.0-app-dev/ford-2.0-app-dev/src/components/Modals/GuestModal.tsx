import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Dialog, Divider, HelperText, Modal, Portal, Text } from 'react-native-paper';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch } from 'react-redux';
import { Fonts } from '../../utils/fonts';
import ButtonRound from '../Buttons/ButtonRound';
import TextInputLabeled from '../TextInputLabeled';
import { hideCampaignModal } from '../../store/action/campaignModalAction';
import { Guest } from '../../model/Guest';
import ActionSheetSelectItems from '../ActionSheetSelectItems';
import { ActionSheetIdEnum, GuestStatusEnum, GuestTypeEnum } from '../../utils/constants';
import { SheetManager } from 'react-native-actions-sheet';
import Select from '../Select';
import { getGuestStatusStr, getGuestTypeStr } from '../../utils/utils';
import { heightPercentageToDP } from '../../utils/Size';

type InputFormType = 'firstname' | 'lastname' | 'type' | 'email' | 'phone' | 'dni' | 'carPlate' | 'companionReference' | 'status' | 'zone' | 'observation1' | 'observation2' | 'observation3';

interface Props {
    isVisible: boolean;
    guest?: Guest;
    save: (guest: Guest) => void;
    closeModal: () => void;
}
const GuestModal = ({ isVisible, guest, save, closeModal }: Props) => {
    const [isSubmited, setIsSubmited] = useState<boolean>(false);
    const [id, setId] = useState<number>();
    const [serverId, setServerId] = useState<number>();
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [type, setType] = useState<GuestTypeEnum | undefined>(GuestTypeEnum.OWNER);
    const [status, setStatus] = useState<GuestStatusEnum | undefined>(GuestStatusEnum.ABSENT);
    const [email, setEmail] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [documentNumber, setDocumentNumber] = useState<string>("");
    const [carLicencePlate, setCarLicencePlate] = useState<string>("");
    const [companionReference, setCompanionReference] = useState<string>("");
    const [zone, setZone] = useState<string>("");
    const [observations1, setObservations1] = useState<string>("");
    const [observations2, setObservations2] = useState<string>("");
    const [observations3, setObservations3] = useState<string>("");

    const guestTypes = useMemo(() => {
        return [
            { id: 1, name: getGuestTypeStr(GuestTypeEnum.OWNER) },
            { id: 2, name: getGuestTypeStr(GuestTypeEnum.COMPANION) }
        ];
    }, []);

    const statuses = useMemo(() => {
        return [
            { id: 1, name: getGuestStatusStr(GuestStatusEnum.PRESENT) },
            { id: 2, name: getGuestStatusStr(GuestStatusEnum.ABSENT) },
            { id: 3, name: getGuestStatusStr(GuestStatusEnum.ABSENT_WITH_NOTICE) },
        ];
    }, []);

    useEffect(() => {
        if (isVisible)
            initForm();
    }, [isVisible])

    const initForm = () => {
        setIsSubmited(false);
        setId(guest?.id);
        setServerId(guest?.serverId);
        setFirstname(guest?.firstname ?? "");
        setLastname(guest?.lastname ?? "");
        setType(guest?.type ?? GuestTypeEnum.OWNER);
        setEmail(guest?.email ?? "");
        setPhoneNumber(guest?.phoneNumber ?? "");
        setDocumentNumber(guest?.documentNumber ?? "");
        setCarLicencePlate(guest?.carLicencePlate ?? "");
        setCompanionReference(guest?.companionReference ?? "");
        setStatus(guest?.status ?? GuestStatusEnum.ABSENT);
        setZone(guest?.zone ?? "");
        setObservations1(guest?.observations1 ?? "");
        setObservations2(guest?.observations2 ?? "");
        setObservations3(guest?.observations3 ?? "");
    }

    const isEditMode = (): boolean => {
        return !!guest;
    }

    const onSelectType = (typeId: number) => {
        switch (typeId) {
            case 1:
                setType(GuestTypeEnum.OWNER)
                break;
            case 2:
                setType(GuestTypeEnum.COMPANION)
                break;
        }
    }

    const onSelectStatus = (statusId: number) => {
        switch (statusId) {
            case 1:
                setStatus(GuestStatusEnum.PRESENT)
                break;
            case 2:
                setStatus(GuestStatusEnum.ABSENT)
                break;
            case 3:
                setStatus(GuestStatusEnum.ABSENT_WITH_NOTICE)
                break;
        }
    }

    const hasErrors = (inputType: InputFormType, checkSubmited: boolean = true) => {
        let isError = false;
        switch (inputType) {
            case 'firstname': isError = !firstname;
                break;
            case 'lastname': isError = !lastname;
                break;
            case 'type': isError = !type;
                break;
            case 'status': isError = !status;
        }
        return checkSubmited ? isSubmited && isError : isError;
    };

    const onPressSave = () => {
        setIsSubmited(true);
        const isAnyError = hasErrors('firstname', false) || hasErrors('lastname', false) || hasErrors('type', false) || hasErrors('status', false);
        if (!isAnyError) {
            save({
                id,
                serverId,
                firstname,
                lastname,
                type,
                email,
                phoneNumber,
                documentNumber,
                carLicencePlate,
                companionReference,
                status,
                zone,
                observations1,
                observations2,
                observations3
            });
        }
    }

    return (
        <Portal>
            <Dialog
                visible={isVisible}
                // contentContainerStyle={styles.modal}
                style={styles.modal}
                dismissable={true}
                onDismiss={closeModal}
            >
                <Text
                    style={styles.title}>
                    {isEditMode() ? 'Editar Invitado' : 'Nuevo Invitado'}
                </Text>
                <Divider
                    style={{ width: '100%', height: RFValue(1) }}
                />
                <Dialog.ScrollArea>
                    <ScrollView>
                        <View style={styles.content}>
                            {/* Nombre y Apellido */}
                            <View style={[styles.row, { alignItems: 'flex-start', height: 100 }]}>
                                <View style={[styles.col, { marginRight: 12 }]}>
                                    <TextInputLabeled
                                        title='Nombre'
                                        error={hasErrors('firstname')}
                                        placeholder='Ingrese nombre'
                                        value={firstname}
                                        returnKeyType="next"
                                        onChangeText={text => setFirstname(text)}
                                    />
                                    <HelperText style={styles.helperText} type="error" visible={hasErrors('firstname')} >
                                        Nombre es requerido
                                    </HelperText>
                                </View>
                                <View style={[styles.col, { marginLeft: 12 }]}>
                                    <TextInputLabeled
                                        title='Apellido'
                                        error={hasErrors('lastname')}
                                        placeholder='Ingrese apellido'
                                        value={lastname}
                                        onChangeText={text => setLastname(text)}
                                    />
                                    <HelperText style={styles.helperText} type="error" visible={hasErrors('lastname')} >
                                        Apellido es requerido
                                    </HelperText>
                                </View>
                            </View>
                            {/* Tipo y Email */}
                            <View style={[styles.row, { alignItems: 'flex-start', height: 100 }]}>
                                <View style={[styles.selectWrapper, { marginRight: 12 }]}>
                                    <Text style={styles.selectTitle}>Tipo</Text>
                                    <Select
                                        title={getGuestTypeStr(type)}
                                        placeholder='Seleccione tipo...'
                                        borderColor={hasErrors('type') ? '#B5122F' : ''}
                                        onPress={() => SheetManager.show(ActionSheetIdEnum.GUEST_MODAL_TYPE)}
                                        onClearPress={() => setType(undefined)}
                                    />
                                    <HelperText
                                        style={styles.helperText}
                                        type="error"
                                        visible={hasErrors('type')} >
                                        Tipo es requerido
                                    </HelperText>
                                </View>
                                <View style={[styles.col, { marginLeft: 12 }]}>
                                    <TextInputLabeled
                                        title='Email'
                                        placeholder='Ingrese email'
                                        value={email}
                                        keyboardType='email-address'
                                        onChangeText={text => setEmail(text)}
                                    />
                                </View>
                            </View>
                            {/* Teléfono y Dni */}
                            <View style={[styles.row, { alignItems: 'flex-start', height: 100 }]}>
                                <View style={[styles.col, { marginRight: 12 }]}>
                                    <TextInputLabeled
                                        title='Teléfono'
                                        placeholder='Ingrese teléfono'
                                        value={phoneNumber}
                                        keyboardType='numeric'
                                        onChangeText={text => setPhoneNumber(text)}
                                    />
                                </View>
                                <View style={[styles.col, { marginLeft: 12 }]}>
                                    <TextInputLabeled
                                        title='Nº documento'
                                        placeholder='Ingrese nº documento'
                                        value={documentNumber}
                                        keyboardType='numeric'
                                        onChangeText={text => setDocumentNumber(text)}
                                    />
                                </View>
                            </View>
                            {/* Patente y Referencia Acompañante */}
                            <View style={[styles.row, { alignItems: 'flex-start', height: 100 }]}>
                                <View style={[styles.col, { marginRight: 12 }]}>
                                    <TextInputLabeled
                                        title='Patente'
                                        placeholder='Ingrese patente'
                                        value={carLicencePlate}
                                        onChangeText={text => setCarLicencePlate(text)}
                                    />
                                </View>
                                <View style={[styles.col, { marginLeft: 12 }]}>
                                    <TextInputLabeled
                                        title='Referencia de acompañante'
                                        placeholder='Ingrese referencia'
                                        value={companionReference}
                                        onChangeText={text => setCompanionReference(text)}
                                    />
                                </View>
                            </View>
                            {/* Zona */}
                            <View style={[styles.row, { alignItems: 'flex-start', height: 100 }]}>
                                <View style={[styles.selectWrapper, { marginRight: 12 }]}>
                                    <Text style={styles.selectTitle}>Estado</Text>
                                    <Select
                                        title={getGuestStatusStr(status, false)}
                                        placeholder='Seleccione estado...'
                                        borderColor={hasErrors('status') ? '#B5122F' : ''}
                                        onPress={() => SheetManager.show(ActionSheetIdEnum.GUEST_MODAL_STATUS)}
                                        onClearPress={() => setStatus(undefined)}
                                    />
                                    <HelperText
                                        style={styles.helperText}
                                        type="error"
                                        visible={hasErrors('status')} >
                                        Estado es requerido
                                    </HelperText>
                                </View>
                                <View style={[styles.col, { marginLeft: 12 }]}>
                                    <TextInputLabeled
                                        title='Zona'
                                        placeholder='Ingrese zona'
                                        value={zone}
                                        onChangeText={text => setZone(text)}
                                    />
                                </View>
                            </View>
                            {/* Observación 1 */}
                            <View style={[styles.row, { alignItems: 'flex-start', height: 100 }]}>
                                <View style={[styles.col]}>
                                    <TextInputLabeled
                                        title='Observación 1'
                                        placeholder='Ingrese observación 1'
                                        value={observations1}
                                        onChangeText={text => setObservations1(text)}
                                    />
                                </View>
                            </View>
                            {/* Observación 2 */}
                            <View style={[styles.row, { alignItems: 'flex-start', height: 100 }]}>
                                <View style={[styles.col]}>
                                    <TextInputLabeled
                                        title='Observación 2'
                                        placeholder='Ingrese observación 2'
                                        value={observations2}
                                        onChangeText={text => setObservations2(text)}
                                    />
                                </View>
                            </View>
                            {/* Observación 2 */}
                            <View style={[styles.row, { alignItems: 'flex-start', height: 100 }]}>
                                <View style={[styles.col]}>
                                    <TextInputLabeled
                                        title='Observación 3'
                                        placeholder='Ingrese observación 3'
                                        value={observations3}
                                        onChangeText={text => setObservations3(text)}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </Dialog.ScrollArea>
                <Divider
                    style={{ width: '100%', height: RFValue(1), marginBottom: 24 }}
                />
                <View style={[styles.row, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ButtonRound
                        title='Cerrar'
                        textStyle={{ color: theme.colors.warn }}
                        reverse={true}
                        onPress={closeModal}
                        rippleColor={theme.colors.warn + '2B'}
                        isTransparent={true}
                    />
                    <ButtonRound
                        title='Guardar'
                        onPress={onPressSave}
                    />
                </View>

            </Dialog>
            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.GUEST_MODAL_TYPE}
                items={guestTypes}
                title={'Seleccione tipo de invitado'}
                emptyItemsText={''}
                onSelect={onSelectType}
                height={250}
            />
            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.GUEST_MODAL_STATUS}
                items={statuses}
                title={'Seleccione el estado del invitado'}
                emptyItemsText={''}
                onSelect={onSelectStatus}
                height={250}
            />
        </Portal>

    )
}

const styles = StyleSheet.create({
    modal: {
        width: '90%',
        maxHeight: '95%',
        backgroundColor: '#fff',
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
        paddingVertical: 18,
        paddingHorizontal: 28
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    col: {
        flex: 1
    },
    selectWrapper: {
        width: '100%',
        flex: 1
    },
    selectTitle: {
        marginBottom: 4,
        fontSize: RFValue(11.5),
        fontFamily: Fonts.FordAntennaWGLMedium,
        color: theme.colors.darkGrey
    },
    helperText: {
        fontSize: RFValue(11),
        fontFamily: Fonts.FordAntennaWGLLight
    }
});

export default GuestModal;