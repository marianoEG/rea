import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { GestureHandlerRootView, ScrollView, Switch } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import Select from '../../components/Select';
import { theme } from '../../core/theme';
import { Fonts } from '../../utils/fonts';
import TextInputLabeled from '../../components/TextInputLabeled';
import ButtonText from '../../components/Buttons/ButtonText';
import ButtonRound from '../../components/Buttons/ButtonRound';
import { Divider, HelperText, RadioButton, Snackbar } from 'react-native-paper';
import ActionSheetSelectItems from '../../components/ActionSheetSelectItems';
import { ActionSheetIdEnum, ContactPreferenceEnum, DocumentTypeEnum, DriverTypeEnum, DriverYesOrNoTypeEnum, Item, TestDriveTimeZoneEnum } from '../../utils/constants';
import { SheetManager } from 'react-native-actions-sheet';
import DatePickerField from '../../components/DatePickerField';
import { format } from 'date-fns';
import DatePicker from 'react-native-date-picker';
import { getDocumentTypeStr, getDriverStr, getDriverTypeStr, getTimeZoneStr, ISODateWithOutTimeZone, ISOToDate, isValidEmail } from '../../utils/utils';
import { useTestDrive } from '../../hooks/useTestDrive';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../utils/rootNavigation';
import { Screens } from '../../navigation/Screens';
import { TestDriveForm as TDForm } from '../../model/form/TestDriveForm';
import TimePickerComponent from '../../components/TimePicker';
import { DefaultRootState, useDispatch, useSelector } from 'react-redux';
import { cleanInfoCurrentGuest } from '../../store/action/guestAction';

type InputFormType = 'vehicle' | 'date' | 'selectedTime' | 'firstname' | 'lastname' | 'documentType' | 'documentNumber' | 'email' | 'drivingLicenseExpiration' | 'phoneArea' | 'phone' | 'contactPreference' | 'driverType' | 'driverBool' | 'vehicleInfo' | 'receiveInformation' | 'acceptConditions' /**| 'phoneValidation'*/;

const TestDriveForm = () => {
    const [formParam, setFormParam] = useState<TDForm>();
    const [isSubmited, setIsSubmited] = useState<boolean>(false);
    const [vehicleOfInterestId, setVehicleOfInterestId] = useState<number>();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [documentType, setDocumentType] = useState<DocumentTypeEnum | undefined>(DocumentTypeEnum.DNI);
    const [documentNumber, setDocumentNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [drivingLicenseExpiration, setDrivingLicenseExpiration] = useState<Date>();
    const [phoneArea, setPhoneArea] = useState<string>("0");
    const [phone, setPhone] = useState<string>();
    const [selectedTime, setSelectedTime] = useState<string | undefined>();
    const [driverType, setDriverType] = useState<DriverYesOrNoTypeEnum | undefined>(DriverYesOrNoTypeEnum.YES);
    const [driverBool, setDriverBool] = useState<DriverYesOrNoTypeEnum | undefined>(DriverYesOrNoTypeEnum.NO);
    const [vehicleInfo, setVehicleInfo] = useState<string>();
    const [companion1Firstname, setCompanion1Firstname] = useState<string>();
    const [companion1Lastname, setCompanion1Lastname] = useState<string>();
    const [companion1Age, setCompanion1Age] = useState<string>();
    const [companion2Fullname, setCompanion2Fullname] = useState<string>();
    const [companion2Age, setCompanion2Age] = useState<string>();
    const [companion3Fullname, setCompanion3Fullname] = useState<string>();
    const [companion3Age, setCompanion3Age] = useState<string>();
    const [receiveInformation, setReceiveInformation] = useState<boolean>(true);
    const [acceptConditions, setAcceptConditions] = useState<boolean>(false);
    const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
    const [isDatePickerOpened, setIsDatePickerOpened] = useState<boolean>(false);
    const [isDrivingLicenseExpPickerOpened, setIsDrivingLicenseExpPickerOpened] = useState<boolean>(false);
    const { isGettingOptions, options, showTerms, navigateToTestDriveSignature, openScanner } = useTestDrive();
    const route = useRoute<RouteProp<RootStackParams, Screens.TestDriveFormStack>>();
    const [isQR, setIsQR] = useState<boolean>(false);
    const dispatch = useDispatch();

    const guestCurrentUser = useSelector((st: DefaultRootState) => st.transient.currentGuest.guest);

    // useEffect(() => {
    //     if (isGettingOptions) {

    //     }
    // }, [isGettingOptions])
    useEffect(() => {
        setVehicleOfInterestId(-1)
    }, [])

    useEffect(() => {
        if (!driverBool || driverBool == DriverYesOrNoTypeEnum.NO) {
            setVehicleInfo('');
            setDrivingLicenseExpiration(undefined);
        }
        return () => { dispatch(cleanInfoCurrentGuest()) }
    }, [driverBool])

    useEffect(() => {
        if (guestCurrentUser) {
            if (formComplete()) {
                showAlertAndContinue('Advertencia', 'Se reemplazaran algunos campos del formulario. ¿Desea continuar?')
            } else {
                autocompleteFormQR();
            }
        }
    }, [guestCurrentUser])

    useEffect(() => {
        if (route?.params?.testDriveForm && !isGettingOptions) {
            const testDriveForm = JSON.parse(route.params.testDriveForm) as TDForm;
            setFormParam(testDriveForm);
            setIsSubmited(false);
            setVehicleOfInterestId(testDriveForm.vehicleOfInterestId);
            setDate(ISOToDate(testDriveForm.date as any));
            setSelectedTime(testDriveForm.selectedTime as any);
            setFirstname(testDriveForm.firstname ?? '');
            setLastname(testDriveForm.lastname ?? '');
            setDocumentType(testDriveForm.documentType);
            setDocumentNumber(testDriveForm.documentNumber ?? '');
            setEmail(testDriveForm.email ?? '');
            setDrivingLicenseExpiration(ISOToDate(testDriveForm.drivingLicenseExpiration as any))
            setPhoneArea(testDriveForm.phoneArea ?? '0');
            setPhone(testDriveForm.phone ?? '');
            //setContactPreference(testDriveForm.contactPreference ?? ContactPreferenceEnum.WHATSAPP);
            // setDriverType(testDriveForm.driverType);
            setDriverBool(testDriveForm.driverBool)
            setVehicleInfo(testDriveForm.vehicleInfo);
            setCompanion1Firstname(testDriveForm.companion1Firstname);
            setCompanion1Lastname(testDriveForm.companion1Lastname);
            setCompanion1Age(testDriveForm.companion1Age);
            setCompanion2Fullname(testDriveForm.companion2Fullname);
            setCompanion2Age(testDriveForm.companion2Age);
            setCompanion3Fullname(testDriveForm.companion3Fullname);
            setCompanion3Age(testDriveForm.companion3Age);
            setReceiveInformation(testDriveForm.receiveInformation == true);
            setAcceptConditions(testDriveForm.acceptConditions == true);
            setIsQR(testDriveForm.loadedByQR == true)
        }
    }, [route.params, isGettingOptions])

    const formComplete = (): boolean => {
        return !!firstname || !!lastname || !!documentNumber || !!email || !!vehicleInfo || !!date || !!selectedTime
    }

    const showAlertAndContinue = (title: string, message: string) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: "Cancelar",
                    onPress: () => { }
                },
                {
                    text: "Continuar",
                    onPress: () => { autocompleteFormQR() }
                }
            ]
        );
    }

    const autocompleteFormQR = () => {
        setFirstname(guestCurrentUser?.Firstname ?? '');
        setLastname(guestCurrentUser?.Lastname ?? '');
        setDocumentNumber(guestCurrentUser?.DocumentNumber ?? '');
        try {
            if (guestCurrentUser && guestCurrentUser.PreferenceDate && guestCurrentUser.PreferenceDate.trim() !== '') {
                setDate(ISODateWithOutTimeZone(guestCurrentUser?.PreferenceDate ?? ''));
            } else {
                throw new Error('Cadena vacía o indefinida');
            }
        } catch (error) {
            setDate(undefined);
        }
        setEmail(guestCurrentUser?.Email ?? '');
        for (let i = 0; i < options.vehicles.length; i++) {
            if (options.vehicles[i].name === guestCurrentUser?.PreferenceVehicle) {
                setVehicleOfInterestId(options.vehicles[i].id)
            }
        }
        setSelectedTime(guestCurrentUser?.PreferenceHour ?? '');
        setIsQR(true);
        setDriverBool(guestCurrentUser?.PreferenceVehicle ? DriverYesOrNoTypeEnum.YES : DriverYesOrNoTypeEnum.NO);
        setPhoneArea('0');
        setPhone(guestCurrentUser?.PhoneNumber ?? '');
    }

    const onPressContinue = () => {
        setIsSubmited(true);
        const isAnyError = hasErrors('vehicle', false) || hasErrors('date', false) || hasErrors('selectedTime', false) || hasErrors('firstname', false) || hasErrors('lastname', false) || hasErrors('documentType', false) || hasErrors('documentNumber', false) || hasErrors('email', false) || hasErrors('drivingLicenseExpiration', false) || hasErrors('phone', false) /*|| hasErrors('contactPreference', false) || hasErrors('phoneArea', false)*/ || hasErrors('driverType', false) || hasErrors('driverBool', false) || hasErrors('vehicleInfo', false);
        if (!isAnyError) {
            // if (hasErrors('phoneValidation', false))
            //     setSnackBarMessage("El código de area más el número de teléfono deben ser 10 dígitos.");
            // else 
            if (hasErrors('acceptConditions', false))
                setSnackBarMessage("Debe aceptar las condiciones de uso.");
            else {
                navigateToTestDriveSignature({
                    id: formParam?.id,
                    eventId: formParam?.eventId,
                    vehicleOfInterestId: vehicleOfInterestId,
                    vehicleName: options?.vehicles?.find(x => x.id == vehicleOfInterestId)?.name,
                    date,
                    selectedTime,
                    firstname,
                    lastname,
                    documentType,
                    documentNumber,
                    email,
                    drivingLicenseExpiration,
                    phoneArea,
                    phone,
                    //contactPreference,
                    // driverType,
                    driverBool,
                    vehicleInfo,
                    companion1Firstname,
                    companion1Lastname,
                    companion1Age,
                    companion2Fullname,
                    companion2Age,
                    companion3Fullname,
                    companion3Age,
                    receiveInformation,
                    acceptConditions,
                    resizedSignature: formParam?.resizedSignature,
                    createdOn: formParam?.createdOn,
                    modifiedOn: formParam?.modifiedOn,
                    isSynchronized: formParam?.isSynchronized,
                    syncDate: formParam?.syncDate,
                    signature: formParam?.signature,
                    loadedByQR: isQR
                })
            }
        }
    }

    const hasErrors = (type: InputFormType, checkSubmited: boolean = true) => {
        let isError = true;
        switch (type) {
            case 'vehicle':
                isError = !vehicleOfInterestId; break;
            case 'date':
                isError = !date; break;
            case 'selectedTime':
                isError = !selectedTime; break;
            case 'firstname':
                isError = !firstname; break;
            case 'lastname':
                isError = !lastname; break;
            case 'documentType':
                isError = !documentType; break;
            case 'documentNumber':
                isError = !documentNumber; break;
            case 'email':
                isError = !isValidEmail(email); break;
            // case 'phoneArea':
            //     isError = !phoneArea; break;
            case 'phone':
                isError = !phone; break;
            //case 'contactPreference':
            //    isError = !contactPreference; break;
            case 'driverType':
                isError = !driverType; break;
            case 'driverBool':
                isError = !driverBool; break;
            case 'drivingLicenseExpiration':
                isError = hasOwnVehicle() && !drivingLicenseExpiration;
                break;
            case 'vehicleInfo':
                isError = hasOwnVehicle() && !vehicleInfo;
                break;
            case 'acceptConditions':
                isError = !acceptConditions; break;
            // case 'phoneValidation': {
            //     const phoneAreaLength = phoneArea?.length ?? 0;
            //     const phoneLength = phone?.length ?? 0;
            //     isError = phoneAreaLength + phoneLength != 10;
            //     break;
            // }
        }
        return checkSubmited ? isSubmited && isError : isError;
    };

    const hasOwnVehicle = (): boolean => {
        return driverBool != undefined
            && (driverBool == DriverYesOrNoTypeEnum.YES);
    }

    const handleTimeSelection = (time: string) => {
        setSelectedTime(time);
    };

    return (
        <>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, marginRight: 8, alignItems: 'center', position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                    <ButtonRound iconName={'qr-code'} title={'Escaner QR'} onPress={openScanner} />
                </View>
                <ScrollView
                    contentContainerStyle={styles.container}
                >
                    {/* -------- */}
                    {/* Vehículo */}
                    {/* -------- */}
                    <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionTitle}>
                            Vehículo
                        </Text>
                        <Divider style={styles.sectionDivider} />
                    </View>
                    <View style={[styles.row]}>
                        <View style={[styles.selectWrapper]}>
                            <Text style={styles.selectTitle}>Vehículo</Text>
                            <Select
                                title={options.vehicles.find(x => x.id == vehicleOfInterestId)?.name}
                                placeholder='Seleccione vehículo...'
                                borderColor={hasErrors('vehicle') ? '#B5122F' : ''}
                                onPress={() => SheetManager.show(ActionSheetIdEnum.TEST_DRIVE_VEHICLE)}
                                onClearPress={() => setVehicleOfInterestId(undefined)}
                            />
                            <HelperText
                                style={styles.helperText}
                                type="error"
                                visible={hasErrors('vehicle')} >
                                El vehículo es requerido
                            </HelperText>
                        </View>
                    </View>

                    {/* ------------ */}
                    {/* Fecha y Hora */}
                    {/* ------------ */}
                    <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionTitle}>
                            Preferencias de fecha y hora
                        </Text>
                        <Divider style={styles.sectionDivider} />
                    </View>
                    <View style={[styles.row]}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <View style={[styles.pickerWrapper]}>
                                <Text style={styles.pickerTitle}>Día</Text>
                                <DatePickerField
                                    title={date ? format(date, "dd/MM/yy") : ''}
                                    placeholder='Ingrese día'
                                    borderColor={hasErrors('date') ? '#B5122F' : ''}
                                    onPress={() => setIsDatePickerOpened(true)}
                                    onClearPress={() => setDate(undefined)}
                                />
                                <HelperText
                                    style={styles.helperText}
                                    type="error"
                                    visible={hasErrors('date')} >
                                    Fecha es requerida
                                </HelperText>
                            </View>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <View style={styles.selectWrapper}>
                                <Text style={styles.selectTitle}>Franja horaria</Text>
                                <TimePickerComponent onTimeSelected={handleTimeSelection} valueText={selectedTime} />
                            </View>
                            <HelperText
                                style={styles.helperText}
                                type="error"
                                visible={hasErrors('selectedTime')} >
                                Franja horaria es requerida
                            </HelperText>
                        </View>
                    </View>

                    {/* ----------------------- */}
                    {/* Información de contacto */}
                    {/* ----------------------- */}
                    <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionTitle}>
                            Información de contacto
                        </Text>
                        <Divider style={styles.sectionDivider} />
                    </View>

                    {/* Nombre y Apellido */}
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={[styles.col, { marginRight: 12 }]}>
                            <TextInputLabeled
                                title='Nombre'
                                error={hasErrors('firstname')}
                                placeholder='Ingrese nombre'
                                value={firstname}
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

                    {/* Tipo y Número de Documento */}
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={[styles.selectWrapper, { marginRight: 12 }]}>
                            <Text style={styles.selectTitle}>Tipo de documento</Text>
                            <Select
                                title={getDocumentTypeStr(documentType)}
                                placeholder='Seleccione tipo de documento...'
                                borderColor={hasErrors('documentType') ? '#B5122F' : ''}
                                onPress={() => SheetManager.show(ActionSheetIdEnum.TEST_DRIVE_DOCUMENT_TYPE)}
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
                                keyboardType='numeric'
                                title='Nº documento'
                                error={hasErrors('documentNumber')}
                                placeholder='Ingrese nº documento'
                                value={documentNumber}
                                onChangeText={text => setDocumentNumber(text.replace(/[- #*+;,.<>=()\{\}\[\]\\\/]/gi, ''))}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('documentNumber')} >
                                Número de documento es requerido
                            </HelperText>
                        </View>
                    </View>

                    {/* Email */}
                    <View style={[styles.row, { alignItems: 'flex-start', marginBottom: 24 }]}>
                        <View style={[styles.col]}>
                            <TextInputLabeled
                                title='Email'
                                placeholder='Ingrese Email'
                                value={email}
                                keyboardType='email-address'
                                error={hasErrors('email')}
                                onChangeText={text => setEmail(text)}
                                conatinerStyle={[styles.col]}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('email')} >
                                Email es requerido
                            </HelperText>
                        </View>
                    </View>

                    {/* Teléfono */}
                    <View style={[styles.row, { alignItems: 'flex-start', marginBottom: 24 }]}>
                        <View style={{ display: 'none' }}>
                            <TextInputLabeled
                                title='Teléfono fijo o celular'
                                keyboardType='numeric'
                                // error={hasErrors('phoneValidation')}
                                placeholder='Código de area'
                                value={'0'}
                                onChangeText={text => setPhoneArea(text.replace(/[- #*+;,.<>=()\{\}\[\]\\\/]/gi, ''))}

                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('phoneArea')} >
                                Código de area es requerido
                            </HelperText>
                        </View>
                        <View style={[styles.col]}>
                            <TextInputLabeled
                                title='Nº de teléfono'
                                // titleStyle={{ fontSize: RFValue(10.5), fontFamily: Fonts.FordAntennaWGLMedium, opacity: 0 }}
                                keyboardType='numeric'
                                error={hasErrors('phone')}
                                placeholder='Nº de teléfono'
                                value={phone}
                                onChangeText={text => setPhone(text.replace(/[- #*+;,.<>=()\{\}\[\]\\\/]/gi, ''))}
                                conatinerStyle={[styles.col]}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('phone')} >
                                Número de teléfono es requerido
                            </HelperText>
                        </View>
                    </View>

                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={[styles.selectWrapper, { marginRight: 12 }]}>
                            <View style={styles.selectWrapper}>
                                <Text style={styles.selectTitle}>¿Sos conductor?</Text>
                                <Select
                                    title={getDriverStr(driverBool)}
                                    placeholder='¿Sos conductor?'
                                    borderColor={hasErrors('driverBool') ? '#B5122F' : ''}
                                    onPress={() => SheetManager.show(ActionSheetIdEnum.TEST_DRIVE_DRIVER)}
                                    onClearPress={() => setDriverBool(undefined)}
                                />
                            </View>
                            <HelperText
                                style={styles.helperText}
                                type="error"
                                visible={hasErrors('driverType')} >
                                Tipo de conductor es requerido
                            </HelperText>
                        </View>
                        <View style={[styles.selectWrapper, { marginLeft: 12 }]}>
                            <View style={[styles.pickerWrapper]}>
                                <Text style={styles.pickerTitle}>Expiración de registro</Text>
                                <DatePickerField
                                    title={drivingLicenseExpiration ? format(drivingLicenseExpiration, "dd/MM/yy") : ''}
                                    placeholder='Ingrese fecha'
                                    borderColor={hasErrors('drivingLicenseExpiration') ? '#B5122F' : undefined}
                                    onPress={() => setIsDrivingLicenseExpPickerOpened(true)}
                                    onClearPress={() => setDrivingLicenseExpiration(undefined)}
                                    disabled={(driverBool === DriverYesOrNoTypeEnum.NO) && !hasOwnVehicle()}
                                />
                                {
                                    hasErrors('drivingLicenseExpiration') &&
                                    <HelperText
                                        style={styles.helperText}
                                        type="error">
                                        Expiración de registro es requerida
                                    </HelperText>
                                }
                            </View>
                        </View>
                    </View>
                    {/* Marca y modelo */}
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={[styles.col, { marginRight: 12 }]}>
                            <TextInputLabeled
                                title='Mi vehículo'
                                error={hasErrors('vehicleInfo')}
                                placeholder='Ingrese Marca y modelo'
                                value={vehicleInfo}
                                onChangeText={text => setVehicleInfo(text)}
                                conatinerStyle={[styles.col]}
                                disabled={(driverBool === DriverYesOrNoTypeEnum.NO) && !hasOwnVehicle()}
                            />
                            <HelperText style={styles.helperText} type="error" visible={hasErrors('vehicleInfo')} >
                                Marca y modelo de vehículo es requerido
                            </HelperText>
                        </View>
                    </View>

                    {/* ------------ */}
                    {/* Acompañantes */}
                    {/* ------------ */}
                    <View style={styles.sectionWrapper}>
                        <Text style={styles.sectionTitle}>
                            Acompañantes
                        </Text>
                        <Divider style={styles.sectionDivider} />
                    </View>

                    {/* Acompañante 1 */}
                    <View style={[styles.row, { alignItems: 'flex-end' }]}>
                        <View style={[styles.col, { marginRight: 12 }]}>
                            <TextInputLabeled
                                title='Nombre acompañante 1'
                                placeholder='Ingrese nombre'
                                value={companion1Firstname}
                                onChangeText={text => setCompanion1Firstname(text)}
                            />
                            <HelperText style={styles.helperText} type="error" visible={false} >
                                Nombre es requerido
                            </HelperText>
                        </View>
                        <View style={[styles.col, { marginLeft: 12, marginRight: 12 }]}>
                            <TextInputLabeled
                                title='Apellido acompañante 1'
                                placeholder='Ingrese apellido'
                                value={companion1Lastname}
                                onChangeText={text => setCompanion1Lastname(text)}
                            />
                            <HelperText style={styles.helperText} type="error" visible={false} >
                                Apellido es requerido
                            </HelperText>
                        </View>
                        <View style={[styles.col, { marginLeft: 12 }]}>
                            <TextInputLabeled
                                title='Edad acompañante 1'
                                keyboardType='numeric'
                                placeholder='Ingrese edad'
                                value={companion1Age}
                                onChangeText={text => setCompanion1Age(text.replace(/[- #*+;,.<>=()\{\}\[\]\\\/]/gi, ''))}
                            />
                            <HelperText style={styles.helperText} type="error" visible={false} >
                                Edad es requerido
                            </HelperText>
                        </View>
                    </View>

                    {/* Acompañante 2 */}
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={[styles.col, { marginRight: 12 }]}>
                            <TextInputLabeled
                                title='Nombre acompañante 2'
                                placeholder='Ingrese nombre y apellido'
                                value={companion2Fullname}
                                onChangeText={text => setCompanion2Fullname(text)}
                            />
                            <HelperText style={styles.helperText} type="error" visible={false} >
                                Nombre es requerido
                            </HelperText>
                        </View>
                        <View style={[styles.col, { marginLeft: 12 }]}>
                            <TextInputLabeled
                                title='Edad acompañante 2'
                                keyboardType='numeric'
                                placeholder='Ingrese edad'
                                value={companion2Age}
                                onChangeText={text => setCompanion2Age(text.replace(/[- #*+;,.<>=()\{\}\[\]\\\/]/gi, ''))}
                            />
                            <HelperText style={styles.helperText} type="error" visible={false} >
                                Edad es requerido
                            </HelperText>
                        </View>
                    </View>

                    {/* Acompañante 3 */}
                    <View style={[styles.row, { alignItems: 'flex-start' }]}>
                        <View style={[styles.col, { marginRight: 12 }]}>
                            <TextInputLabeled
                                title='Nombre acompañante 3'
                                placeholder='Ingrese nombre y apellido'
                                value={companion3Fullname}
                                onChangeText={text => setCompanion3Fullname(text)}
                            />
                            <HelperText style={styles.helperText} type="error" visible={false} >
                                Nombre es requerido
                            </HelperText>
                        </View>
                        <View style={[styles.col, { marginLeft: 12 }]}>
                            <TextInputLabeled
                                title='Edad acompañante 3'
                                keyboardType='numeric'
                                placeholder='Ingrese edad'
                                value={companion3Age}
                                onChangeText={text => setCompanion3Age(text.replace(/[- #*+;,.<>=()\{\}\[\]\\\/]/gi, ''))}
                            />
                            <HelperText style={styles.helperText} type="error" visible={false} >
                                Edad es requerido
                            </HelperText>
                        </View>
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
                        title='Continuar'
                        contentStyle={{ width: '50%', alignSelf: 'center', marginBottom: 6, marginTop: 16 }}
                        onPress={onPressContinue}
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

            {/* Action Sheets */}
            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.TEST_DRIVE_VEHICLE}
                items={options.vehicles}
                title={'Seleccione un vehículo de interés'}
                emptyItemsText={'No hay vehículos para seleccionar'}
                onSelect={id => setVehicleOfInterestId(id)}
                height={300}
            />
            {/* <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.TEST_DRIVE_TIME_ZONE}
                items={options.timeZones.map(x => ({ id: x.id, name: getTimeZoneStr(x.name as TestDriveTimeZoneEnum) }))}
                title={'Seleccione una franja horaria'}
                emptyItemsText={''}
                onSelect={id => setTimeZone(options.timeZones.find(x => x.id == id)?.name as TestDriveTimeZoneEnum)}
                height={200}
            /> */}
            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.TEST_DRIVE_DOCUMENT_TYPE}
                items={options.documentTypes.map(x => ({ id: x.id, name: getDocumentTypeStr(x.name as DocumentTypeEnum) }))}
                title={'Seleccione un tipo de documento'}
                emptyItemsText={''}
                onSelect={id => setDocumentType(options.documentTypes.find(x => x.id == id)?.name as DocumentTypeEnum)}
                height={300}
            />

            <ActionSheetSelectItems
                sheetId={ActionSheetIdEnum.TEST_DRIVE_DRIVER}
                items={options.driverBool.map(x => ({ id: x.id, name: getDriverStr(x.name as DriverYesOrNoTypeEnum) }))}
                title={'Seleccione un tipo de documento'}
                emptyItemsText={''}
                onSelect={id => setDriverBool(options.driverBool.find(x => x.id == id)?.name as DriverYesOrNoTypeEnum)}
                height={300}
            />

            <DatePicker
                modal
                open={isDatePickerOpened}
                date={date ?? new Date()}
                mode='date'
                title='Día'
                cancelText={'Cancelar'}
                confirmText={'Aceptar'}
                locale='es-Ar'
                onConfirm={(date: Date) => {
                    setIsDatePickerOpened(false)
                    setDate(date);
                }}
                onCancel={() => {
                    setIsDatePickerOpened(false)
                }}
            />

            <DatePicker
                modal
                open={isDrivingLicenseExpPickerOpened}
                date={drivingLicenseExpiration ?? new Date()}
                mode='date'
                title='Fecha de expiración del registro'
                cancelText={'Cancelar'}
                confirmText={'Aceptar'}
                locale='es-Ar'
                onConfirm={(date: Date) => {
                    setIsDrivingLicenseExpPickerOpened(false)
                    setDrivingLicenseExpiration(date);
                }}
                onCancel={() => {
                    setIsDrivingLicenseExpPickerOpened(false)
                }}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        padding: 24,
        //backgroundColor: '#F6F6F6',
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
    pickerWrapper: {
        width: '100%',
        flex: 1,
        marginRight: 12
    },
    pickerTitle: {
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
    sectionWrapper: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 24
    },
    sectionTitle: {
        color: theme.colors.textDark,
        fontSize: RFValue(14),
        fontFamily: Fonts.FordAntennaWGLLight,
        marginBottom: 6,
        textAlign: 'center'
    },
    sectionDivider: {
        width: '100%',
        height: RFValue(1),
        backgroundColor: '#000'
    },
    RadioButtonWrapper: {
        marginBottom: 24,
    },
    RadioButtonTitle: {
        marginBottom: 6,
        fontSize: RFValue(13.5),
        fontFamily: Fonts.FordAntennaWGLMedium,
        color: theme.colors.darkGrey
    },
    RadioButtonText: {
        color: theme.colors.textDark,
        fontSize: RFValue(12),
        fontFamily: Fonts.FordAntennaWGLLight,
    }
});

export default TestDriveForm;
