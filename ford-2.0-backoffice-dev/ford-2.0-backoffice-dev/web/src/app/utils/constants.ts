export type Nullable<T> = T | undefined | null

export enum ScreenViewType {
    CREATE = "CREATE",
    EDIT = "EDIT",
    VIEW = "VIEW"
}

export enum UserProfileEnum {
    ADMIN = "ADMIN",
    READONLY = "READONLY"
}

export enum InputType {
    PASSWORD = "password",
    TEXT = "text"
}

export enum MessageType {
    SUCCESS = "success-message",
    ERROR = "error-message",
    WARNING = "warning-message"
}

export enum VehicleType {
    SUVS = "SUVs",
    PICK_UPS = "Camionetas",
    UTILITIES = "Utilidades",
    CARS = "Autos",
    FLEETS_AND_SPECIAL_SALES = "Flotas y ofertas especiales"
}

export enum GuestType {
    OWNER = 'OWNER',
    COMPANION = 'COMPANION'
}

export enum GuestStates {
    ASSISTED = 'ASSISTED',
    ABSENT = 'ABSENT',
    ABSENT_NOTICE = 'ABSENT_NOTICE'
}

export enum FormType {
    QUOTE = 'QUOTE',
    TEST_DRIVE = 'TEST_DRIVE',
    NEWSLETTER = 'NEWSLETTER'
}

export enum Currency {
    ARS = 'ARS',
    USD = 'USD',
}

export enum ExportObjectType {
    DEALERSHIP = 'DEALERSHIP',
    GUEST = 'GUEST',
    CAMPAIGN_SEARCH = 'CAMPAIGN_SEARCH'
}

export enum GeneralConfigurationsKeys {
    DEMARCATION_OWNER = 'test_drive_demarcation_owner_url',
    DEMARCATION_OWNER_IN_CARAVAN = 'test_drive_demarcation_owner_in_caravan_url',
    DEMARCATION_FORD = 'test_drive_demarcation_ford_url',
    TEST_DRIVE_TERMS_URL = 'test_drive_terms_url',
    NEWSLETTER_TERMS_URL = 'newsletter_terms_url',
    QUOTE_TERMS_URL = 'quote_terms_url',
    CONTACT_DATA = 'contact_data'
}

export const enum SyncActionTypeEnum {
    DOWNLOAD_EVENTS = "DOWNLOAD_EVENTS",
    DOWNLOAD_VEHICLES = "DOWNLOAD_VEHICLES",
    DOWNLOAD_DEALERSHIPS = "DOWNLOAD_DEALERSHIPS",
    DOWNLOAD_PROVINCES = "DOWNLOAD_PROVINCES",
    DOWNLOAD_CONFIGURATIONS = "DOWNLOAD_CONFIGURATIONS",
    DOWNLOAD_CAMPAIGNS = "DOWNLOAD_CAMPAIGNS",
    UPLOAD_GUESTS = "UPLOAD_GUESTS",
    UPLOAD_CAMPAIGN_SEARCHES = "UPLOAD_CAMPAIGN_SEARCHES",
    UPLOAD_FORMS = "UPLOAD_FORMS",
    UPLOAD_DEVICE_ERRORS = "UPLOAD_DEVICE_ERRORS",
    CONNECTION_TEST = "CONNECTION_TEST",
    GET_NOTIFICATIONS = "GET_NOTIFICATIONS"
}

export const enum ErrorSyncActionTypeEnum {
    BASE_SYNC = 'BASE_SYNC',
    CAMPAING_SYNC = 'CAMPAING_SYNC',
    FULL_SYNC = 'FULL_SYNC',
    CONEXION_TEST_ERROR = 'CONEXION_TEST_ERROR'
}

export enum ErrorDbType {
    BASE_SYNC = 'BASE_SYNC',
    CAMPAING_SYNC = 'CAMPAING_SYNC',
    FULL_SYNC = 'FULL_SYNC',
    UPLOAD_GUESTS_SYNC = 'UPLOAD_GUESTS_SYNC',
    UPLOAD_CAMPAIGNS_SYNC = 'UPLOAD_CAMPAIGNS_SYNC',
    GET_FORM_AUTH_TOKEN = 'GET_FORM_AUTH_TOKEN',
    UPLOAD_QUOTE_FORMS_SYNC = 'UPLOAD_QUOTE_FORMS_SYNC',
    GET_SALE_SALEFORCE_AUTH_TOKEN = 'GET_SALE_SALEFORCE_AUTH_TOKEN',
    UPLOAD_NEWSLETTER_FORMS_SALEFORCE_SYNC = 'UPLOAD_NEWSLETTER_FORMS_SALEFORCE_SYNC',
    UPLOAD_NEWSLETTER_FORMS_SYNC = 'UPLOAD_NEWSLETTER_FORMS_SYNC',
    UPLOAD_TEST_DRIVE_FORMS_SYNC = 'UPLOAD_TEST_DRIVE_FORMS_SYNC'
}