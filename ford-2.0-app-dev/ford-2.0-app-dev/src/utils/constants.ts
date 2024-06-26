import * as t from "io-ts";

export const APP_ID = 'c644c4e1-ba11-4722-8a91-788971b2f74a';
export const TNullableString = t.union([t.null, t.undefined, t.string]);
export const TNullableBool = t.union([t.null, t.undefined, t.boolean]);
export const TNullableNumber = t.union([t.null, t.undefined, t.number]);
export const SECRET_ENCRIPTION = 'mZq4t7w!z$C&F)J@NcRfUjXn2r5u8x/A';
export const SECRET_QRCODE_GUEST_ENCRIPTION = 'hello';
export const QRCODE_GUEST_IV_ENCRIPTION = '12345678';
export const CUSTOM_SIGNATURE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCADIAZADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==';
export const FORM_ORIGIN = 'APP Eventos';
export const FORM_SUBORIGIN = 'Eventos';
export type Item = { id: number, name: string };
export type KeyValue = { [key: string]: string | number | boolean; }

export enum PlatformEnum {
    IOS = "ios",
    ANDROID = "android",
    Windows = "windows",
    MACOS = "macos",
    WEB = "web"
}

export enum PermissionStatusEnum {
    UNAVAILABLE = 'unavailable',
    BLOCKED = 'blocked',
    DENIED = 'denied',
    GRANTED = 'granted',
    LIMITED = 'limited'
}

export enum SyncStatusEnum {
    NONE,
    GETTING_EVENTS,
    GETTING_VEHICLES,
    DOWNLOADING_EVENTS_FILES,
    DOWNLOADING_VEHICLES_FILES,
    GETTING_PROVINCES_AND_LOCALITIES,
    GETTING_DEALERSHIPS,
    GETTING_CONFIGURATIONS,
    DOWNLOADING_CONFIGURATIONS_FILES,
    GETTING_CAMPAIGNS,
    WRITTING_IN_DATABASE,
    ERROR
}

export enum VehicleTypeEnum {
    SUVS = "SUVS",
    PICK_UPS = "PICK_UPS",
    UTILITIES = "UTILITIES",
    CARS = "CARS",
    FLEETS_AND_SPECIAL_SALES = "FLEETS_AND_SPECIAL_SALES"
}

export enum DataTypeEnum {
    STRING,
    INT,
    FLOAT,
    BOOLEAN,
    DATE,
    BLOB
}

export enum DocumentTypeEnum {
    CUIL = "CUIL",
    CUIT = "CUIT",
    LC = "LC",
    DNI = "DNI",
    LE = "LE"
}

export enum DriverTypeEnum {
    WITHOUT_OWN_VEHICLE = "WITHOUT_OWN_VEHICLE",
    WITH_OWN_VEHICLE = "WITH_OWN_VEHICLE",
    WITH_OWN_VEHICLE_IN_CARAVAN = "WITH_OWN_VEHICLE_IN_CARAVAN"
}

export enum DriverYesOrNoTypeEnum {
    YES = "SI",
    NO = "NO"
}

export enum ActionSheetIdEnum {
    VEHICLE_DETAIL_VERSIONS = 'VEHICLE_DETAIL_VERSIONS',
    VEHICLE_COMPARATOR_VERSIONS = 'VEHICLE_COMPARATOR_VERSIONS',
    DEALERSHIPS_VEHICLES = 'DEALERSHIPS_VEHICLES',
    DEALERSHIPS_VEHICLE_VERSIONS = 'DEALERSHIPS_VEHICLE_VERSIONS',
    DEALERSHIPS_PROVINCES = 'DEALERSHIPS_PROVINCES',
    DEALERSHIPS_LOCALITYS = 'DEALERSHIPS_LOCALITYS',
    QOUTE_FORM_DOCUMENT_TYPES = 'QOUTE_FORM_DOCUMENT_TYPES',
    NEWSLETTER_FORM_VEHICLES = 'NEWSLETTER_FORM_VEHICLES',
    NEWSLETTER_FORM_DOCUMENT_TYPES = 'NEWSLETTER_FORM_DOCUMENT_TYPES',
    GUEST_MODAL_TYPE = 'GUEST_MODAL_TYPE',
    GUEST_MODAL_STATUS = 'GUEST_MODAL_STATUS',
    TEST_DRIVE_VEHICLE = 'TEST_DRIVE_VEHICLE',
    TEST_DRIVE_TIME_ZONE = 'TEST_DRIVE_TIME_ZONE',
    TEST_DRIVE_DOCUMENT_TYPE = 'TEST_DRIVE_DOCUMENT_TYPE',
    TEST_DRIVE_DRIVER_TYPE = 'TEST_DRIVE_DRIVER_TYPE',
    TEST_DRIVE_DRIVER = 'TEST_DRIVE_DRIVER',
    SYNC_FORMS_TYPE = 'SYNC_FORMS_TYPE',
    SYNC_GUESTS_SUB_EVENT = 'SYNC_GUESTS_SUB_EVENT',
    GUEST_OBSERVATION = 'GUEST_OBSERVATION',
    GUEST_STATUS = 'GUEST_STATUS',
}

export enum GuestTypeEnum {
    OWNER = "OWNER",
    COMPANION = "COMPANION"
}

export enum GuestStatusEnum {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    ABSENT_WITH_NOTICE = "ABSENT_WITH_NOTICE"
}

export enum TestDriveTimeZoneEnum {
    MORNING = "MORNING",
    AFTERNOON = "AFTERNOON",
}

export enum ContactPreferenceEnum {
    PHONE_CALL = "PHONE_CALL",
    WHATSAPP = "WHATSAPP",
}

export enum FormTypeEnum {
    QUOTE = 1,
    NEWSLETTER = 2,
    TESTDRIVE = 3,
}

export enum SyncFormStatus {
    CONNECTING,
    SYNCING_QUOTE,
    SYNCING_NEWSLETTER,
    SYNCING_TESTDRIVE,
    DELETING_FILES,
    NONE
}

export interface PieChartGuestValues {
    presentCount: number;
    absentCount: number;
    absentWithNoticeCount: number;
}

export const MAX_FORM_SYNC_COUNT: number = 100;

export const SIGNATURE_OPTIONS = {
    width: 400,
    height: 200,
    resizedWidth: 400,
    resizedHeight: 200,
    resizedQuality: 75
}

export enum SortType {
    ASC,
    DESC,
    NONE
}

export enum ErrorDbType {
    BASE_SYNC = 'BASE_SYNC',
    CAMPAING_SYNC = 'CAMPAING_SYNC',
    EVENT_SYNC = 'EVENT_SYNC',
    FULL_SYNC = 'FULL_SYNC',
    UPLOAD_GUESTS_SYNC = 'UPLOAD_GUESTS_SYNC',
    UPLOAD_CAMPAIGNS_SYNC = 'UPLOAD_CAMPAIGNS_SYNC',
    GET_FORM_AUTH_TOKEN = 'GET_FORM_AUTH_TOKEN',
    UPLOAD_QUOTE_FORMS_SYNC = 'UPLOAD_QUOTE_FORMS_SYNC',
    GET_SALE_SALEFORCE_AUTH_TOKEN = 'GET_SALE_SALEFORCE_AUTH_TOKEN',
    UPLOAD_NEWSLETTER_FORMS_SALEFORCE_SYNC = 'UPLOAD_NEWSLETTER_FORMS_SALEFORCE_SYNC',
    UPLOAD_TEST_DRIVE_FORMS_SALEFORCE_SYNC = 'UPLOAD_TEST_DRIVE_FORMS_SALEFORCE_SYNC',
    UPLOAD_NEWSLETTER_FORMS_SYNC = 'UPLOAD_NEWSLETTER_FORMS_SYNC',
    UPLOAD_TEST_DRIVE_FORMS_SYNC = 'UPLOAD_TEST_DRIVE_FORMS_SYNC',
    CONEXION_TEST_ERROR = 'CONEXION_TEST_ERROR'
}