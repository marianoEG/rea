import { NewsletterForm, NewsletterFormToSync, NewsletterFormToSyncSaleForce } from "../model/form/NewsletterForm";
import { QuoteForm, QuoteFormToSync } from "../model/form/QuoteForm";
import { TestDriveForm, TestDriveFormToSync, TestDriveFormToSyncSaleForce } from "../model/form/TestDriveForm";
import { SECRET_ENCRIPTION, DocumentTypeEnum, GuestStatusEnum, GuestTypeEnum, TestDriveTimeZoneEnum, VehicleTypeEnum, ContactPreferenceEnum, SECRET_QRCODE_GUEST_ENCRIPTION, QRCODE_GUEST_IV_ENCRIPTION, DriverTypeEnum, FORM_ORIGIN, FORM_SUBORIGIN, DriverYesOrNoTypeEnum } from "./constants";
import { sha256 } from 'react-native-sha256';
import CryptoJS, { AES } from "crypto-js";
import { getDeviceName, getVersion, getUniqueId, getBrand, getModel, getSystemName, getSystemVersion, getIpAddress, getFreeDiskStorage } from 'react-native-device-info';
import { getConnectionType } from "./network";
import { DeviceInfo } from "../model/DeviceInfo";

export const newGUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const groupBy = (array: any[], key: string) => {
    return array.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

export const capitalize = (text: string | undefined | null): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const getVehicleTypeStr = (vehicleType?: VehicleTypeEnum) => {
    switch (vehicleType) {
        case VehicleTypeEnum.SUVS:
            return 'SUVs';
        case VehicleTypeEnum.PICK_UPS:
            return 'Pick-ups';
        case VehicleTypeEnum.UTILITIES:
            return 'Utilitarios';
        case VehicleTypeEnum.CARS:
            return 'Autos';
        case VehicleTypeEnum.FLEETS_AND_SPECIAL_SALES:
            return 'Flotas y Ventas Especiales';
        default:
            return '';
    }
}

export const getDocumentTypeStr = (documentType?: DocumentTypeEnum) => {
    switch (documentType) {
        case DocumentTypeEnum.CUIL:
            return 'CUIL';
        case DocumentTypeEnum.CUIT:
            return 'CUIT';
        case DocumentTypeEnum.LC:
            return 'LC';
        case DocumentTypeEnum.DNI:
            return 'DNI';
        case DocumentTypeEnum.LE:
            return 'LE';
        default:
            return '';
    }
}

export const getGuestTypeStr = (guestType?: GuestTypeEnum) => {
    switch (guestType) {
        case GuestTypeEnum.OWNER:
            return 'Propietario';
        case GuestTypeEnum.COMPANION:
            return 'Acompañante';
        default:
            return '';
    }
}

export const getGuestStatusStr = (guestStatus?: GuestStatusEnum, useDefaultIfNotExists: boolean = true) => {
    switch (guestStatus) {
        case GuestStatusEnum.PRESENT:
            return 'Presente';
        case GuestStatusEnum.ABSENT_WITH_NOTICE:
            return 'Ausente con aviso';
        case GuestStatusEnum.ABSENT:
            return 'Ausente';
        default: {
            return useDefaultIfNotExists ? 'Ausente' : ''
        }
    }
}

export const getNextGuestStatus = (guestStatus?: GuestStatusEnum): GuestStatusEnum => {
    switch (guestStatus) {
        case GuestStatusEnum.PRESENT:
            return GuestStatusEnum.ABSENT_WITH_NOTICE;
        case GuestStatusEnum.ABSENT_WITH_NOTICE:
            return GuestStatusEnum.ABSENT;
        case GuestStatusEnum.ABSENT:
        default:
            return GuestStatusEnum.PRESENT;
    }
}

export const getTimeZoneStr = (timeZone?: TestDriveTimeZoneEnum) => {
    switch (timeZone) {
        case TestDriveTimeZoneEnum.MORNING:
            return 'Mañana';
        case TestDriveTimeZoneEnum.AFTERNOON:
            return 'Tarde';
        default:
            return '';
    }
}

export const getDriverTypeStr = (driverType?: DriverTypeEnum) => {
    switch (driverType) {
        case DriverTypeEnum.WITHOUT_OWN_VEHICLE:
            return 'Sin vehículo propio';
        case DriverTypeEnum.WITH_OWN_VEHICLE:
            return 'Vehículo propio';
        case DriverTypeEnum.WITH_OWN_VEHICLE_IN_CARAVAN:
            return 'Vehículo propio (caravana)';
        default:
            return '';
    }
}

export const getDriverStr = (driver?: DriverYesOrNoTypeEnum) => {
    switch (driver) {
        case DriverYesOrNoTypeEnum.YES:
            return 'Si';
        case DriverYesOrNoTypeEnum.NO:
            return 'No';
        default:
            return '';
    }
}

export const getDriverTypeAsNumber = (driverType?: DriverTypeEnum): number => {
    switch (driverType) {
        case DriverTypeEnum.WITHOUT_OWN_VEHICLE:
            return 0;
        case DriverTypeEnum.WITH_OWN_VEHICLE:
            return 1;
        case DriverTypeEnum.WITH_OWN_VEHICLE_IN_CARAVAN:
            return 2;
        default:
            return 0;
    }
}

export const getDriverAsNumber = (driver?: DriverYesOrNoTypeEnum): number => {
    switch (driver) {
        case DriverYesOrNoTypeEnum.YES:
            return 0;
        case DriverYesOrNoTypeEnum.NO:
            return 1;
        default:
            return 0;
    }
}

export const getDriverTypeFromNumber = (value?: number): DriverTypeEnum | undefined => {
    switch (value) {
        case 0:
            return DriverTypeEnum.WITHOUT_OWN_VEHICLE;
        case 1:
            return DriverTypeEnum.WITH_OWN_VEHICLE;
        case 2:
            return DriverTypeEnum.WITH_OWN_VEHICLE_IN_CARAVAN;
        default:
            return DriverTypeEnum.WITHOUT_OWN_VEHICLE;
    }
}

export const getDriverFromNumber = (value?: number): DriverYesOrNoTypeEnum | undefined => {
    switch (value) {
        case 0:
            return DriverYesOrNoTypeEnum.YES;
        case 1:
            return DriverYesOrNoTypeEnum.NO;
        default:
            return DriverYesOrNoTypeEnum.YES;
    }
}


export const ISOToDate = (isoDate?: string | null): Date | undefined => {
    if (!isoDate) return undefined;
    try {
        if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(isoDate)) // '2011-10-05T14:48:00.000Z'
            return new Date(isoDate);
        else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}/.test(isoDate)) // '2011-10-05T14:48:00.000'
            return new Date(isoDate + 'Z');
        else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{1}/.test(isoDate)) // '2011-10-05T14:48:00.1'
            return new Date(isoDate + '00Z');
        else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(isoDate)) // '2011-10-05T14:48:00'
            return new Date(isoDate + '.000Z');

        else return new Date(isoDate);
    } catch (error) {
        console.log("error to parse Date: ", isoDate);
        return undefined;
    }
}

export const ISODateWithOutTimeZone = (isoDate?: string | null): Date | undefined => {
    if (!isoDate) return undefined;
    let dateWithOutTimeZone: Date | undefined = undefined
    try {
        if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(isoDate)) // '2011-10-05T14:48:00.000Z'
            dateWithOutTimeZone = new Date(isoDate);
        else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}/.test(isoDate)) // '2011-10-05T14:48:00.000'
            dateWithOutTimeZone = new Date(isoDate + 'Z');
        else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(isoDate)) // '2011-10-05T14:48:00'
            dateWithOutTimeZone = new Date(isoDate + '.000Z');
        else dateWithOutTimeZone = new Date(isoDate);
    } catch (error) {
        console.log("error to parse Date: ", isoDate);
        return undefined;
    }
    dateWithOutTimeZone.setMinutes(dateWithOutTimeZone.getMinutes() + dateWithOutTimeZone.getTimezoneOffset());
    return dateWithOutTimeZone;
}

/**
 * replace(/\'/g, "''") is for save data into Local DB
 * @param value to get Safe
 * @returns a safe Value
 */
export const getSafeOrUndefined = <T>(value: null | undefined | T): T | undefined => {
    if (value == null || value == undefined) return undefined;
    return value;
}

export const getSafeOrUndefinedArray = (value: null | undefined | any[]): any[] | undefined => {
    if (value == null || value == undefined) return undefined;
    return value.map((v: any) => {
        return Object.keys(v).forEach(key => {
            v[key] = v[key] != null ? v[key] : undefined;
        });
    })
}

export const isNumeric = (value?: string): boolean => {
    if (!value) return false;

    return /^\d+$/.test(value);
}

export const isValidPatent = (value?: string): boolean => {
    if (!value) return false;

    const oldPatent = /^[a-z]{3}[\d]{3}$/.test(value.toLowerCase());
    const newPatent = /^[a-z]{2}[\d]{3}[a-z]{2}$/.test(value.toLowerCase());
    return oldPatent || newPatent;
}

export const isValidEmail = (text?: string): boolean => {
    if (!text) return false;
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(text);
}

export const isNullOrUndefined = <T>(value: T): boolean => {
    return value == null || value == undefined;
}

export const isNotNullOrUndefined = <T>(value: T): boolean => {
    return !isNullOrUndefined(value);
}

export const isNullOrEmpty = (value: string | null | undefined): boolean => {
    return isNullOrUndefined(value) || value == '';
}

export const isNotNullOrEmpty = (value: string | null | undefined): boolean => {
    return !isNullOrEmpty(value);
}

export const isNullOrWhiteSpace = (value: string | null | undefined): boolean => {
    return isNullOrEmpty(value) || value == ' ';
}

export const isNotNullOrWhiteSpace = (value: string | null | undefined): boolean => {
    return !isNullOrWhiteSpace(value);
}

export const addHoursToDate = (date: Date, hours: number, min?: number, sec?: number, ms?: number): Date => {
    date.setHours(hours, min, sec, ms);
    return date;
}

export const isString = (value: any): boolean => {
    return (typeof value === 'string' || value instanceof String)
}

export const getGuestStatusFromServer = (state?: string): GuestStatusEnum => {
    switch (state) {
        case 'ASSISTED':
            return GuestStatusEnum.PRESENT;
        case 'ABSENT_NOTICE':
            return GuestStatusEnum.ABSENT_WITH_NOTICE;
        case 'ABSENT':
        default:
            return GuestStatusEnum.ABSENT;
    }
}

//#region Form Sync Mapper

//#region Quote Form

export const getQuoteFormBodyToSync = (form: QuoteForm): QuoteFormToSync => {
    return {
        origen: FORM_ORIGIN,
        suborigen: FORM_SUBORIGIN,
        campaing_id: form.eventCode ? form.eventCode : getFirstLetters(form.eventName, 3),
        modelo_desc: form.vehicleName ?? null,
        version_id: (form.vehicleTMA ?? '') + (form.vehicleSEQ ?? ''),
        version_desc: form.vehicleVersionName ?? null,
        version_my: form.vehicleModelYear ?? null,
        provincia_desc: form.provinceName ?? null,
        localidad_desc: form.localityName ?? null,
        concesionario_id: form.dealershipCode ?? null,
        concesionario_desc: form.dealershipName ?? null,
        nombre: form.firstname ?? null,
        primer_apellido: form.lastname ?? null,
        tipo_doc: form.documentType ?? null,
        nro_doc: form.documentNumber ?? null,
        email: form.email ?? null,
        cod_area_tel: form.phoneArea ?? null,
        nro_tel: form.phone ?? null,
        evento_id: form.eventId?.toString() ?? null,
        evento_desc: form.eventName ?? null,
        canal_contacto_pref: form.contactPreference ?? null,
        optin_recibe_info: form.receiveInformation ? 'true' : 'false',
        optin_terminos: form.acceptConditions ? 'true' : 'false',
        submission_Date: getDateStrForFormSync(new Date())
    }
}

export const getQuoteFormBodyToSyncArray = (form: QuoteForm[]): QuoteFormToSync[] => {
    return form?.map<QuoteFormToSync>(x => getQuoteFormBodyToSync(x));
}

//#endregion

//#region Newsletter Form

export const getNewsletterFormBodyToSync = (form: NewsletterForm): NewsletterFormToSync => {
    return {
        origen: FORM_ORIGIN,
        suborigen: FORM_SUBORIGIN,
        campaing_id: form.eventCode ? form.eventCode : getFirstLetters(form.eventName, 3),
        modelo_desc: form.vehicleName ?? null,
        nombre: form.firstname ?? null,
        primer_apellido: form.lastname ?? null,
        tipo_doc: form.documentType ?? null,
        nro_doc: form.documentNumber ?? null,
        email: form.email ?? null,
        cod_area_tel: form.phoneArea ?? null,
        nro_tel: form.phone ?? null,
        evento_id: form.eventId?.toString() ?? null,
        evento_desc: form.eventName ?? null,
        canal_contacto_pref: form.contactPreference ?? null,
        optin_recibe_info: form.receiveInformation ? 'true' : 'false',
        optin_terminos: form.acceptConditions ? 'true' : 'false',
        submission_Date: getDateStrForFormSync(new Date())
    }
}

export const getNewsletterFormBodyToSyncArray = (form: NewsletterForm[]): NewsletterFormToSync[] => {
    return form?.map<NewsletterFormToSync>(x => getNewsletterFormBodyToSync(x));
}

export const getNewsletterFormBodyToSyncSaleForce = (form: NewsletterForm): NewsletterFormToSyncSaleForce => {
    return {
        keys: { ID: new Date().getTime() + '-masinfo' },
        values: {
            EventID: form.eventId?.toString(),
            EventName: form.eventName,
            Firstname: form.firstname,
            Lastname: form.lastname,
            Email: form.email,
            PhoneNumber: form.phoneArea + '' + form.phone,
            VehicleOfInterest: form.vehicleName,
            RecieveInformation: form.receiveInformation?.toString(),
            AcceptConditions: form.acceptConditions?.toString(),
            FechaSincro: getDateStrForFormSync(new Date()) ?? ""
        }
    }
}

export const getNewsletterFormBodyToSyncSaleForceArray = (form: NewsletterForm[]): NewsletterFormToSyncSaleForce[] => {
    return form?.map<NewsletterFormToSyncSaleForce>(x => getNewsletterFormBodyToSyncSaleForce(x));
}

//#endregion

//#region TestDrive Form

export const getTestDriveFormBodyToSync = (form: TestDriveForm): TestDriveFormToSync => {
    return {
        origen: FORM_ORIGIN,
        suborigen: FORM_SUBORIGIN,
        campaing_id: form.eventCode ? form.eventCode : getFirstLetters(form.eventName, 3),
        nombre: form.firstname ?? null,
        primer_apellido: form.lastname ?? null,
        tipo_doc: form.documentType ?? null,
        nro_doc: form.documentNumber ?? null,
        email: form.email ?? null,
        cod_area_tel: form.phoneArea ?? null,
        nro_tel: form.phone ?? null,
        evento_id: form.eventId?.toString() ?? null,
        evento_desc: form.eventName ?? null,
        canal_contacto_pref: ContactPreferenceEnum.WHATSAPP,//form.contactPreference ?? null,
        optin_recibe_info: form.receiveInformation ? 'true' : 'false',
        optin_terminos: form.acceptConditions ? 'true' : 'false',
        submission_Date: getDateStrForFormSync(new Date()),
        otro: form.userHash ?? null,
        nombre_acom: form.companion1Firstname ?? null,
        primer_apellido_acom: form.companion1Lastname ?? null,
        age: form.companion1Age ?? null,
        customerAnswer1: form.companion2Fullname?.trim()?.replace(/ /g, ';') ?? null,
        customerAnswer2: form.companion2Age ?? null,
        customerAnswer3: form.companion3Fullname?.trim()?.replace(/ /g, ';') ?? null,
        customerAnswer4: form.companion3Age ?? null,
        customerAnswer5: form.drivingLicenseExpiration ? getDrivingLicenseExpirationStr(form.drivingLicenseExpiration) : null,
        modelo_desc: form.vehicleName ?? null,
        turno_dia: getDateStrForFormSync(form.date),
        turno_franja: form.selectedTime ?? null,
        auto_tenes: form.driverType == (DriverTypeEnum.WITH_OWN_VEHICLE || form.driverType == DriverTypeEnum.WITH_OWN_VEHICLE_IN_CARAVAN)
            ? 'true'
            : 'false',
        auto_modelo_desc: form.vehicleInfo ?? null
    }
}

export const getTestDriveFormBodyToSyncArray = (form: TestDriveForm[]): TestDriveFormToSync[] => {
    return form?.map<TestDriveFormToSync>(x => getTestDriveFormBodyToSync(x));
}

export const getTestDriveFormBodyToSyncSaleForce = (form: TestDriveForm, deviceName: string): TestDriveFormToSyncSaleForce => {
    return {
        keys: { ID: new Date().getTime() + '-masinfo' },
        values: {
            Vehiculo: form.vehicleName,
            Dia: getDateForFormSync(form.date),
            Hora: getDateToHours(form.date),
            Nombre: form.firstname,
            Apellido: form.lastname,
            'Tipo de DNI': form.documentType,
            'N de documento': form.documentNumber ? getStringToNumber(form.documentNumber) : 0,
            Email: form.email,
            'N telefono': form.phone ? getStringToNumber(form.phone) : 0,
            'Sos conductor': form.driverBool,
            'Expiración de registro': form.drivingLicenseExpiration,
            'Mi vehiculo': form.vehicleInfo,
            'Nombre acompañante 1': form.companion1Firstname,
            'Apellido acompañante 1': form.companion1Lastname,
            'Edad acompañante 1': form.companion1Age,
            'Nombre acompañante 2': form.companion2Fullname,
            'Edad acompañante 2': form.companion2Age,
            'Nombre acompañante 3': form.companion3Fullname,
            'Edad acompañante 3': form.companion3Age,
            OptiIn: form.receiveInformation ? true : false,
            AceptaCondiciones: form.acceptConditions,
            NombreEvento: form.eventName,
            DeviceName: deviceName,
            FechaSincro: new Date() ?? ""
        }
    }
}

export const getTestDriveFormBodyToSyncSaleForceArray = (form: TestDriveForm[], deviceName: string): TestDriveFormToSyncSaleForce[] => {
    return form?.map<TestDriveFormToSyncSaleForce>(x => getTestDriveFormBodyToSyncSaleForce(x, deviceName));
}

//#endregion

export const getFirstLetters = (text: string | null | undefined, letterCount: number = 1): string => {
    if (!text) return '';

    const words = text.split(' ');
    let result: string = '';
    for (let word of words) {
        result += word.slice(0, letterCount);
    }

    return result;
}

const getStringToNumber = (value: string): number | undefined => {
    const valueClean = value.replace(/[^\d.-]/g, '');
    const number = parseFloat(valueClean);
    if (isNaN(number)) {
        return undefined;
    }
    return number;
}


/**
 * Returns a Date Object in format YYYY-MM-DD hh:mm:ss
 * @param date the date to transform
 */
const getDateStrForFormSync = (date: Date | undefined | null): string | null => {
    if (!date) return null;
    return date
        ?.toISOString()
        ?.replace('T', ' ')
        ?.replace('Z', '')
        ?.split('.')[0]
}

/**
 * Returns a Date Object in format YYYY-MM-DD
 * @param date the date to transform
 */
const getDateForFormSync = (date: Date | undefined): Date | undefined => {
    if (!date) return undefined;
    if (date instanceof Date) {
        return new Date(date.toISOString().split('T')[0]);
    }
    if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
            return new Date(parsedDate.toISOString().split('T')[0]);
        }
    }

    return undefined;
};

function getDateToHours(date: Date | undefined): number | undefined {
    if (!(date instanceof Date)) {
        throw new Error("Se espera un objeto Date");
    }
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    const unifiedTime: number = Number(`${padLeft(hours)}${padLeft(minutes)}`);

    return unifiedTime;
}

// asegurar que los valores tengan al menos dos dígitos
function padLeft(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
}

/**
 * Returns a Date Object in format YYYYMMDD
 * @param date the date to transform
 */
const getDrivingLicenseExpirationStr = (date: Date | undefined | null): string | null => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}${month < 10 ? '0' + month : month}${day < 10 ? '0' + day : day}`;
}

//#endregion

/**
 * Returns a string that represents the x-www-form-urlencoded body
 * @param json json of type { key1: value1, key2: value2 }
 */
export const getBodyEncoded = (json: any): string => {
    let formBody: string[] = [];
    for (var property in json) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(json[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}

//#region Encryption/Decryption

export const getSHA256 = async (value: string): Promise<string> => {
    return sha256(value);
}

export const encrypt = (value?: string): string | undefined => {
    if (isNullOrUndefined(value)) return undefined;

    try {
        return AES.encrypt(JSON.stringify({ value }), SECRET_ENCRIPTION)?.toString();
    } catch (error) {
        console.log(`encrypt - error to encrypt ${value}:`, error);
        return undefined;
    }
}

export const decrypt = (value?: string): string | undefined => {
    if (isNullOrUndefined(value)) return undefined;

    try {
        const bytes = AES.decrypt(value!, SECRET_ENCRIPTION);
        const result = bytes?.toString(CryptoJS.enc.Utf8);
        return JSON.parse(result)?.value;
    } catch (error) {
        console.log(`decrypt - error to decrypt ${value}:`, error);
        return undefined;
    }
}

export const decrypQRCodeGuest = (value?: string): string | undefined => {
    if (isNullOrUndefined(value)) return undefined;

    try {
        let key: any = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(SECRET_QRCODE_GUEST_ENCRIPTION))
        key.words.push(key.words[0], key.words[1]);

        var decrypted = CryptoJS.TripleDES.decrypt(
            {
                ciphertext: CryptoJS.enc.Base64.parse(value!),
                iv: CryptoJS.enc.Utf8.parse(QRCODE_GUEST_IV_ENCRIPTION)
            } as any,
            key,
            {
                mode: CryptoJS.mode.ECB,
                iv: CryptoJS.enc.Utf8.parse(QRCODE_GUEST_IV_ENCRIPTION)
            }
        );
        return decrypted.toString(CryptoJS.enc.Utf8)
    }
    catch (error) {
        console.log(`decrypt - error to decrypt ${value}:`, error);
        return undefined;
    }
}

//#endregion

//#region DeviceInfo

export const getDeviceInfoForRequests = async (): Promise<DeviceInfo | undefined> => {
    try {
        return {
            uniqueId: await getUniqueId(),
            name: await getDeviceName(),
            operativeSystem: await getSystemName(),
            operativeSystemVersion: await getSystemVersion(),
            brand: await getBrand(),
            model: await getModel(),
            appVersion: await getVersion(),
            ip: await getIpAddress(),
            freeSpace: ((await getFreeDiskStorage() ?? 0) / 1024 / 1024 / 1024), // gigas
            connectionType: await getConnectionType()
        }
    } catch (error) {
        console.error('device info error:', JSON.stringify(error));
        return undefined;
    }
}

//#endregion