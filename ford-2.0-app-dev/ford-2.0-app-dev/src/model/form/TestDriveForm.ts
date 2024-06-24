import { number } from 'fp-ts';
import { ContactPreferenceEnum, DocumentTypeEnum, DriverTypeEnum, DriverYesOrNoTypeEnum, TestDriveTimeZoneEnum } from '../../utils/constants';

export interface TestDriveForm {
    id?: number;
    eventId?: number;
    eventName?: string;
    eventCode?: string;
    vehicleOfInterestId?: number;
    vehicleName?: string;
    date?: Date;
    selectedTime?: string;
    firstname?: string;
    lastname?: string;
    documentType?: DocumentTypeEnum;
    documentNumber?: string;
    email?: string;
    drivingLicenseExpiration?: Date;
    phoneArea?: string;
    phone?: string;
    contactPreference?: ContactPreferenceEnum;
    driverType?: DriverTypeEnum;
    driverBool?: DriverYesOrNoTypeEnum;
    vehicleInfo?: string;
    companion1Firstname?: string;
    companion1Lastname?: string;
    companion1Age?: string;
    companion2Fullname?: string;
    companion2Age?: string;
    companion3Fullname?: string;
    companion3Age?: string;
    receiveInformation?: boolean;
    acceptConditions?: boolean;
    signature?: string;
    resizedSignature?: string;
    createdOn?: Date;
    modifiedOn?: Date;
    isSynchronized?: boolean;
    isSynchronizedWithSaleforce?: boolean;
    syncDate?: Date;
    syncFailed?: boolean;
    loadedByQR?: boolean;

    // only for sync form, not persisted on DB
    userHash?: string;
}

export interface TestDriveFormToSync {
    origen: string | null;
    suborigen: string | null;
    campaing_id: string | null;
    nombre: string | null;
    primer_apellido: string | null;
    tipo_doc: string | null;
    nro_doc: string | null;
    email: string | null;
    cod_area_tel: string | null;
    nro_tel: string | null;
    evento_id: string | null;
    evento_desc: string | null;
    canal_contacto_pref: string | null;
    optin_recibe_info: string | null;
    optin_terminos: string | null;
    submission_Date: string | null;
    otro: string | null;
    nombre_acom: string | null;
    primer_apellido_acom: string | null;
    age: string | null;
    customerAnswer1: string | null;
    customerAnswer2: string | null;
    customerAnswer3: string | null;
    customerAnswer4: string | null;
    customerAnswer5: string | null;
    modelo_desc: string | null;
    turno_dia: string | null;
    turno_franja: string | null;
    auto_tenes: string | null;
    auto_modelo_desc: string | null;
}

export interface TestDriveSignatureToSync {
    fileid?: string;
    content?: string;
}

export interface TestDriveFormToSyncSaleForce {
    keys: { ID?: string },
    values: {
        Vehiculo?: string;
        Dia?: Date;
        Hora?: number;
        Nombre?: string;
        Apellido?: string;
        'Tipo de DNI'?: DocumentTypeEnum;
        'N de documento'?: number;
        Email?: string;
        'N telefono'?: number;
        'Sos conductor'?: DriverYesOrNoTypeEnum;
        'Expiración de registro'?: Date;
        'Mi vehiculo'?: string;
        'Nombre acompañante 1'?: string;
        'Apellido acompañante 1'?: string;
        'Edad acompañante 1'?: string;
        'Nombre acompañante 2'?: string;
        'Edad acompañante 2'?: string;
        'Nombre acompañante 3'?: string;
        'Edad acompañante 3'?: string;
        OptiIn?: boolean;
        AceptaCondiciones?: boolean;
        NombreEvento?: string;
        DeviceName?: string;
        FechaSincro: Date;
    }
}