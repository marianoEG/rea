import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView, ScrollView, Switch } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Select from '../../components/Select';
import { theme } from '../../core/theme';
import { Fonts } from '../../utils/fonts';
import TextInputLabeled from '../../components/TextInputLabeled';
import ButtonText from '../../components/Buttons/ButtonText';
import { useDealerShipsQuoteForm } from '../../hooks/useDealerShipsQuoteForm';
import ButtonRound from '../../components/Buttons/ButtonRound';
import { Divider, HelperText, RadioButton, Snackbar } from 'react-native-paper';
import { ActionSheetIdEnum, ContactPreferenceEnum, DocumentTypeEnum } from '../../utils/constants';
import { getDocumentTypeStr, isValidEmail } from '../../utils/utils';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../utils/rootNavigation';
import { Screens } from '../../navigation/Screens';
import ActionSheetSelectItems from '../../components/ActionSheetSelectItems';
import { SheetManager } from 'react-native-actions-sheet';
import { QuoteForm } from '../../model/form/QuoteForm';
import { VehicleVersion } from '../../model/VehicleVersion';
import { Vehicle } from '../../model/Vehicle';

type InputFormType = 'firstname' | 'lastname' | 'documentType' | 'documentValue' | 'email' | 'pointOfSale' | 'vehicleOfInterest' | 'vehicleVersionOfInterest' | 'phoneArea' | 'phoneValidation' | 'phone' | 'contactPreference' | 'receiveInformation' | 'acceptConditions';

const DelaerShipQuoteForm = () => {
    const [isSubmited, setIsSubmited] = useState<boolean>(false);
    const [formParam, setFormParam] = useState<QuoteForm>();
    const [dealershipCode, setDealershipCode] = useState<string>();
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [documentType, setDocumentType] = useState<DocumentTypeEnum | undefined>(DocumentTypeEnum.DNI);
    const [documentNumber, setDocumentNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [pointOfSale, setPointOfSale] = useState<string>("");
    const [vehicleOfInterest, setVehicleOfInterest] = useState<Vehicle>();
    const [vehicleVersionOfInterest, setVehicleVersionOfInterest] = useState<VehicleVersion>();
    const [phoneArea, setPhoneArea] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [contactPreference, setContactPreference] = useState<ContactPreferenceEnum>(ContactPreferenceEnum.WHATSAPP);
    const [receiveInformation, setReceiveInformation] = useState<boolean>(true);
    const [acceptConditions, setAcceptConditions] = useState<boolean>(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState<string | null>(null);
    const { isSavingForm, saveForm, showTerms } = useDealerShipsQuoteForm();
    const route = useRoute<RouteProp<RootStackParams, Screens.DelaerShipQuoteForm>>();

    const documentTypes = useMemo(() => {
        return [
            { id: 1, name: DocumentTypeEnum.CUIL },
            { id: 2, name: DocumentTypeEnum.CUIT },
            { id: 3, name: DocumentTypeEnum.DNI },
            { id: 4, name: DocumentTypeEnum.LC },
            { id: 5, name: DocumentTypeEnum.LE }
        ];
    }, []);

    useEffect(() => {
        if (route.params?.dealership) {
            const dealerShip = route.params!.dealership!;
            const province = dealerShip.provinceName;
            const locality = dealerShip.localityName;
            const name = dealerShip.name;
            const address = dealerShip.streetNameAndNumber;
            setPointOfSale(`${province ?? ''}, ${locality ?? ''} - ${name ?? ''} - ${address ?? ''}`);
            setDealershipCode(dealerShip.dealerCode);
        }
        if (route.params?.vehicle) {
            setVehicleOfInterest(route.params?.vehicle);
        }
        if (route.params?.vehicleVersion) {
            setVehicleVersionOfInterest(route.params?.vehicleVersion);
        }
        if (route.params.quoteForm) {
            const form = JSON.parse(route.params.quoteForm) as QuoteForm;
            console.log('useEffect - route.params - form:', form);
            setFormParam(form);
            setDealershipCode(form.dealershipCode ?? '');
            setFirstname(form.firstname ?? '');
            setLastname(form.lastname ?? '');
            setDocumentType(form.documentType);
            setDocumentNumber(form.documentNumber ?? '');
            setEmail(form.email ?? '');
            setPointOfSale(form.pointOfSale ?? '');
            setVehicleOfInterest({
                id: form.vehicleId,
                name: form.vehicleName
            });
            setVehicleVersionOfInterest({
                id: form.vehicleVersionId,
                name: form.vehicleVersionName,
                modelYear: form.vehicleModelYear,
                tma: form.vehicleTMA,
                seq: form.vehicleSEQ
            });
            setPhoneArea(form.phoneArea ?? '');
            setPhone(form.phone ?? '');
            setContactPreference(form.contactPreference ?? ContactPreferenceEnum.WHATSAPP);
            setReceiveInformation(form.receiveInformation == true);
            setAcceptConditions(form.acceptConditions == true);
        }
    }, [route.params])

    const openDocumentTypeSheet = () => {
        SheetManager.show(ActionSheetIdEnum.QOUTE_FORM_DOCUMENT_TYPES);
    }

    const onSelectDocumentType = (id: number) => {
        setDocumentType(documentTypes.find(dt => dt.id == id)?.name);
    }

    const onPressSave = () => {
        if (isSavingForm) return;

        setIsSubmited(true);
        const isAnyError = hasErrors('firstname', false) || hasErrors('lastname', false) || hasErrors('documentType', false) || hasErrors('documentValue', false) || hasErrors('email', false) || hasErrors('pointOfSale', false) || hasErrors('phoneArea', false) || hasErrors('phone', false) || hasErrors('contactPreference', false);
        console.log("isAnyError:", isAnyError)
        if (!isAnyError) {
            if (hasErrors('phoneValidation', false))
                setSnackBarMessage("El código de area más el número de teléfono deben ser 10 dígitos.");
            else if (hasErrors('acceptConditions', false))
                setSnackBarMessage("Debe aceptar las condiciones de uso.");
            else {
                saveForm({
                    //eventId se setea en el hook
                    //eventName se setea en el hook
                    id: formParam?.id,
                    dealershipId: formParam?.dealershipId ?? route?.params?.dealership?.id,
                    dealershipName: formParam?.dealershipName ?? route?.params?.dealership?.name,
                    dealershipCode: formParam?.dealershipCode ?? route?.params.dealership?.dealerCode,
                    provinceId: formParam?.provinceId ?? route?.params?.dealership?.provinceId,
                    provinceName: formParam?.provinceName ?? route?.params?.dealership?.provinceName,
                    localityId: formParam?.localityId ?? route?.params?.dealership?.localityId,
                    localityName: formParam?.localityName ?? route?.params?.dealership?.localityName,
                    vehicleId: vehicleOfInterest?.id,
                    vehicleName: vehicleOfInterest?.name,
                    vehicleVersionId: vehicleVersionOfInterest?.id,
                    vehicleVersionName: vehicleVersionOfInterest?.name,
                    vehicleModelYear: vehicleVersionOfInterest?.modelYear,
                    vehicleTMA: vehicleVersionOfInterest?.tma,
                    vehicleSEQ: vehicleVersionOfInterest?.seq,
                    firstname,
                    lastname,
                    documentType,
                    documentNumber,
                    email,
                    pointOfSale,
                    phone,
                    phoneArea,
                    contactPreference,
                    receiveInformation,
                    acceptConditions,
                    createdOn: formParam?.createdOn,
                    modifiedOn: formParam?.modifiedOn,
                    isSynchronized: formParam?.isSynchronized,
                    syncDate: formParam?.syncDate
                });
            }
        }
    }

    const hasErrors = (type: InputFormType, checkSubmited: boolean = true) => {
        let isError = false;
        switch (type) {
            case 'firstname': isError = !firstname; break;
            case 'lastname': isError = !lastname; break;
            case 'documentType': isError = !documentType; break;
            case 'documentValue': isError = !documentNumber; break;
            case 'email': isError = !isValidEmail(email); break;
            case 'pointOfSale': isError = !pointOfSale; break;
            case 'vehicleOfInterest': isError = !vehicleOfInterest; break;
            case 'vehicleVersionOfInterest': isError = !vehicleVersionOfInterest; break;
            case 'phoneArea': isError = !phoneArea; break;
            case 'phone': isError = !phone; break;
            case 'contactPreference': isError = !contactPreference; break;
            case 'receiveInformation': isError = false; break;
            case 'acceptConditions': isError = !acceptConditions; break
            case 'phoneValidation': {
                const phoneAreaLength = phoneArea?.length ?? 0;
                const phoneLength = phone?.length ?? 0;
                isError = phoneAreaLength + phoneLength != 10;
                break;
            }
        }
        return checkSubmited ? isSubmited && isError : isError;
    };



    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.container}
                >
                    {/* Nombre y Apellido */}
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={[styles.col, { marginRight: 12 }]}>
                            <TextInputLabeled
                                title='Nombre'
                                error={hasErrors('firstname')}
                                placeholder='Ingrese nombre'
                                value={firstname}
                                onChangeText={text => setFirstname(text)}
                                editable={!isSavingForm}
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
                                editable={!isSavingForm}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('lastname')} >
                                Apellido es requerido
                            </HelperText>
                        </View>
                    </View>
                    {/* Tipo y Número de Documento */}
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={[styles.selectWrapper, { marginRight: 12 }]}>
                            <Text style={styles.selectTitle}>Tipo de documento</Text>
                            <Select
                                title={getDocumentTypeStr(documentType)}
                                placeholder='Seleccione tipo de documento...'
                                borderColor={hasErrors('documentType') ? '#B5122F' : ''}
                                onPress={openDocumentTypeSheet}
                                onClearPress={() => setDocumentType(undefined)}
                            />
                            <HelperText
                                style={styles.helperText}
                                type="error"
                                visible={hasErrors('documentType')} >
                                Tipo de documento es requerido
                            </HelperText>
                        </View>
                        <View style={[styles.col, { marginLeft: 12 }]}>
                            <TextInputLabeled
                                title='Nº documento'
                                keyboardType='numeric'
                                error={hasErrors('documentValue')}
                                placeholder='Ingrese nº documento'
                                value={documentNumber}
                                onChangeText={text => setDocumentNumber(text.replace(/[- #*+;,.<>=()\{\}\[\]\\\/]/gi, ''))}
                                editable={!isSavingForm}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('documentValue')} >
                                Número de documento es requerido
                            </HelperText>
                        </View>
                    </View>
                    {/* Email */}
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <TextInputLabeled
                                title='Email'
                                error={hasErrors('email')}
                                placeholder='Ingrese Email'
                                value={email}
                                keyboardType='email-address'
                                onChangeText={text => setEmail(text)}
                                conatinerStyle={[styles.col]}
                                editable={!isSavingForm}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('email')} >
                                Email es requerido
                            </HelperText>
                        </View>
                    </View>
                    {/* Puntos de Venta */}
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <TextInputLabeled
                                title='Punto de venta'
                                error={hasErrors('pointOfSale')}
                                value={pointOfSale}
                                conatinerStyle={[styles.col]}
                                editable={false}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('pointOfSale')} >
                                Punto de venta es requerido
                            </HelperText>
                        </View>
                    </View>
                    {/* Vehículo de interés */}
                    <View style={styles.row}>
                        <View style={[styles.col, { marginRight: 12 }]}>
                            <TextInputLabeled
                                title='Vehículo de interés'
                                error={hasErrors('vehicleOfInterest')}
                                value={vehicleOfInterest?.name ?? ''}
                                conatinerStyle={[styles.col]}
                                editable={false}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('vehicleOfInterest')} >
                                Vehículo de interés es requerido
                            </HelperText>
                        </View>
                        <View style={[styles.col, { marginLeft: 12 }]}>
                            <TextInputLabeled
                                title='Versión del vehículo'
                                error={hasErrors('vehicleVersionOfInterest')}
                                value={vehicleVersionOfInterest?.name ?? ''}
                                conatinerStyle={[styles.col]}
                                editable={false}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('vehicleVersionOfInterest')} >
                                Versión del Vehículo es requerido
                            </HelperText>
                        </View>
                    </View>
                    {/* Teléfono */}
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={[styles.col, { marginRight: 12 }]}>
                            <TextInputLabeled
                                title='Teléfono fijo o celular'
                                keyboardType='numeric'
                                error={hasErrors('phoneArea') || hasErrors('phoneValidation')}
                                placeholder='Código de area'
                                value={phoneArea}
                                onChangeText={text => setPhoneArea(text.replace(/[- #*+;,.<>=()\{\}\[\]\\\/]/gi, ''))}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('phoneArea')} >
                                Código de area es requerido
                            </HelperText>
                        </View>
                        <View style={[styles.col, { marginLeft: 12 }]}>
                            <TextInputLabeled
                                title='Nº de teléfono'
                                titleStyle={{ fontSize: RFValue(10.5), fontFamily: Fonts.FordAntennaWGLMedium, opacity: 0 }}
                                keyboardType='numeric'
                                error={hasErrors('phone') || hasErrors('phoneValidation')}
                                placeholder='Nº de teléfono'
                                value={phone}
                                onChangeText={text => setPhone(text.replace(/[- #*+;,.<>=()\{\}\[\]\\\/]/gi, ''))}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('phone')} >
                                Número de teléfono es requerido
                            </HelperText>
                        </View>
                    </View>

                    <View style={styles.RadioButtonWrapper}>
                        <Text style={styles.RadioButtonTitle}>
                            ¿Cómo preferís que te contactemos?
                        </Text>
                        <RadioButton.Group onValueChange={newValue => setContactPreference(newValue as ContactPreferenceEnum)} value={contactPreference ?? ContactPreferenceEnum.WHATSAPP}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <RadioButton value={ContactPreferenceEnum.PHONE_CALL} />
                                    <Text style={styles.RadioButtonText} onPress={() => setContactPreference(ContactPreferenceEnum.PHONE_CALL)}>Llamado telefónico</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                                    <RadioButton value={ContactPreferenceEnum.WHATSAPP} />
                                    <Text style={styles.RadioButtonText} onPress={() => setContactPreference(ContactPreferenceEnum.WHATSAPP)}>Whatsapp</Text>
                                </View>
                            </View>
                        </RadioButton.Group>
                    </View>

                    <Divider style={styles.sectionDivider} />

                    {/* Switch 1 */}
                    <View style={[styles.row, { marginTop: 30, marginBottom: 0 }]}>
                        <Switch
                            style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
                            trackColor={{ false: "#767577", true: theme.colors.primary }}
                            thumbColor={"#fff"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={value => { setReceiveInformation(value) }}
                            value={receiveInformation}
                            disabled={isSavingForm}
                        />
                        <Text style={styles.switchText}>
                            Quiero recibir información vía WhatsApp sobre productos y servicios Ford
                        </Text>
                    </View>
                    {/* Switch 2 */}
                    <View style={[styles.row, { marginTop: 30 }]}>
                        <Switch
                            style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }}
                            trackColor={{ false: "#767577", true: theme.colors.primary }}
                            thumbColor={"#fff"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={value => { setAcceptConditions(value) }}
                            value={acceptConditions}
                            disabled={isSavingForm}
                        />
                        <Text style={styles.switchText}>
                            Acepto las condiciones en materia de uso y protección de mis datos personales
                        </Text>
                    </View>
                    <ButtonText
                        title='Ver condiciones de uso'
                        color={theme.colors.primary}
                        textColor={theme.colors.primary}
                        onPress={showTerms}
                        style={{ alignSelf: 'flex-end', marginBottom: 48 }}
                    />
                    <View style={{ flex: 1 }}></View>
                    {/* Botón de Guardado */}
                    <ButtonRound
                        isLoading={isSavingForm}
                        loadingText={'Guardando...'}
                        title='Guardar'
                        contentStyle={{ width: '50%', alignSelf: 'center', marginBottom: 6, marginTop: 16 }}
                        onPress={onPressSave}
                    />
                </ScrollView>

                <Snackbar
                    duration={3000}
                    visible={!!snackBarMessage}
                    onDismiss={() => setSnackBarMessage(null)}
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
            </GestureHandlerRootView >

            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.QOUTE_FORM_DOCUMENT_TYPES}
                items={documentTypes}
                title={'Seleccione un tipo de documento'}
                emptyItemsText={''}
                onSelect={onSelectDocumentType}
                height={250}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        padding: 24,
        backgroundColor: theme.colors.appBackground,
        flexGrow: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2
    },
    col: {
        flex: 1
    },
    filterWrapper: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8
    },
    selectWrapper: {
        width: '100%',
        flex: 1
    },
    selectTitle: {
        marginBottom: 6,
        fontSize: RFValue(11.5),
        fontFamily: Fonts.FordAntennaWGLMedium,
        color: theme.colors.darkGrey
    },
    switchText: {
        flex: 1,
        marginLeft: 16,
        fontSize: RFValue(13),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.textDark
    },
    helperText: {
        fontSize: RFValue(11),
        fontFamily: Fonts.FordAntennaWGLLight
    },
    RadioButtonWrapper: {
        marginBottom: 24,
    },
    RadioButtonTitle: {
        marginBottom: 6,
        fontSize: RFValue(12),
        fontFamily: Fonts.FordAntennaWGLMedium,
        color: theme.colors.darkGrey
    },
    RadioButtonText: {
        color: theme.colors.textDark,
        fontSize: RFValue(12),
        fontFamily: Fonts.FordAntennaWGLLight,
    },
    sectionDivider: {
        width: '100%',
        height: RFValue(1),
        backgroundColor: '#000'
    }
});

export default DelaerShipQuoteForm;
