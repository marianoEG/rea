import { ContactPreferenceEnum, DocumentTypeEnum } from "../../utils/constants";

export interface NewsletterForm {
    id?: number;
    eventId?: number;
    eventName?: string;
    eventCode?: string;
    vehicleId?: number;
    vehicleName?: string;
    firstname?: string;
    lastname?: string;
    documentType?: DocumentTypeEnum;
    documentNumber?: string;
    email?: string;
    phoneArea?: string;
    phone?: string;
    contactPreference?: ContactPreferenceEnum;
    receiveInformation?: boolean;
    acceptConditions?: boolean;
    createdOn?: Date;
    modifiedOn?: Date;
    isSynchronized?: boolean;
    isSynchronizedWithSaleforce?: boolean;
    syncDate?: Date;
    syncFailed?: boolean;
}

export interface NewsletterFormToSync {
    origen: string | null;
    suborigen: string | null;
    campaing_id: string | null;
    modelo_desc: string | null;
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
}

export interface NewsletterFormToSyncSaleForce {
    keys: { ID?: string },
    values: {
        EventID?: string;
        EventName?: string;
        Firstname?: string;
        Lastname?: string;
        Email?: string;
        PhoneNumber?: string;
        VehicleOfInterest?: string;
        RecieveInformation?: string;
        AcceptConditions?: string;
        FechaSincro?: string;
    }
}