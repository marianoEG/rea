import { enablePromise, openDatabase, SQLiteDatabase, Transaction } from "react-native-sqlite-storage";
import { Event } from "../model/Event";
import { DataTypeEnum, FormTypeEnum, GuestStatusEnum, GuestTypeEnum, DocumentTypeEnum, ContactPreferenceEnum, PlatformEnum } from './constants';
import { Vehicle, ExtendedVehicle } from '../model/Vehicle';
import { VehicleVersion } from "../model/VehicleVersion";
import { VehicleColor } from "../model/VehicleColor";
import { VehicleImage } from "../model/VehicleImage";
import { VehicleFeatureGroup } from "../model/VehicleFeatureGroup";
import { VehicleFeature } from "../model/VehicleFeature";
import { VehicleFeatureVersion } from "../model/VehicleFeatureVersion";
import { SubEvent } from "../model/SubEvent";
import { decrypt, encrypt, getDriverAsNumber, getDriverFromNumber, isNotNullOrUndefined, isNotNullOrWhiteSpace, isNullOrUndefined, isNullOrWhiteSpace, ISOToDate, isString } from "./utils";
import { Province } from "../model/Province";
import { Locality } from "../model/Locality";
import { Dealership } from "../model/Dealership";
import { QuoteForm } from "../model/form/QuoteForm";
import { VehicleAccessory } from "../model/VehicleAccessory";
import { NewsletterForm } from "../model/form/NewsletterForm";
import { Campaign } from '../model/Campaign';
import { CampaignSearch } from "../model/CampaignSearch";
import { Guest, ExtendedGuest } from '../model/Guest';
import { TestDriveForm } from "../model/form/TestDriveForm";
import { ConfigurationDB } from "../model/Configuration";
import { ErrorDB } from "../model/Error";

enablePromise(true);

const DATABASE_NAME = "FordEvents.db";
const DB_PASS = 'Zq3t6w9z$C&F)J@NcRfUjXn2r5u7x!A%D*G-KaPdSgVkYp3s6v9y/B?E(H+MbQeT';

// Provinces And Localities
const TABLE_PROVINCES = "Provinces";
const TABLE_LOCALITIES = "Localities";
// Events
const TABLE_EVENTS = "Events";
const TABLE_SUB_EVENTS = "SubEvents";
const TABLE_GUESTS = "Guests";
// Vehicles
const TABLE_VEHICLES = "Vehicles";
const TABLE_VEHICLE_VERSIONS = "VehiclesVersions";
const TABLE_VEHICLE_COLORS = "VehiclesColors";
const TABLE_VEHICLE_IMAGES = "VehiclesImages";
const TABLE_VEHICLE_FEATURES_GROUPS = "VehiclesFeaturesGroups";
const TABLE_VEHICLE_FEATURES = "VehiclesFeatures";
const TABLE_VEHICLE_FEATURES_VERSIONS = "VehiclesFeaturesVersions";
const TABLE_VEHICLE_ACCESSORIES = "VehiclesAccessories";
// Dealerships
const TABLE_DEALERSHIPS = "Dealerships";
// Campaigns
const TABLE_CAMPAIGNS = "Campaigns";
const TABLE_CAMPAIGN_SEARCHES = "CampaignSearches";
// Forms
const TABLE_QUOTE_FORM = "QuoteForm";
const TABLE_NEWSLETTER_FORM = "NewsletterForm";
const TABLE_TEST_DRIVE_FORM = "TestDriveForm";
// Configurations
const TABLE_CONFIGURATIONS = "Configurations";
// Errors
const TABLE_ERRORS = "Errors";

export const getDbConnection = async () => {
    const db = await openDatabase({
        name: DATABASE_NAME,
        location: 'default',
        key: DB_PASS,

    }, () => {
        console.log('openDatabase - success');
    }, (error) => {
        console.log('openDatabase - error:', JSON.stringify(error));
    });
    return db;
}


/* ******************************* */
/* ***** Create/Alter Tables ***** */
/* ******************************* */

//#region Create Tables

export const createTables = async (db: SQLiteDatabase): Promise<Transaction> => {
    // Provinces
    let provinceQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_PROVINCES} (`;
    provinceQuery += "ID INTEGER PRIMARY KEY, ";
    provinceQuery += "Name TEXT";
    provinceQuery += ")";
    // Localities
    let localityQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_LOCALITIES} (`;
    localityQuery += "ID INTEGER PRIMARY KEY, ";
    localityQuery += "ProvinceID INTEGER, ";
    localityQuery += "Name TEXT, ";
    localityQuery += `FOREIGN KEY(ProvinceID) REFERENCES ${TABLE_PROVINCES}(ID)`;
    localityQuery += ")";
    // Events
    let eventQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_EVENTS} (`;
    eventQuery += "ID INTEGER PRIMARY KEY, ";
    eventQuery += "Name TEXT, ";
    eventQuery += "DateFrom DATETIME, ";
    eventQuery += "DateTo DATETIME, ";
    eventQuery += "Image TEXT";
    eventQuery += ")";
    // SubEvents
    let subEventQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_SUB_EVENTS} (`;
    subEventQuery += "ID INTEGER PRIMARY KEY, ";
    subEventQuery += "EventID INTEGER, ";
    subEventQuery += "Name TEXT, ";
    subEventQuery += "DateFrom DATETIME, ";
    subEventQuery += "DateTo DATETIME, ";
    subEventQuery += "GuestNumber INTEGER, ";
    subEventQuery += "Image TEXT, ";
    subEventQuery += `FOREIGN KEY(EventID) REFERENCES ${TABLE_EVENTS}(ID)`;
    subEventQuery += ")";
    // Guests
    let guestsQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_GUESTS} (`;
    guestsQuery += "ID INTEGER PRIMARY KEY AUTOINCREMENT, ";
    guestsQuery += "ServerId INTEGER, ";
    guestsQuery += "EventID INTEGER, ";
    guestsQuery += "SubEventID INTEGER, ";
    guestsQuery += "CreatedOn DATETIME, ";
    guestsQuery += "ModifiedOn DATETIME, ";
    guestsQuery += "WasModified INTEGER, "; // bool (0: false, 1: true)
    guestsQuery += "Firstname TEXT, ";
    guestsQuery += "Lastname TEXT, ";
    guestsQuery += "DocumentNumber TEXT, ";
    guestsQuery += "PhoneNumber TEXT, ";
    guestsQuery += "Email TEXT, ";
    guestsQuery += "CarLicencePlate TEXT, ";
    guestsQuery += "Type TEXT, ";
    guestsQuery += "CompanionReference TEXT, ";
    guestsQuery += "Observations1 TEXT, ";
    guestsQuery += "Observations2 TEXT, ";
    guestsQuery += "Observations3 TEXT, ";
    guestsQuery += "Zone TEXT, ";
    guestsQuery += "Status TEXT, ";
    guestsQuery += "IsSynchronized INTEGER, "; // bool (0: false, 1: true)
    guestsQuery += "SyncDate DATETIME, ";
    guestsQuery += "Deleted INTEGER"; // bool (0: false, 1: true)
    //guestsQuery += `FOREIGN KEY(SubEventID) REFERENCES ${TABLE_SUB_EVENTS}(ID)`;
    guestsQuery += ")";
    // Vehicles
    let vehicleQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_VEHICLES} (`;
    vehicleQuery += "ID INTEGER PRIMARY KEY, ";
    vehicleQuery += "Name TEXT, ";
    vehicleQuery += "Type TEXT, ";
    vehicleQuery += "Image TEXT";
    vehicleQuery += ")";
    // VehicleVersions
    let vehicleVersionQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_VEHICLE_VERSIONS} (`;
    vehicleVersionQuery += "ID INTEGER PRIMARY KEY, ";
    vehicleVersionQuery += "VehicleID INTEGER, ";
    vehicleVersionQuery += "Name TEXT, ";
    vehicleVersionQuery += "Price TEXT, ";
    vehicleVersionQuery += "ModelYear TEXT, ";
    vehicleVersionQuery += "TMA TEXT, ";
    vehicleVersionQuery += "SEQ TEXT, ";
    vehicleVersionQuery += `FOREIGN KEY(VehicleID) REFERENCES ${TABLE_VEHICLES}(ID)`;
    vehicleVersionQuery += ")";
    // VehicleColors
    let vehicleColorQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_VEHICLE_COLORS} (`;
    vehicleColorQuery += "ID INTEGER PRIMARY KEY, ";
    vehicleColorQuery += "VehicleID INTEGER, ";
    vehicleColorQuery += "ColorName TEXT, ";
    vehicleColorQuery += "ColorImageUrl TEXT, ";
    vehicleColorQuery += "VehicleImageUrl TEXT, ";
    vehicleColorQuery += `FOREIGN KEY(VehicleID) REFERENCES ${TABLE_VEHICLES}(ID)`;
    vehicleColorQuery += ")";
    // VehicleImages
    let vehicleImageQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_VEHICLE_IMAGES} (`;
    vehicleImageQuery += "ID INTEGER PRIMARY KEY, ";
    vehicleImageQuery += "VehicleID INTEGER, ";
    vehicleImageQuery += "VehicleImageUrl TEXT, ";
    vehicleImageQuery += `FOREIGN KEY(VehicleID) REFERENCES ${TABLE_VEHICLES}(ID)`;
    vehicleImageQuery += ")";
    // VehicleFeaturesGroups
    let vehicleFeaturesGroupsQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_VEHICLE_FEATURES_GROUPS} (`;
    vehicleFeaturesGroupsQuery += "ID INTEGER PRIMARY KEY, ";
    vehicleFeaturesGroupsQuery += "VehicleID INTEGER, ";
    vehicleFeaturesGroupsQuery += "Name TEXT, ";
    vehicleFeaturesGroupsQuery += `FOREIGN KEY(VehicleID) REFERENCES ${TABLE_VEHICLES}(ID)`;
    vehicleFeaturesGroupsQuery += ")";
    // VehicleFeatures
    let vehicleFeaturesQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_VEHICLE_FEATURES} (`;
    vehicleFeaturesQuery += "ID INTEGER PRIMARY KEY, ";
    vehicleFeaturesQuery += "FeatureGroupID INTEGER, ";
    vehicleFeaturesQuery += "Name TEXT, ";
    vehicleFeaturesQuery += `FOREIGN KEY(FeatureGroupID) REFERENCES ${TABLE_VEHICLE_FEATURES_GROUPS}(ID)`;
    vehicleFeaturesQuery += ")";
    // VehicleFeaturesVersions
    let vehicleFeaturesVersionsQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_VEHICLE_FEATURES_VERSIONS} (`;
    vehicleFeaturesVersionsQuery += "ID INTEGER PRIMARY KEY AUTOINCREMENT, ";
    vehicleFeaturesVersionsQuery += "VersionID INTEGER, ";
    vehicleFeaturesVersionsQuery += "FeatureID INTEGER, ";
    vehicleFeaturesVersionsQuery += "Value TEXT, ";
    vehicleFeaturesVersionsQuery += `FOREIGN KEY(VersionID) REFERENCES ${TABLE_VEHICLE_VERSIONS}(ID)`;
    vehicleFeaturesVersionsQuery += `FOREIGN KEY(FeatureID) REFERENCES ${TABLE_VEHICLE_FEATURES}(ID)`;
    vehicleFeaturesVersionsQuery += ")";
    // VehiclesAccessories
    let vehicleAccessoriesQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_VEHICLE_ACCESSORIES} (`;
    vehicleAccessoriesQuery += "ID INTEGER PRIMARY KEY, ";
    vehicleAccessoriesQuery += "VehicleID INTEGER, ";
    vehicleAccessoriesQuery += "Name TEXT, ";
    vehicleAccessoriesQuery += "Image TEXT, ";
    vehicleAccessoriesQuery += "Description TEXT, ";
    vehicleAccessoriesQuery += "Observation TEXT, ";
    vehicleAccessoriesQuery += `FOREIGN KEY(VehicleID) REFERENCES ${TABLE_VEHICLES}(ID)`;
    vehicleAccessoriesQuery += ")";
    // Dealerships
    let dealershipQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_DEALERSHIPS} (`;
    dealershipQuery += "ID INTEGER PRIMARY KEY, ";
    dealershipQuery += "ProvinceID INTEGER, ";
    dealershipQuery += "LocalityID INTEGER, ";
    dealershipQuery += "ProvinceName TEXT, ";
    dealershipQuery += "LocalityName TEXT, ";
    dealershipQuery += "Name TEXT, ";
    dealershipQuery += "Code TEXT, ";
    dealershipQuery += "StreetNameAndNumber TEXT, ";
    dealershipQuery += "PostalCode TEXT, ";
    dealershipQuery += "Phone1 TEXT, ";
    dealershipQuery += "Phone2 TEXT, ";
    dealershipQuery += "DealerCode TEXT, ";
    dealershipQuery += "Latitude DOUBLE, ";
    dealershipQuery += "Longitude DOUBLE, ";
    dealershipQuery += `FOREIGN KEY(ProvinceID) REFERENCES ${TABLE_PROVINCES}(ID)`;
    dealershipQuery += `FOREIGN KEY(LocalityID) REFERENCES ${TABLE_LOCALITIES}(ID)`;
    dealershipQuery += ")";
    // Quote Form
    let quoteFormQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_QUOTE_FORM} (`;
    quoteFormQuery += "ID INTEGER PRIMARY KEY AUTOINCREMENT, ";
    quoteFormQuery += "EventID INTEGER, ";
    quoteFormQuery += "EventName TEXT, ";
    quoteFormQuery += "DealershipID INTEGER, ";
    quoteFormQuery += "DealershipName TEXT, ";
    quoteFormQuery += "DealershipCode TEXT, ";
    quoteFormQuery += "ProvinceId INTEGER, ";
    quoteFormQuery += "ProvinceName TEXT, ";
    quoteFormQuery += "LocalityId INTEGER, ";
    quoteFormQuery += "LocalityName TEXT, ";
    quoteFormQuery += "VehicleID INTEGER, ";
    quoteFormQuery += "VehicleName TEXT, ";
    quoteFormQuery += "VehicleVersionId INTEGER, ";
    quoteFormQuery += "VehicleVersionName TEXT, ";
    quoteFormQuery += "VehicleModelYear TEXT, ";
    quoteFormQuery += "VehicleTMA TEXT, ";
    quoteFormQuery += "VehicleSEQ TEXT, ";
    quoteFormQuery += "Firstname TEXT, ";
    quoteFormQuery += "Lastname TEXT, ";
    quoteFormQuery += "DocumentType TEXT, ";
    quoteFormQuery += "DocumentNumber TEXT, ";
    quoteFormQuery += "Email TEXT, ";
    quoteFormQuery += "PointOfSale TEXT, ";
    quoteFormQuery += "PhoneArea TEXT, ";
    quoteFormQuery += "Phone TEXT, ";
    quoteFormQuery += "ContactPreference TEXT, ";
    quoteFormQuery += "ReceiveInformation INTEGER, "; // bool (0: false, 1: true)
    quoteFormQuery += "AcceptConditions INTEGER, "; // bool (0: false, 1: true)
    quoteFormQuery += "CreatedOn DATETIME, ";
    quoteFormQuery += "ModifiedOn DATETIME, ";
    quoteFormQuery += "IsSynchronized INTEGER, "; // bool (0: false, 1: true)
    quoteFormQuery += "SyncDate DATETIME, ";
    quoteFormQuery += "SyncFailed INTEGER"; // bool (0: false, 1: true)
    quoteFormQuery += ")";
    // Newsletter Form
    let newsletterFormQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_NEWSLETTER_FORM} (`;
    newsletterFormQuery += "ID INTEGER PRIMARY KEY AUTOINCREMENT, ";
    newsletterFormQuery += "EventID INTEGER, ";
    newsletterFormQuery += "EventName TEXT, ";
    newsletterFormQuery += "VehicleID INTEGER, ";
    newsletterFormQuery += "VehicleName TEXT, ";
    newsletterFormQuery += "Firstname TEXT, ";
    newsletterFormQuery += "Lastname TEXT, ";
    newsletterFormQuery += "DocumentType TEXT, ";
    newsletterFormQuery += "DocumentNumber TEXT, ";
    newsletterFormQuery += "Email TEXT, ";
    newsletterFormQuery += "PhoneArea TEXT, ";
    newsletterFormQuery += "Phone TEXT, ";
    newsletterFormQuery += "ContactPreference TEXT, ";
    newsletterFormQuery += "ReceiveInformation INTEGER, "; // bool (0: false, 1: true)
    newsletterFormQuery += "AcceptConditions INTEGER, "; // bool (0: false, 1: true)
    newsletterFormQuery += "CreatedOn DATETIME, ";
    newsletterFormQuery += "ModifiedOn DATETIME, ";
    newsletterFormQuery += "IsSynchronized INTEGER, "; // bool (0: false, 1: true)
    newsletterFormQuery += "SyncDate DATETIME, ";
    newsletterFormQuery += "SyncFailed INTEGER"; // bool (0: false, 1: true)
    newsletterFormQuery += ")";
    // TestDrive Form
    let testDriveFormQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_TEST_DRIVE_FORM} (`;
    testDriveFormQuery += "ID INTEGER PRIMARY KEY AUTOINCREMENT, ";
    testDriveFormQuery += "EventID INTEGER, ";
    testDriveFormQuery += "EventName TEXT, ";
    testDriveFormQuery += "VehicleID INTEGER, ";
    testDriveFormQuery += "VehicleName TEXT, ";
    testDriveFormQuery += "Date DATETIME, ";
    testDriveFormQuery += "TimeZone TEXT, ";
    testDriveFormQuery += "Firstname TEXT, ";
    testDriveFormQuery += "Lastname TEXT, ";
    testDriveFormQuery += "DocumentType TEXT, ";
    testDriveFormQuery += "DocumentNumber TEXT, ";
    testDriveFormQuery += "Email TEXT, ";
    testDriveFormQuery += "DrivingLicenseExpiration DATETIME, ";
    testDriveFormQuery += "PhoneArea TEXT, ";
    testDriveFormQuery += "Phone TEXT, ";
    testDriveFormQuery += "ContactPreference TEXT, ";
    testDriveFormQuery += "HasVehicle INTEGER, "; // DriverTypeEnum
    testDriveFormQuery += "VehicleInfo TEXT, ";
    testDriveFormQuery += "Companion1Firstname TEXT, ";
    testDriveFormQuery += "Companion1Lastname TEXT, ";
    testDriveFormQuery += "Companion1Age TEXT, ";
    testDriveFormQuery += "Companion2Fullname TEXT, ";
    testDriveFormQuery += "Companion2Age TEXT, ";
    testDriveFormQuery += "Companion3Fullname TEXT, ";
    testDriveFormQuery += "Companion3Age TEXT, ";
    testDriveFormQuery += "ReceiveInformation INTEGER, "; // bool (0: false, 1: true)
    testDriveFormQuery += "AcceptConditions INTEGER, "; // bool (0: false, 1: true)
    testDriveFormQuery += "Signature TEXT, ";
    testDriveFormQuery += "ResizedSignature TEXT, ";
    testDriveFormQuery += "CreatedOn DATETIME, ";
    testDriveFormQuery += "ModifiedOn DATETIME, ";
    testDriveFormQuery += "IsSynchronized INTEGER, "; // bool (0: false, 1: true)
    testDriveFormQuery += "SyncDate DATETIME, ";
    testDriveFormQuery += "SyncFailed INTEGER"; // bool (0: false, 1: true)
    testDriveFormQuery += ")";
    // Campaigns
    let campaignsQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_CAMPAIGNS} (`;
    campaignsQuery += "ID INTEGER PRIMARY KEY, ";
    campaignsQuery += "Env TEXT, ";
    campaignsQuery += "Vin TEXT, ";
    campaignsQuery += "CC TEXT, ";
    campaignsQuery += "Pat TEXT, ";
    campaignsQuery += "Serv TEXT, ";
    campaignsQuery += "ServDate TEXT, ";
    campaignsQuery += "Manten TEXT";
    campaignsQuery += ")";
    // Campaign Searches
    let campaignSearchesQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_CAMPAIGN_SEARCHES} (`;
    campaignSearchesQuery += "ID INTEGER PRIMARY KEY AUTOINCREMENT, ";
    campaignSearchesQuery += "EventID INTEGER, ";
    campaignSearchesQuery += "EventName TEXT, ";
    campaignSearchesQuery += "SearchText TEXT, ";
    campaignSearchesQuery += "SearchDate DATETIME, ";
    campaignSearchesQuery += "CampaignID INTEGER, ";
    campaignSearchesQuery += "Env TEXT, ";
    campaignSearchesQuery += "Vin TEXT, ";
    campaignSearchesQuery += "CC TEXT, ";
    campaignSearchesQuery += "Pat TEXT, ";
    campaignSearchesQuery += "Serv TEXT, ";
    campaignSearchesQuery += "ServDate TEXT, ";
    campaignSearchesQuery += "Manten TEXT, ";
    campaignSearchesQuery += "IsSynchronized INTEGER, "; // bool (0: false, 1: true)
    campaignSearchesQuery += "SyncDate DATETIME"; // bool (0: false, 1: true)
    campaignSearchesQuery += ")";
    // Configurations
    let configurationQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_CONFIGURATIONS} (`;
    configurationQuery += "ID INTEGER PRIMARY KEY AUTOINCREMENT, ";
    configurationQuery += "TestDriveDemarcationOwnerUrl TEXT, ";
    configurationQuery += "TestDriveDemarcationFordUrl TEXT, ";
    configurationQuery += "TestDriveTermsUrl TEXT, ";
    configurationQuery += "NewsletterUrl TEXT, ";
    configurationQuery += "QuoteUrl TEXT, ";
    configurationQuery += "ContactData TEXT";
    configurationQuery += ")";
    // Errors
    let errorQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_ERRORS} (`;
    errorQuery += "ID INTEGER PRIMARY KEY AUTOINCREMENT, ";
    errorQuery += "Description TEXT, ";
    errorQuery += "Date TEXT, ";
    errorQuery += "Type TEXT, ";
    errorQuery += "DeviceId TEXT, ";
    errorQuery += "DeviceName TEXT, ";
    errorQuery += "OperativeSystem TEXT, ";
    errorQuery += "OperativeSystemVersion TEXT, ";
    errorQuery += "Brand TEXT, ";
    errorQuery += "Model TEXT, ";
    errorQuery += "AppVersion TEXT, ";
    errorQuery += "ConnectionType TEXT";
    errorQuery += ")";

    return db.transaction(trans => {
        //trans.executeSql("PRAGMA foreign_keys = ON;");
        trans.executeSql(provinceQuery);
        trans.executeSql(localityQuery);
        trans.executeSql(eventQuery);
        trans.executeSql(subEventQuery);
        trans.executeSql(guestsQuery);
        trans.executeSql(vehicleQuery);
        trans.executeSql(vehicleVersionQuery);
        trans.executeSql(vehicleColorQuery);
        trans.executeSql(vehicleImageQuery);
        trans.executeSql(vehicleFeaturesGroupsQuery);
        trans.executeSql(vehicleFeaturesQuery);
        trans.executeSql(vehicleFeaturesVersionsQuery);
        trans.executeSql(vehicleAccessoriesQuery);
        trans.executeSql(dealershipQuery);
        trans.executeSql(quoteFormQuery);
        trans.executeSql(newsletterFormQuery);
        trans.executeSql(testDriveFormQuery);
        trans.executeSql(campaignsQuery);
        trans.executeSql(campaignSearchesQuery);
        trans.executeSql(configurationQuery);
        trans.executeSql(errorQuery);
    });
}

//#endregion

//#region Alter Tables

export const alterTables = async (db: SQLiteDatabase): Promise<void> => {
    // Add Columns
    const vehicleAccessoriesPartNumberQuery = await getVehicleAccessoriesPartNumberAlterQuery(db);
    const vehicleAccessoriesModelForQuery = await getVehicleAccessoriesModelForAlterQuery(db);
    const vehicleVersionPreLaunchQuery = await getVehicleVersionPreLaunchAlterQuery(db);
    const guestChangedByQRScannerQuery = await getGuestChangedByQRScannerAlterQuery(db);
    const eventTestDriveDemarcationOwnerEnabledQuery = await getEventTestDriveDemarcationOwnerEnabledAlterQuery(db);
    const eventTestDriveDemarcationOwnerInCaravanEnabledQuery = await getEventTestDriveDemarcationOwnerInCaravanEnabledAlterQuery(db);
    const eventTestDriveDemarcationFordEnabledQuery = await getEventTestDriveDemarcationFordEnabledAlterQuery(db);
    const configurationDemarcationOwnerInCaravanAlterQuery = await getConfigurationDemarcationOwnerInCaravanAlterQuery(db);
    const vehicleFeatureGroupOrderAlterQuery = await getVehicleFeatureGroupOrderAlterQuery(db);
    const vehicleFeatureOrderAlterQuery = await getVehicleFeatureOrderAlterQuery(db);
    const eventCodeAlterQuery = await getEventCodeAlterQuery(db);
    const quoteFormEventCodeAlterQuery = await getQuoteFormEventCodeAlterQuery(db);
    const newsletterFormEventCodeAlterQuery = await getNewsletterFormEventCodeAlterQuery(db);
    const newsletterFormIsSynchronizedWithSaleforceAlterQuery = await getNewsletterFormIsSynchronizedWithSaleforceAlterQuery(db);
    const testDriveFormEventCodeAlterQuery = await getTestDriveFormEventCodeAlterQuery(db);
    const testDriveFormIsSynchronizedWithSaleforceAlterQuery = await getTestDriveIsSynchronizedWithSaleforceAlterQuery(db);
    const testDriveFormQr = await getTestDriveFormQrAlterQuery(db);

    // CAMPAIGNS Index
    const vinIndex = getSafeQuery(`CREATE INDEX IF NOT EXISTS Campaigns_Vin ON ${TABLE_CAMPAIGNS} (Vin)`);
    const patIndex = getSafeQuery(`CREATE INDEX IF NOT EXISTS Campaigns_Pat ON ${TABLE_CAMPAIGNS} (Pat)`);
    const guestSubeventIndex = getSafeQuery(`CREATE INDEX IF NOT EXISTS Guest_Subevent_Id ON ${TABLE_GUESTS} (SubEventID)`);
    const guestFirstnameIndex = getSafeQuery(`CREATE INDEX IF NOT EXISTS Guest_Firstname ON ${TABLE_GUESTS} (Firstname)`);
    const guestLastnameIndex = getSafeQuery(`CREATE INDEX IF NOT EXISTS Guest_Lastname ON ${TABLE_GUESTS} (Lastname)`);

    await db.transaction(trans => {
        try {
            if (vehicleAccessoriesPartNumberQuery)
                trans.executeSql(vehicleAccessoriesPartNumberQuery!);
            if (vehicleAccessoriesModelForQuery)
                trans.executeSql(vehicleAccessoriesModelForQuery);
            if (vehicleVersionPreLaunchQuery)
                trans.executeSql(vehicleVersionPreLaunchQuery);
            if (guestChangedByQRScannerQuery)
                trans.executeSql(guestChangedByQRScannerQuery);
            if (eventTestDriveDemarcationOwnerEnabledQuery)
                trans.executeSql(eventTestDriveDemarcationOwnerEnabledQuery);
            if (eventTestDriveDemarcationOwnerInCaravanEnabledQuery)
                trans.executeSql(eventTestDriveDemarcationOwnerInCaravanEnabledQuery);
            if (eventTestDriveDemarcationFordEnabledQuery)
                trans.executeSql(eventTestDriveDemarcationFordEnabledQuery);
            if (configurationDemarcationOwnerInCaravanAlterQuery)
                trans.executeSql(configurationDemarcationOwnerInCaravanAlterQuery);
            if (vehicleFeatureGroupOrderAlterQuery)
                trans.executeSql(vehicleFeatureGroupOrderAlterQuery);
            if (vehicleFeatureOrderAlterQuery)
                trans.executeSql(vehicleFeatureOrderAlterQuery);
            if (eventCodeAlterQuery)
                trans.executeSql(eventCodeAlterQuery);
            if (quoteFormEventCodeAlterQuery)
                trans.executeSql(quoteFormEventCodeAlterQuery);
            if (newsletterFormEventCodeAlterQuery)
                trans.executeSql(newsletterFormEventCodeAlterQuery);
            if (testDriveFormEventCodeAlterQuery)
                trans.executeSql(testDriveFormEventCodeAlterQuery);
            if (newsletterFormIsSynchronizedWithSaleforceAlterQuery)
                trans.executeSql(newsletterFormIsSynchronizedWithSaleforceAlterQuery);
            if (testDriveFormIsSynchronizedWithSaleforceAlterQuery)
                trans.executeSql(testDriveFormIsSynchronizedWithSaleforceAlterQuery);
            if (testDriveFormQr)
                trans.executeSql(testDriveFormQr);

            trans.executeSql(vinIndex);
            trans.executeSql(patIndex);
            trans.executeSql(guestSubeventIndex);
            trans.executeSql(guestFirstnameIndex);
            trans.executeSql(guestLastnameIndex);
        } catch (error) {
            console.log('alterTables - Error:', error);
        }
    });

    if (newsletterFormIsSynchronizedWithSaleforceAlterQuery) {
        try {
            await db.executeSql(getNewsletterFormIsSynchronizedWithSaleforceUpdateQuery());
        } catch (error) {
            console.log('alterTables - IsSynchronizedWithSaleforce Error:', error);
        }
    }
    if (testDriveFormIsSynchronizedWithSaleforceAlterQuery) {
        try {
            await db.executeSql(getTestDriveIsSynchronizedWithSaleforceUpdateQuery());
        } catch (error) {
            console.log('alterTables - IsSynchronizedWithSaleforce Error:', error);
        }
    }
}

const getVehicleAccessoriesPartNumberAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_VEHICLE_ACCESSORIES, 'PartNumber');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_VEHICLE_ACCESSORIES} ADD COLUMN PartNumber TEXT default null`);

    return null;
}

const getVehicleAccessoriesModelForAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_VEHICLE_ACCESSORIES, 'ModelFor');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_VEHICLE_ACCESSORIES} ADD COLUMN ModelFor TEXT default null`);

    return null;
}

const getVehicleVersionPreLaunchAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_VEHICLE_VERSIONS, 'PreLaunch');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_VEHICLE_VERSIONS} ADD COLUMN PreLaunch INTEGER default 0`); // bool (0: false, 1: true)

    return null;
}

const getGuestChangedByQRScannerAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_GUESTS, 'ChangedByQRScanner');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_GUESTS} ADD COLUMN ChangedByQRScanner INTEGER default 0`); // bool (0: false, 1: true)

    return null;
}

const getTestDriveFormQrAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_TEST_DRIVE_FORM, 'LoadedByQR');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_TEST_DRIVE_FORM} ADD COLUMN LoadedByQR INTEGER default 0`); // bool (0: false, 1: true)

    return null;
}

const getEventTestDriveDemarcationOwnerEnabledAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_EVENTS, 'TestDriveDemarcationOwnerEnabled');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_EVENTS} ADD COLUMN TestDriveDemarcationOwnerEnabled INTEGER default 1`); // bool (0: false, 1: true)

    return null;
}

const getEventTestDriveDemarcationOwnerInCaravanEnabledAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_EVENTS, 'TestDriveDemarcationOwnerInCaravanEnabled');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_EVENTS} ADD COLUMN TestDriveDemarcationOwnerInCaravanEnabled INTEGER default 0`); // bool (0: false, 1: true)

    return null;
}

const getEventTestDriveDemarcationFordEnabledAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_EVENTS, 'TestDriveDemarcationFordEnabled');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_EVENTS} ADD COLUMN TestDriveDemarcationFordEnabled INTEGER default 1`); // bool (0: false, 1: true)

    return null;
}

const getConfigurationDemarcationOwnerInCaravanAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_CONFIGURATIONS, 'DemarcationOwnerInCaravan');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_CONFIGURATIONS} ADD COLUMN DemarcationOwnerInCaravan TEXT default null`);

    return null;
}

const getVehicleFeatureGroupOrderAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_VEHICLE_FEATURES_GROUPS, 'OrderIndex');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_VEHICLE_FEATURES_GROUPS} ADD COLUMN OrderIndex INTEGER default 0`);

    return null;
}

const getVehicleFeatureOrderAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_VEHICLE_FEATURES, 'OrderIndex');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_VEHICLE_FEATURES} ADD COLUMN OrderIndex INTEGER default 0`);

    return null;
}

const getEventCodeAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_EVENTS, 'Code');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_EVENTS} ADD COLUMN Code TEXT default null`);

    return null;
}

const getQuoteFormEventCodeAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_QUOTE_FORM, 'EventCode');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_QUOTE_FORM} ADD COLUMN EventCode TEXT default null`);

    return null;
}

const getNewsletterFormEventCodeAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_NEWSLETTER_FORM, 'EventCode');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_NEWSLETTER_FORM} ADD COLUMN EventCode TEXT default null`);

    return null;
}

const getNewsletterFormIsSynchronizedWithSaleforceAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_NEWSLETTER_FORM, 'IsSynchronizedWithSaleforce');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_NEWSLETTER_FORM} ADD COLUMN IsSynchronizedWithSaleforce INTEGER default 0`);// bool (0: false, 1: true)

    return null;
}

const getNewsletterFormIsSynchronizedWithSaleforceUpdateQuery = (): string => {
    return getSafeQuery(`UPDATE ${TABLE_NEWSLETTER_FORM} SET IsSynchronizedWithSaleforce = IsSynchronized`);
}

const getTestDriveFormEventCodeAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_TEST_DRIVE_FORM, 'EventCode');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_TEST_DRIVE_FORM} ADD COLUMN EventCode TEXT default null`);

    return null;
}

const getTestDriveIsSynchronizedWithSaleforceAlterQuery = async (db: SQLiteDatabase): Promise<string | null> => {
    const exists = await isColumnExist(db, TABLE_TEST_DRIVE_FORM, 'IsSynchronizedWithSaleforce');
    if (!exists)
        return getSafeQuery(`ALTER TABLE ${TABLE_TEST_DRIVE_FORM} ADD COLUMN IsSynchronizedWithSaleforce INTEGER default 0`);// bool (0: false, 1: true)

    return null;
}

const getTestDriveIsSynchronizedWithSaleforceUpdateQuery = (): string => {
    return getSafeQuery(`UPDATE ${TABLE_TEST_DRIVE_FORM} SET IsSynchronizedWithSaleforce = IsSynchronized`);
}

// This method will check if column exists in your table
const isColumnExist = async (db: SQLiteDatabase, tableName: string, columnName: string): Promise<boolean> => {
    let exist = false;
    const results = await db.executeSql(`PRAGMA table_info(${tableName})`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const colName = resultSet.rows.item(index2).name;
            if (columnName == colName)
                exist = true;
        }
    }

    return exist;
}

const isIndexExists = async (db: SQLiteDatabase, tableName: string, indexName: string): Promise<boolean> => {
    let exist = false;
    const results = await db.executeSql(`SELECT count(*) FROM sqlite_master WHERE type='index' and name=${indexName};`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            console.log('isIndexExists', resultSet.rows.item(index2));
            // const colName = resultSet.rows.item(index2).name;
            // if (columnName == colName)
            //     exist = true;
        }
    }

    return exist;
}

//#endregion



/* ******************* */
/* ***** Inserts ***** */
/* ******************* */

//#region Inserts

//#region Inserts Provinces And Localities

const getInsertProvincesQueries = (provinces: Province[]): string[] => {
    let insertQueries: string[] = [];
    provinces?.forEach(x => {
        insertQueries.push(getSafeQuery(`
            INSERT INTO ${TABLE_PROVINCES} (ID, Name) VALUES (
                ${x.id}, 
                '${escapeValue(x.name)}'
            );
        `))
    });
    return insertQueries;
}

const getInsertLocalitiesQueries = (provinces: Province[]): string[] => {
    let insertQueries: string[] = [];
    provinces?.forEach(x => {
        x.localities?.forEach(y => {
            insertQueries.push(getSafeQuery(`
                INSERT INTO ${TABLE_LOCALITIES} (ID, ProvinceID, Name) VALUES (
                    ${y.id},
                    ${x.id},
                    '${escapeValue(y.name)}'
                );
            `))
        })
    });
    return insertQueries;
}

//#endregion

//#region Inserts Events, SubEvents, Guests

/**
 * 
 * @param events events to create
 * @param unsynchronizedEventIds ids of unsynchronized events
 * @returns array with insert queries
 */
const getInsertEventsQueries = (events: Event[]): string[] => {
    let insertQueries: string[] = [];
    events?.forEach(x => {
        insertQueries.push(getSafeQuery(`
            INSERT INTO ${TABLE_EVENTS} (ID, Name, Code, DateFrom, DateTo, Image, TestDriveDemarcationOwnerEnabled, TestDriveDemarcationOwnerInCaravanEnabled, TestDriveDemarcationFordEnabled) VALUES (
                ${x.id},
                '${escapeValue(x.name)}',
                '${escapeValue(x.code)}',
                '${x.dateFrom}',
                '${x.dateTo}',
                '${x.image}',
                ${x.testDriveDemarcationOwnerEnabled == true ? 1 : 0},
                ${x.testDriveDemarcationOwnerInCaravanEnabled == true ? 1 : 0},
                ${x.testDriveDemarcationFordEnabled == true ? 1 : 0}
            );
        `));
    });
    return insertQueries;
}

const getUpdateEventsQueries = (events: Event[]): string[] => {
    let updateQueries: string[] = [];
    events?.forEach(x => {
        updateQueries.push(getSafeQuery(`
            UPDATE ${TABLE_EVENTS} 
            SET 
                Name = '${escapeValue(x.name)}', 
                Code = '${escapeValue(x.code)}', 
                DateFrom = '${x.dateFrom}', 
                DateTo = '${x.dateTo}', 
                Image = '${x.image}', 
                TestDriveDemarcationOwnerEnabled = ${x.testDriveDemarcationOwnerEnabled == true ? 1 : 0}, 
                TestDriveDemarcationOwnerInCaravanEnabled = ${x.testDriveDemarcationOwnerInCaravanEnabled == true ? 1 : 0}, 
                TestDriveDemarcationFordEnabled = ${x.testDriveDemarcationFordEnabled == true ? 1 : 0} 
                WHERE ID = ${x.id};
        `))
    });
    return updateQueries;
}

const getInsertSubEventsQueries = (events: Event[]): string[] => {
    let insertQueries: string[] = [];
    events?.forEach(x => {
        x.subEvents?.forEach(y => {
            insertQueries.push(getSafeQuery(`
                INSERT INTO ${TABLE_SUB_EVENTS} (ID, EventID, Name, DateFrom, DateTo, GuestNumber, Image) VALUES (
                    ${y.id},
                    ${x.id},
                    '${escapeValue(y.name)}',
                    '${y.dateFrom}',
                    '${y.dateTo}',
                    ${y.guestNumber ?? 0},
                    '${y.image}'
                );
            `));
        })
    });
    return insertQueries;
}

const getUpdateSubEventsQueries = (events: Event[], currentSubEvents: SubEvent[]): string[] => {
    let queries: string[] = [];
    events?.forEach(event => {
        event.subEvents?.forEach(subEvent => {
            if (!currentSubEvents || currentSubEvents.findIndex(x => x.id == subEvent.id) == -1) {
                queries.push(getSafeQuery(`
                    INSERT INTO ${TABLE_SUB_EVENTS} (ID, EventID, Name, DateFrom, DateTo, GuestNumber, Image) VALUES (
                        ${subEvent.id},
                        ${event.id},
                        '${escapeValue(subEvent.name)}',
                        '${subEvent.dateFrom}',
                        '${subEvent.dateTo}',
                        ${subEvent.guestNumber ?? 0},
                        '${subEvent.image}'
                    );
                `));
            } else {
                queries.push(getSafeQuery(`
                    UPDATE ${TABLE_SUB_EVENTS} 
                    SET Name = '${escapeValue(subEvent.name)}', DateFrom = '${subEvent.dateFrom}', DateTo = '${subEvent.dateTo}', GuestNumber = ${subEvent.guestNumber ?? 0}, Image = '${subEvent.image}' 
                    WHERE ID = ${subEvent.id};
                `));
            }
        })
    });
    return queries;
}

const getInsertGuestsQueries = (events: Event[], currentSubEvents: SubEvent[]): string[] => {
    let insertQueries: string[] = [];

    let currentGuests: Guest[] = [];
    currentSubEvents.forEach(x => currentGuests.push(...x?.guests ?? []));

    events?.filter(x => !x.deleted).forEach(event => {
        event?.subEvents?.filter(x => !x.deleted)?.forEach(subEvent => {
            subEvent?.guests?.filter(x => !x.deleted)?.forEach(guest => {
                const existingUser = currentGuests.find(x => x.serverId == guest.serverId);
                if (!existingUser) {
                    // ModifiedOn = 0 significa que todavía no fue modificado en la app
                    insertQueries.push(getSafeQuery(`
                        INSERT INTO ${TABLE_GUESTS} (ServerId, EventID, SubEventID, CreatedOn, ModifiedOn, WasModified, Firstname, Lastname, DocumentNumber, PhoneNumber, Email, CarLicencePlate, Type, CompanionReference, Observations1, Observations2, Observations3, Zone, Status, IsSynchronized, SyncDate, Deleted) VALUES (
                            ${guest.serverId},
                            ${event.id},
                            ${subEvent.id},
                            '${guest.createdOn}',
                            '${guest.modifiedOn}',
                            ${0},
                            '${encode(guest.firstname)}',
                            '${encode(guest.lastname)}',
                            '${encode(guest.documentNumber)}',
                            '${encode(guest.phoneNumber)}',
                            '${encode(guest.email)}',
                            '${encode(guest.carLicencePlate)}',
                            '${encode(guest.type)}',
                            '${encode(guest.companionReference)}',
                            '${encode(guest.observations1)}',
                            '${encode(guest.observations2)}',
                            '${encode(guest.observations3)}',
                            '${encode(guest.zone)}',
                            '${encode(guest.status)}',
                            ${guest.isSynchronized == true ? 1 : 0},
                            '${guest.syncDate}',
                            '${0}'
                        );
                    `));
                } else if (existingUser.isSynchronized) {
                    insertQueries.push(getSafeQuery(`
                        UPDATE ${TABLE_GUESTS} 
                        SET 
                        ServerId = ${guest.serverId},
                        EventID = ${event.id},
                        SubEventID = ${subEvent.id},
                        CreatedOn = '${guest.createdOn}',
                        ModifiedOn = '${guest.modifiedOn}',
                        WasModified = ${0},
                        Firstname = '${encode(guest.firstname)}',
                        Lastname = '${encode(guest.lastname)}',
                        DocumentNumber = '${encode(guest.documentNumber)}',
                        PhoneNumber = '${encode(guest.phoneNumber)}',
                        Email = '${encode(guest.email)}',
                        CarLicencePlate = '${encode(guest.carLicencePlate)}',
                        Type = '${encode(guest.type)}',
                        CompanionReference = '${encode(guest.companionReference)}',
                        Observations1 = '${encode(guest.observations1)}',
                        Observations2 = '${encode(guest.observations2)}',
                        Observations3 = '${encode(guest.observations3)}',
                        Zone = '${encode(guest.zone)}',
                        Status = '${encode(guest.status)}',
                        SyncDate = '${guest.syncDate}'
                        WHERE ID = ${existingUser.id};
                    `));
                }
            });
        });
    });
    return insertQueries;
}

const getInsertGuestQuery = (guest: Guest, subEventId: number): string => {
    let insertQuery: string = `INSERT INTO ${TABLE_GUESTS} (ServerId, SubEventID, CreatedOn, ModifiedOn, WasModified, Firstname, Lastname, DocumentNumber, PhoneNumber, Email, CarLicencePlate, Type, CompanionReference, Observations1, Observations2, Observations3, Zone, Status, IsSynchronized, SyncDate, Deleted) VALUES `;
    insertQuery += "('"
        + guest.serverId + "','"
        + subEventId + "','"
        + guest.createdOn + "','"
        + guest.modifiedOn + "','"
        + 1 + "','" // fue modificado en la app
        + encode(guest.firstname) + "','"
        + encode(guest.lastname) + "','"
        + encode(guest.documentNumber) + "','"
        + encode(guest.phoneNumber) + "','"
        + encode(guest.email) + "','"
        + encode(guest.carLicencePlate) + "','"
        + encode(guest.type) + "','"
        + encode(guest.companionReference) + "','"
        + encode(guest.observations1) + "','"
        + encode(guest.observations2) + "','"
        + encode(guest.observations3) + "','"
        + encode(guest.zone) + "','"
        + encode(guest.status) + "','"
        + (guest.isSynchronized == true ? 1 : 0) + "','"
        + guest.syncDate + "','"
        + 0 + "');";

    return insertQuery;
}

// const getInsertGuestQuery = (guest: Guest, eventId: number, subEventId: number): string => {
//     let insertQuery: string = `INSERT INTO ${TABLE_GUESTS} (ServerId, EventID, SubEventID, CreatedOn, ModifiedOn, WasModified, Firstname, Lastname, DocumentNumber, PhoneNumber, Email, CarLicencePlate, Type, CompanionReference, Observations1, Observations2, Observations3, Zone, Status, IsSynchronized, SyncDate, Deleted) VALUES `;
//     insertQuery += "('"
//         + guest.serverId + "','"
//         + eventId + "','"
//         + subEventId + "','"
//         + guest.createdOn + "','"
//         + guest.modifiedOn + "','"
//         + 1 + "','" // fue modificado en la app
//         + encode(guest.firstname) + "','"
//         + encode(guest.lastname) + "','"
//         + encode(guest.documentNumber) + "','"
//         + encode(guest.phoneNumber) + "','"
//         + encode(guest.email) + "','"
//         + encode(guest.carLicencePlate) + "','"
//         + encode(guest.type) + "','"
//         + encode(guest.companionReference) + "','"
//         + encode(guest.observations1) + "','"
//         + encode(guest.observations2) + "','"
//         + encode(guest.observations3) + "','"
//         + encode(guest.zone) + "','"
//         + encode(guest.status) + "','"
//         + (guest.isSynchronized == true ? 1 : 0) + "','"
//         + guest.syncDate + "','"
//         + 0 + "');";

//     return insertQuery;
// }

//#endregion

//#region Inserts Vehicles

const getInsertVehiclesQueries = (vehicles: Vehicle[]): string[] => {
    let insertQueries: string[] = [];
    vehicles?.forEach(vehicle => {
        insertQueries.push(getSafeQuery(`
            INSERT INTO ${TABLE_VEHICLES} (ID, Name, Type, Image) VALUES (
                ${vehicle.id},
                '${escapeValue(vehicle.name)}',
                '${vehicle.type}',
                '${vehicle.image}'
            );
        `))
    });
    return insertQueries;
}

const getInsertVehicleVersionsQueries = (vehicles: Vehicle[]): string[] => {
    let insertQueries: string[] = [];
    vehicles?.forEach(vehicle => {
        vehicle?.versions?.forEach(version => {
            insertQueries.push(getSafeQuery(`
                INSERT INTO ${TABLE_VEHICLE_VERSIONS} (ID, VehicleID, Name, Price, ModelYear, TMA, SEQ, PreLaunch) VALUES (
                    ${version.id},
                    ${vehicle.id},
                    '${escapeValue(version.name)}',
                    ${version.price},
                    '${escapeValue(version.modelYear)}',
                    '${escapeValue(version.tma)}',
                    '${escapeValue(version.seq)}',
                    ${(version.preLaunch == true ? 1 : 0)}
                );
            `))
        });
    });
    return insertQueries;
}

const getInsertVehicleColorsQueries = (vehicles: Vehicle[]): string[] => {
    let insertQueries: string[] = [];
    vehicles?.forEach(vehicle => {
        vehicle?.colors?.forEach(color => {
            insertQueries.push(getSafeQuery(`
                INSERT INTO ${TABLE_VEHICLE_COLORS} (ID, VehicleID, ColorName, ColorImageUrl, VehicleImageUrl) VALUES (
                    ${color.id},
                    ${vehicle.id},
                    '${escapeValue(color.colorName)}',
                    '${color.colorImageUrl}',
                    '${color.vehicleImageUrl}'
                );
            `))
        });
    });
    return insertQueries;
}

const getInsertVehicleImagesQueries = (vehicles: Vehicle[]): string[] => {
    let insertQueries: string[] = [];
    vehicles?.forEach(vehicle => {
        vehicle?.images?.forEach(image => {
            insertQueries.push(getSafeQuery(`
                INSERT INTO ${TABLE_VEHICLE_IMAGES} (ID, VehicleID, VehicleImageUrl) VALUES (
                    ${image.id},
                    ${vehicle.id},
                    '${image.vehicleImageUrl}'
                );
            `))
        });
    });
    return insertQueries;
}

const getInsertVehicleFeaturesGroupsQueries = (vehicles: Vehicle[]): string[] => {
    let insertQueries: string[] = [];
    vehicles?.forEach(vehicle => {
        vehicle?.featuresGroups?.forEach(featureGroup => {
            insertQueries.push(getSafeQuery(`
                INSERT INTO ${TABLE_VEHICLE_FEATURES_GROUPS} (ID, VehicleID, Name, OrderIndex) VALUES (
                    ${featureGroup.id},
                    ${vehicle.id},
                    '${featureGroup.name}',
                    ${featureGroup.order}
                );
            `))
        });
    });
    return insertQueries;
}

const getInsertVehicleFeaturesQueries = (vehicles: Vehicle[]): string[] => {
    let insertQueries: string[] = [];
    vehicles?.forEach(vehicle => {
        vehicle?.featuresGroups?.forEach(featureGroup => {
            featureGroup?.features?.forEach(feature => {
                insertQueries.push(getSafeQuery(`
                    INSERT INTO ${TABLE_VEHICLE_FEATURES} (ID, FeatureGroupID, Name, OrderIndex) VALUES (
                        ${feature.id},
                        ${featureGroup.id},
                        '${escapeValue(feature.name)}',
                        ${feature.order}
                    );
                `))
            });
        });
    });
    return insertQueries;
}

const getInsertVehicleFeaturesVersionsQueries = (vehicles: Vehicle[]): string[] => {
    let insertQueries: string[] = [];
    vehicles.forEach(vehicle => {
        vehicle.versions?.forEach(version => {
            version.features?.forEach(featureVersion => {
                insertQueries.push(getSafeQuery(`
                    INSERT INTO ${TABLE_VEHICLE_FEATURES_VERSIONS} (VersionID, FeatureID, Value) VALUES (
                        ${version.id},
                        ${featureVersion.featureId},
                        '${escapeValue(featureVersion.value)}'
                    );
                `))
            });
        });
    });
    return insertQueries;
}

const getInsertVehicleAccessoriesQueries = (vehicles: Vehicle[]): string[] => {
    let insertQueries: string[] = [];
    vehicles.forEach(vehicle => {
        vehicle.accessories?.forEach(accesories => {
            insertQueries.push(getSafeQuery(`
                INSERT INTO ${TABLE_VEHICLE_ACCESSORIES} (VehicleID, Name, Image, Description, Observation, PartNumber, ModelFor) VALUES (
                    ${vehicle.id},
                    '${escapeValue(accesories.name)}',
                    '${accesories.image}',
                    '${escapeValue(accesories.description)}',
                    '${escapeValue(accesories.observation)}',
                    '${escapeValue(accesories.partNumber)}',
                    '${escapeValue(accesories.modelFor)}'
                );
            `))
        });
    });
    return insertQueries;
}

//#endregion

//#region Inserts Dealerships

const getInsertDealershipsQueries = (dealerships: Dealership[]): string[] => {
    let insertQueries: string[] = [];
    dealerships?.forEach(x => {
        insertQueries.push(getSafeQuery(`
            INSERT INTO ${TABLE_DEALERSHIPS} (ID, ProvinceID, LocalityID, ProvinceName, LocalityName, Name, Code, StreetNameAndNumber, PostalCode, Phone1, Phone2, DealerCode, Latitude, Longitude) VALUES (
                ${x.id},
                ${x.provinceId},
                ${x.localityId},
                '${encode(x.provinceName)}',
                '${encode(x.localityName)}',
                '${encode(x.name)}',
                '${encode(x.code)}',
                '${encode(x.streetNameAndNumber)}',
                '${encode(x.postalCode)}',
                '${encode(x.phone1)}',
                '${encode(x.phone2)}',
                '${encode(x.dealerCode)}',
                ${x.latitude},
                ${x.longitude}
            );
        `))
    });
    return insertQueries;
}

//#endregion

//#region Inserts Campaigns

const getInsertCampaignsQuery = (campaigns: Campaign[]): string => {
    let insertQueries: string = '';
    if (campaigns && campaigns.length > 0) {
        insertQueries = `INSERT INTO ${TABLE_CAMPAIGNS} (ID, Env, Vin, CC, Pat, Serv, ServDate, Manten) VALUES `;
        campaigns.forEach(campaign => {
            insertQueries += "('"
                + parseInt(campaign.id!) + "','"
                + escapeValue(campaign.env) + "','"
                + escapeValue(campaign.vin) + "','"
                + escapeValue(campaign.cc) + "','"
                + escapeValue(campaign.pat?.toUpperCase()) + "','"
                + escapeValue(campaign.serv) + "','"
                + escapeValue(campaign.fecha_serv) + "','"
                + escapeValue(campaign.manten) + "'),";
        });
        if (insertQueries.endsWith(','))
            insertQueries = insertQueries.slice(0, -1);
        insertQueries += ";";
    }
    return insertQueries;
}

const getInsertCampaignSearchQuery = (campaignSearch: CampaignSearch): string => {
    console.log("getInsertCampaignSearchQuery:", campaignSearch)
    let insertQuery = `INSERT INTO ${TABLE_CAMPAIGN_SEARCHES} (EventID, EventName, SearchText, SearchDate, CampaignID, Env, Vin, CC, Pat, Serv, ServDate, Manten, IsSynchronized, SyncDate) VALUES `;
    insertQuery += "('"
        + campaignSearch.eventId + "','"
        + escapeValue(campaignSearch.eventName) + "','"
        + escapeValue(campaignSearch.searchText) + "','"
        + campaignSearch.searchDate + "','"
        + escapeValue(campaignSearch?.campaign?.id?.toString()) + "','"
        + escapeValue(campaignSearch?.campaign?.env) + "','"
        + escapeValue(campaignSearch?.campaign?.vin) + "','"
        + escapeValue(campaignSearch?.campaign?.cc) + "','"
        + escapeValue(campaignSearch?.campaign?.pat) + "','"
        + escapeValue(campaignSearch?.campaign?.serv) + "','"
        + escapeValue(campaignSearch?.campaign?.fecha_serv) + "','"
        + escapeValue(campaignSearch?.campaign?.manten) + "','"
        + (campaignSearch.isSynchronized == true ? 1 : 0) + "','"
        + campaignSearch.syncDate
        + "');";

    return insertQuery;
}

//#endregion

//#region Forms

const getInsertQuoteFormQuery = (form: QuoteForm): string => {
    let insertQuery: string = "";
    insertQuery = `INSERT INTO ${TABLE_QUOTE_FORM} (EventID, EventName, EventCode, DealershipID, DealershipName, DealershipCode, ProvinceId, ProvinceName, LocalityId, LocalityName, VehicleID, VehicleName, VehicleVersionId, VehicleVersionName, VehicleModelYear, VehicleTMA, VehicleSEQ, Firstname, Lastname, DocumentType, DocumentNumber, Email, PointOfSale, PhoneArea, Phone, ContactPreference, ReceiveInformation, AcceptConditions, CreatedOn, ModifiedOn, IsSynchronized, SyncDate, SyncFailed) VALUES `;
    // Id no es necesario, es AUTO-INCREMENTAL
    insertQuery += "('"
        + form.eventId + "','"
        + escapeValue(form.eventName) + "','"
        + escapeValue(form.eventCode) + "','"
        + form.dealershipId + "','"
        + encode(form.dealershipName) + "','"
        + encode(form.dealershipCode) + "','"
        + form.provinceId + "','"
        + escapeValue(form.provinceName) + "','"
        + form.localityId + "','"
        + escapeValue(form.localityName) + "','"
        + form.vehicleId + "','"
        + escapeValue(form.vehicleName) + "','"
        + form.vehicleVersionId + "','"
        + escapeValue(form.vehicleVersionName) + "','"
        + escapeValue(form.vehicleModelYear) + "','"
        + escapeValue(form.vehicleTMA) + "','"
        + escapeValue(form.vehicleSEQ) + "','"
        + encode(form.firstname) + "','"
        + encode(form.lastname) + "','"
        + encode(form.documentType?.toString()) + "','"
        + encode(form.documentNumber) + "','"
        + encode(form.email) + "','"
        + encode(form.pointOfSale) + "','"
        + encode(form.phoneArea) + "','"
        + encode(form.phone) + "','"
        + encode(form.contactPreference) + "','"
        + (form.receiveInformation == true ? 1 : 0) + "','"
        + (form.acceptConditions == true ? 1 : 0) + "','"
        + form.createdOn + "','"
        + form.modifiedOn + "','"
        + (form.isSynchronized == true ? 1 : 0) + "','"
        + form.syncDate + "','"
        + 0 + "');";
    return insertQuery;
}

const getInsertNewsletterFormQuery = (form: NewsletterForm): string => {
    let insertQuery: string = "";
    insertQuery = `INSERT INTO ${TABLE_NEWSLETTER_FORM} (EventID, EventName, EventCode, VehicleID, VehicleName, Firstname, Lastname, DocumentType, DocumentNumber, Email, PhoneArea, Phone, ContactPreference, ReceiveInformation, AcceptConditions, CreatedOn, ModifiedOn, IsSynchronized, SyncDate, SyncFailed, IsSynchronizedWithSaleforce) VALUES `;
    // Id no es necesario, es AUTO-INCREMENTAL
    insertQuery += "('"
        + form.eventId + "','"
        + escapeValue(form.eventName) + "','"
        + escapeValue(form.eventCode) + "','"
        + form.vehicleId + "','"
        + escapeValue(form.vehicleName) + "','"
        + encode(form.firstname) + "','"
        + encode(form.lastname) + "','"
        + encode(form.documentType) + "','"
        + encode(form.documentNumber) + "','"
        + encode(form.email) + "','"
        + encode(form.phoneArea) + "','"
        + encode(form.phone) + "','"
        + encode(form.contactPreference) + "','"
        + (form.receiveInformation == true ? 1 : 0) + "','"
        + (form.acceptConditions == true ? 1 : 0) + "','"
        + form.createdOn + "','"
        + form.modifiedOn + "','"
        + (form.isSynchronized == true ? 1 : 0) + "','"
        + form.syncDate + "','"
        + form.isSynchronizedWithSaleforce + "','"
        + 0 + "');";

    return insertQuery;
}

const getInsertTestDriveFormQuery = (form: TestDriveForm): string => {
    let insertQuery: string = "";
    insertQuery = `INSERT INTO ${TABLE_TEST_DRIVE_FORM} (EventID, EventName, EventCode, VehicleID, VehicleName, Date, TimeZone, Firstname, Lastname, DocumentType, DocumentNumber, Email, DrivingLicenseExpiration, PhoneArea, Phone, ContactPreference, HasVehicle, VehicleInfo, Companion1Firstname, Companion1Lastname, Companion1Age, Companion2Fullname, Companion2Age, Companion3Fullname, Companion3Age, ReceiveInformation, AcceptConditions, Signature, ResizedSignature, CreatedOn, ModifiedOn, IsSynchronized, IsSynchronizedWithSaleforce, SyncDate, loadedByQR, SyncFailed) VALUES `;
    // Id no es necesario, es AUTO-INCREMENTAL
    insertQuery += "('"
        + form.eventId + "','"
        + escapeValue(form.eventName) + "','"
        + escapeValue(form.eventCode) + "','"
        + form.vehicleOfInterestId + "','"
        + escapeValue(form.vehicleName) + "','"
        + form.date + "','"
        + form.selectedTime + "','"
        + encode(form.firstname) + "','"
        + encode(form.lastname) + "','"
        + encode(form.documentType) + "','"
        + encode(form.documentNumber) + "','"
        + encode(form.email) + "','"
        + form.drivingLicenseExpiration + "','"
        + encode(form.phoneArea) + "','"
        + encode(form.phone) + "','"
        + encode(form.contactPreference) + "','"
        + getDriverAsNumber(form.driverBool) + "','"
        + encode(form.vehicleInfo) + "','"
        + encode(form.companion1Firstname) + "','"
        + encode(form.companion1Lastname) + "','"
        + encode(form.companion1Age) + "','"
        + encode(form.companion2Fullname) + "','"
        + encode(form.companion2Age) + "','"
        + encode(form.companion3Fullname) + "','"
        + encode(form.companion3Age) + "','"
        + (form.receiveInformation == true ? 1 : 0) + "','"
        + (form.acceptConditions == true ? 1 : 0) + "','"
        + escapeValue(form.signature) + "','"
        + escapeValue(form.resizedSignature) + "','"
        + form.createdOn + "','"
        + form.modifiedOn + "','"
        + (form.isSynchronized == true ? 1 : 0) + "','"
        + form.isSynchronizedWithSaleforce + "','"
        + form.syncDate + "','"
        + (form.loadedByQR == true ? 1 : 0) + "','"
        + 0 + "');";

    return insertQuery;
}

//#endregion

//#region Configuration

const getInsertConfigurationQueries = (configuration?: ConfigurationDB): string[] => {
    let insertQueries: string[] = [
        getSafeQuery(`
            INSERT INTO ${TABLE_CONFIGURATIONS} (TestDriveDemarcationOwnerUrl, TestDriveDemarcationFordUrl, TestDriveTermsUrl, NewsletterUrl, QuoteUrl, ContactData, DemarcationOwnerInCaravan) VALUES (
                '${escapeValue(configuration?.testDriveDemarcationOwnerUrl)}',
                '${escapeValue(configuration?.testDriveDemarcationFordUrl)}',
                '${escapeValue(configuration?.testDriveTermsUrl)}',
                '${escapeValue(configuration?.newsletterUrl)}',
                '${escapeValue(configuration?.quoteUrl)}',
                '${escapeValue(configuration?.contactData)}',
                '${escapeValue(configuration?.testDriveDemarcationOwnerInCaravanUrl)}'
            );
        `)
    ];
    return insertQueries;
}

//#endregion

//#region Errors

const getInsertErrorQuery = (error?: ErrorDB): string => {
    return getSafeQuery(`
            INSERT INTO ${TABLE_ERRORS} (Description, Date, Type, DeviceId, DeviceName, OperativeSystem, OperativeSystemVersion, Brand, Model, AppVersion, ConnectionType) VALUES (
                '${escapeValue(error?.description)}',
                '${escapeValue(error?.date?.toISOString())}',
                '${escapeValue(error?.type)}',
                '${escapeValue(error?.deviceUniqueId)}',
                '${escapeValue(error?.deviceName)}',
                '${escapeValue(error?.operativeSystem)}',
                '${escapeValue(error?.operativeSystemVersion)}',
                '${escapeValue(error?.brand)}',
                '${escapeValue(error?.model)}',
                '${escapeValue(error?.appVersion)}',
                '${escapeValue(error?.connectionType)}'
            );
        `);
}

//#endregion

//#endregion



/* ************************** */
/* ***** Search Queries ***** */
/* ************************** */

//#region Search Queries

//#region Search Provinces And Localities

export const getProvinces = async (db: SQLiteDatabase): Promise<Province[]> => {
    const provinces: Province[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_PROVINCES}`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const provinceId = tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT);
            const localities = await getLocalities(provinceId, db);
            provinces.push({
                id: provinceId,
                name: tryParseValue(resultSet.rows.item(index2).Name, DataTypeEnum.STRING),
                localities: localities
            });
        }
    };
    return provinces;
}

export const getLocalities = async (provinceId: number, db: SQLiteDatabase): Promise<Locality[]> => {
    const localities: Locality[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_LOCALITIES} WHERE ProvinceID = ${provinceId}`);
    results.forEach((resultSet) => {
        for (let index = 0; index < resultSet.rows.length; index++) {
            localities.push({
                id: tryParseValue(resultSet.rows.item(index).ID, DataTypeEnum.INT),
                name: tryParseValue(resultSet.rows.item(index).Name, DataTypeEnum.STRING)
            });
        }
    });
    return localities;
}

//#endregion

//#region Search Queries Events, SubEvent, Guest

export const getUnsynchronizedEventIds = async (db: SQLiteDatabase): Promise<number[]> => {
    const eventIds: number[] = [];
    const results = await db.executeSql(`
        SELECT EventID FROM ${TABLE_GUESTS} WHERE IsSynchronized = 0 
        UNION 
        SELECT EventID FROM ${TABLE_QUOTE_FORM} WHERE IsSynchronized = 0 
        UNION 
        SELECT EventID FROM ${TABLE_NEWSLETTER_FORM} WHERE IsSynchronized = 0 
        UNION 
        SELECT EventID FROM ${TABLE_NEWSLETTER_FORM} WHERE IsSynchronizedWithSaleforce = 0 
        UNION 
        SELECT EventID FROM ${TABLE_TEST_DRIVE_FORM} WHERE IsSynchronized = 0 
        UNION 
        SELECT EventID FROM ${TABLE_TEST_DRIVE_FORM} WHERE IsSynchronizedWithSaleforce = 0 
        UNION 
        SELECT EventID FROM ${TABLE_CAMPAIGN_SEARCHES} WHERE IsSynchronized = 0`
    );
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const eventId = tryParseValue(resultSet.rows.item(index2).EventID, DataTypeEnum.INT);
            const index = eventIds.indexOf(eventId);
            if (index == -1)
                eventIds.push(eventId);
        }
    }
    return eventIds?.filter(x => x != null && x != undefined && x >= 0) ?? [];
}

export const getEvent = async (db: SQLiteDatabase, eventId: number): Promise<Event | undefined> => {
    let event: Event | undefined = undefined;
    const results = await db.executeSql(`SELECT * FROM ${TABLE_EVENTS} WHERE ID = ${eventId}`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const eventId = tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT);
            const subEvents = await getSubEvents([eventId], true, db);
            event = {
                id: eventId,
                name: tryParseValue(resultSet.rows.item(index2).Name, DataTypeEnum.STRING),
                code: tryParseValue(resultSet.rows.item(index2).Code, DataTypeEnum.STRING),
                dateFrom: tryParseValue(resultSet.rows.item(index2).DateFrom, DataTypeEnum.DATE),
                dateTo: tryParseValue(resultSet.rows.item(index2).DateTo, DataTypeEnum.DATE),
                image: tryParseValue(resultSet.rows.item(index2).Image, DataTypeEnum.STRING),
                testDriveDemarcationOwnerEnabled: tryParseValue(resultSet.rows.item(index2).TestDriveDemarcationOwnerEnabled, DataTypeEnum.BOOLEAN),
                testDriveDemarcationOwnerInCaravanEnabled: tryParseValue(resultSet.rows.item(index2).TestDriveDemarcationOwnerInCaravanEnabled, DataTypeEnum.BOOLEAN),
                testDriveDemarcationFordEnabled: tryParseValue(resultSet.rows.item(index2).TestDriveDemarcationFordEnabled, DataTypeEnum.BOOLEAN),
                subEvents: subEvents
            }
        }
    }
    return event;
}

export const getEvents = async (db: SQLiteDatabase, includeGuests: boolean): Promise<Event[]> => {
    const events: Event[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_EVENTS}`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const eventId = tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT);
            const subEvents = await getSubEvents([eventId], includeGuests, db);
            events.push({
                id: eventId,
                name: tryParseValue(resultSet.rows.item(index2).Name, DataTypeEnum.STRING),
                code: tryParseValue(resultSet.rows.item(index2).Code, DataTypeEnum.STRING),
                dateFrom: tryParseValue(resultSet.rows.item(index2).DateFrom, DataTypeEnum.DATE),
                dateTo: tryParseValue(resultSet.rows.item(index2).DateTo, DataTypeEnum.DATE),
                image: tryParseValue(resultSet.rows.item(index2).Image, DataTypeEnum.STRING),
                testDriveDemarcationOwnerEnabled: tryParseValue(resultSet.rows.item(index2).TestDriveDemarcationOwnerEnabled, DataTypeEnum.BOOLEAN),
                testDriveDemarcationOwnerInCaravanEnabled: tryParseValue(resultSet.rows.item(index2).TestDriveDemarcationOwnerInCaravanEnabled, DataTypeEnum.BOOLEAN),
                testDriveDemarcationFordEnabled: tryParseValue(resultSet.rows.item(index2).TestDriveDemarcationFordEnabled, DataTypeEnum.BOOLEAN),
                subEvents: subEvents
            });
        }
    }
    return events;
}

export const getSubEvents = async (eventIds: number[], includeGuests: boolean, db: SQLiteDatabase): Promise<SubEvent[]> => {
    const subEvents: SubEvent[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_SUB_EVENTS} WHERE EventID IN (${eventIds.join(', ')})`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const subEventId = tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT);
            let guests: Guest[] = [];
            if (includeGuests)
                guests = await getGuests(db, subEventId);
            subEvents.push({
                id: subEventId,
                name: tryParseValue(resultSet.rows.item(index2).Name, DataTypeEnum.STRING),
                dateFrom: tryParseValue(resultSet.rows.item(index2).DateFrom, DataTypeEnum.DATE),
                dateTo: tryParseValue(resultSet.rows.item(index2).DateTo, DataTypeEnum.DATE),
                image: tryParseValue(resultSet.rows.item(index2).Image, DataTypeEnum.STRING),
                guestNumber: tryParseValue(resultSet.rows.item(index2).GuestNumber, DataTypeEnum.INT),
                guests: guests
            });
        }
    }
    return subEvents;
}

// export const getSubEvent = async (subEventId: number, db: SQLiteDatabase, guestFilter: string = ''): Promise<SubEvent | undefined> => {
//     let subEvent: SubEvent | undefined = undefined;
//     const results = await db.executeSql(`SELECT * FROM ${TABLE_SUB_EVENTS} WHERE ID = ${subEventId}`);
//     for (let index1 = 0; index1 < results.length; index1++) {
//         const resultSet = results[index1];
//         for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
//             const subEventId = tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT);
//             const guests = await getGuests(db, subEventId, guestFilter);
//             subEvent = {
//                 id: subEventId,
//                 name: tryParseValue(resultSet.rows.item(index2).Name, DataTypeEnum.STRING),
//                 dateFrom: tryParseValue(resultSet.rows.item(index2).DateFrom, DataTypeEnum.DATE),
//                 dateTo: tryParseValue(resultSet.rows.item(index2).DateTo, DataTypeEnum.DATE),
//                 image: tryParseValue(resultSet.rows.item(index2).Image, DataTypeEnum.STRING),
//                 guestNumber: tryParseValue(resultSet.rows.item(index2).GuestNumber, DataTypeEnum.INT),
//                 guests: guests
//             };
//         }
//     }
//     return subEvent;
// }

export const getGuestsBySubEvent = async (db: SQLiteDatabase, subEventId: number) => {
    const guests: Guest[] = [];
    const query = getSafeQuery(`SELECT * FROM ${TABLE_GUESTS} WHERE SubEventID = ${subEventId} AND Deleted = 0`);
    console.log('getGuestPaginated - query:', query);
    const results = await db.executeSql(query);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            guests.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                serverId: tryParseValue(resultSet.rows.item(index2).ServerId, DataTypeEnum.INT),
                createdOn: tryParseValue(resultSet.rows.item(index2).CreatedOn, DataTypeEnum.DATE),
                modifiedOn: tryParseValue(resultSet.rows.item(index2).ModifiedOn, DataTypeEnum.DATE),
                firstname: decode(tryParseValue(resultSet.rows.item(index2).Firstname, DataTypeEnum.STRING)),
                lastname: decode(tryParseValue(resultSet.rows.item(index2).Lastname, DataTypeEnum.STRING)),
                documentNumber: decode(tryParseValue(resultSet.rows.item(index2).DocumentNumber, DataTypeEnum.STRING)),
                phoneNumber: decode(tryParseValue(resultSet.rows.item(index2).PhoneNumber, DataTypeEnum.STRING)),
                email: decode(tryParseValue(resultSet.rows.item(index2).Email, DataTypeEnum.STRING)),
                carLicencePlate: decode(tryParseValue(resultSet.rows.item(index2).CarLicencePlate, DataTypeEnum.STRING)),
                type: decode(tryParseValue(resultSet.rows.item(index2).Type, DataTypeEnum.STRING)) as GuestTypeEnum,
                companionReference: decode(tryParseValue(resultSet.rows.item(index2).CompanionReference, DataTypeEnum.STRING)),
                observations1: decode(tryParseValue(resultSet.rows.item(index2).Observations1, DataTypeEnum.STRING)),
                observations2: decode(tryParseValue(resultSet.rows.item(index2).Observations2, DataTypeEnum.STRING)),
                observations3: decode(tryParseValue(resultSet.rows.item(index2).Observations3, DataTypeEnum.STRING)),
                zone: decode(tryParseValue(resultSet.rows.item(index2).Zone, DataTypeEnum.STRING)),
                status: decode(tryParseValue(resultSet.rows.item(index2).Status, DataTypeEnum.STRING)) as GuestStatusEnum,
                isSynchronized: tryParseValue(resultSet.rows.item(index2).IsSynchronized, DataTypeEnum.INT) == 1,
                syncDate: tryParseValue(resultSet.rows.item(index2).SyncDate, DataTypeEnum.DATE),
                changedByQrscanner: tryParseValue(resultSet.rows.item(index2).ChangedByQRScanner, DataTypeEnum.INT) == 1,
                deleted: tryParseValue(resultSet.rows.item(index2).Deleted, DataTypeEnum.INT) == 1
            });
        }
    }
    return guests;
}

export const getGuests = async (db: SQLiteDatabase, subEventId: number): Promise<Guest[]> => {
    const guests: Guest[] = [];
    const results = await db.executeSql(getSafeQuery(`SELECT * FROM ${TABLE_GUESTS} WHERE SubEventID = ${subEventId}`));
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            guests.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                serverId: tryParseValue(resultSet.rows.item(index2).ServerId, DataTypeEnum.INT),
                createdOn: tryParseValue(resultSet.rows.item(index2).CreatedOn, DataTypeEnum.DATE),
                modifiedOn: tryParseValue(resultSet.rows.item(index2).ModifiedOn, DataTypeEnum.DATE),
                firstname: decode(tryParseValue(resultSet.rows.item(index2).Firstname, DataTypeEnum.STRING)),
                lastname: decode(tryParseValue(resultSet.rows.item(index2).Lastname, DataTypeEnum.STRING)),
                documentNumber: decode(tryParseValue(resultSet.rows.item(index2).DocumentNumber, DataTypeEnum.STRING)),
                phoneNumber: decode(tryParseValue(resultSet.rows.item(index2).PhoneNumber, DataTypeEnum.STRING)),
                email: decode(tryParseValue(resultSet.rows.item(index2).Email, DataTypeEnum.STRING)),
                carLicencePlate: decode(tryParseValue(resultSet.rows.item(index2).CarLicencePlate, DataTypeEnum.STRING)),
                type: decode(tryParseValue(resultSet.rows.item(index2).Type, DataTypeEnum.STRING)) as GuestTypeEnum,
                companionReference: decode(tryParseValue(resultSet.rows.item(index2).CompanionReference, DataTypeEnum.STRING)),
                observations1: decode(tryParseValue(resultSet.rows.item(index2).Observations1, DataTypeEnum.STRING)),
                observations2: decode(tryParseValue(resultSet.rows.item(index2).Observations2, DataTypeEnum.STRING)),
                observations3: decode(tryParseValue(resultSet.rows.item(index2).Observations3, DataTypeEnum.STRING)),
                zone: decode(tryParseValue(resultSet.rows.item(index2).Zone, DataTypeEnum.STRING)),
                status: decode(tryParseValue(resultSet.rows.item(index2).Status, DataTypeEnum.STRING)) as GuestStatusEnum,
                isSynchronized: tryParseValue(resultSet.rows.item(index2).IsSynchronized, DataTypeEnum.INT) == 1,
                syncDate: tryParseValue(resultSet.rows.item(index2).SyncDate, DataTypeEnum.DATE),
                changedByQrscanner: tryParseValue(resultSet.rows.item(index2).ChangedByQRScanner, DataTypeEnum.INT) == 1,
                deleted: tryParseValue(resultSet.rows.item(index2).Deleted, DataTypeEnum.INT) == 1
            });
        }
    }
    return guests;
}

export const getUnsynchronizedGuests = async (db: SQLiteDatabase, subEventId?: number): Promise<ExtendedGuest[]> => {
    const guests: ExtendedGuest[] = [];
    let query = `SELECT * FROM ${TABLE_GUESTS} WHERE IsSynchronized = 0`;
    if (subEventId != undefined) {
        query += ` AND SubEventID = ${subEventId}`;
    }
    const results = await db.executeSql(query);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            guests.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                serverId: tryParseValue(resultSet.rows.item(index2).ServerId, DataTypeEnum.INT),
                eventId: tryParseValue(resultSet.rows.item(index2).EventID, DataTypeEnum.INT),
                subEventId: tryParseValue(resultSet.rows.item(index2).SubEventID, DataTypeEnum.INT),
                createdOn: tryParseValue(resultSet.rows.item(index2).CreatedOn, DataTypeEnum.DATE),
                modifiedOn: tryParseValue(resultSet.rows.item(index2).ModifiedOn, DataTypeEnum.DATE),
                firstname: decode(tryParseValue(resultSet.rows.item(index2).Firstname, DataTypeEnum.STRING)),
                lastname: decode(tryParseValue(resultSet.rows.item(index2).Lastname, DataTypeEnum.STRING)),
                documentNumber: decode(tryParseValue(resultSet.rows.item(index2).DocumentNumber, DataTypeEnum.STRING)),
                phoneNumber: decode(tryParseValue(resultSet.rows.item(index2).PhoneNumber, DataTypeEnum.STRING)),
                email: decode(tryParseValue(resultSet.rows.item(index2).Email, DataTypeEnum.STRING)),
                carLicencePlate: decode(tryParseValue(resultSet.rows.item(index2).CarLicencePlate, DataTypeEnum.STRING)),
                type: decode(tryParseValue(resultSet.rows.item(index2).Type, DataTypeEnum.STRING)) as GuestTypeEnum,
                companionReference: decode(tryParseValue(resultSet.rows.item(index2).CompanionReference, DataTypeEnum.STRING)),
                observations1: decode(tryParseValue(resultSet.rows.item(index2).Observations1, DataTypeEnum.STRING)),
                observations2: decode(tryParseValue(resultSet.rows.item(index2).Observations2, DataTypeEnum.STRING)),
                observations3: decode(tryParseValue(resultSet.rows.item(index2).Observations3, DataTypeEnum.STRING)),
                zone: decode(tryParseValue(resultSet.rows.item(index2).Zone, DataTypeEnum.STRING)),
                status: decode(tryParseValue(resultSet.rows.item(index2).Status, DataTypeEnum.STRING)) as GuestStatusEnum,
                isSynchronized: tryParseValue(resultSet.rows.item(index2).IsSynchronized, DataTypeEnum.INT) == 1,
                syncDate: tryParseValue(resultSet.rows.item(index2).SyncDate, DataTypeEnum.DATE),
                changedByQrscanner: tryParseValue(resultSet.rows.item(index2).ChangedByQRScanner, DataTypeEnum.INT) == 1,
                deleted: tryParseValue(resultSet.rows.item(index2).Deleted, DataTypeEnum.INT) == 1
            });
        }
    }
    return guests;
}

export const getGuestById = async (db: SQLiteDatabase, guestId: number): Promise<Guest | undefined> => {
    let guest: Guest | undefined = undefined;

    const results = await db.executeSql(getSafeQuery(`SELECT * FROM ${TABLE_GUESTS} WHERE ServerID = ${guestId} AND Deleted = 0`));
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            guest = {
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                serverId: tryParseValue(resultSet.rows.item(index2).ServerId, DataTypeEnum.INT),
                createdOn: tryParseValue(resultSet.rows.item(index2).CreatedOn, DataTypeEnum.DATE),
                modifiedOn: tryParseValue(resultSet.rows.item(index2).ModifiedOn, DataTypeEnum.DATE),
                firstname: decode(tryParseValue(resultSet.rows.item(index2).Firstname, DataTypeEnum.STRING)),
                lastname: decode(tryParseValue(resultSet.rows.item(index2).Lastname, DataTypeEnum.STRING)),
                documentNumber: decode(tryParseValue(resultSet.rows.item(index2).DocumentNumber, DataTypeEnum.STRING)),
                phoneNumber: decode(tryParseValue(resultSet.rows.item(index2).PhoneNumber, DataTypeEnum.STRING)),
                email: decode(tryParseValue(resultSet.rows.item(index2).Email, DataTypeEnum.STRING)),
                carLicencePlate: decode(tryParseValue(resultSet.rows.item(index2).CarLicencePlate, DataTypeEnum.STRING)),
                type: decode(tryParseValue(resultSet.rows.item(index2).Type, DataTypeEnum.STRING)) as GuestTypeEnum,
                companionReference: decode(tryParseValue(resultSet.rows.item(index2).CompanionReference, DataTypeEnum.STRING)),
                observations1: decode(tryParseValue(resultSet.rows.item(index2).Observations1, DataTypeEnum.STRING)),
                observations2: decode(tryParseValue(resultSet.rows.item(index2).Observations2, DataTypeEnum.STRING)),
                observations3: decode(tryParseValue(resultSet.rows.item(index2).Observations3, DataTypeEnum.STRING)),
                zone: decode(tryParseValue(resultSet.rows.item(index2).Zone, DataTypeEnum.STRING)),
                status: decode(tryParseValue(resultSet.rows.item(index2).Status, DataTypeEnum.STRING)) as GuestStatusEnum,
                isSynchronized: tryParseValue(resultSet.rows.item(index2).IsSynchronized, DataTypeEnum.INT) == 1,
                syncDate: tryParseValue(resultSet.rows.item(index2).SyncDate, DataTypeEnum.DATE),
                changedByQrscanner: tryParseValue(resultSet.rows.item(index2).ChangedByQRScanner, DataTypeEnum.INT) == 1,
                deleted: tryParseValue(resultSet.rows.item(index2).Deleted, DataTypeEnum.INT) == 1
            };
        }
    }
    return guest;
}

//#endregion

//#region Search Queries Vehicles

export const getVehicles = async (db: SQLiteDatabase, withVersions: boolean = true): Promise<Vehicle[]> => {
    const vehicles: Vehicle[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLES}`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const vehicleId = tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT);
            let versions: VehicleVersion[] = [];
            if (withVersions)
                versions = await getVehicleVersions(vehicleId, db);
            //const colors = await getVehicleColors(vehicleId, db);
            //const images = await getVehicleImages(vehicleId, db);
            //const featuresGroups = await getVehicleFeatureGroups(vehicleId, db);
            //const accessories = await getVehicleAccessories(vehicleId, db);
            vehicles.push({
                id: vehicleId,
                name: tryParseValue(resultSet.rows.item(index2).Name, DataTypeEnum.STRING),
                type: tryParseValue(resultSet.rows.item(index2).Type, DataTypeEnum.STRING),
                image: tryParseValue(resultSet.rows.item(index2).Image, DataTypeEnum.STRING),
                versions: versions,
                //colors: colors,
                //images: images,
                //featuresGroups: featuresGroups,
                //accessories: accessories
            });
        }
    };
    return vehicles;
}

export const getVehicleById = async (db: SQLiteDatabase, vehicleId?: number): Promise<ExtendedVehicle | null> => {
    if (vehicleId == undefined || vehicleId == null)
        return null;

    let vehicle: ExtendedVehicle | null = null;
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLES} WHERE ID = ${vehicleId}`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        if (resultSet.rows.length == 1) {
            const vehicleId = tryParseValue(resultSet.rows.item(0).ID, DataTypeEnum.INT);
            const versions = await getVehicleVersions(vehicleId, db);
            const colors = await getVehicleColors(vehicleId, db);
            const images = await getVehicleImages(vehicleId, db);
            const featuresGroups = await getVehicleFeatureGroups(vehicleId, db);
            const accessories = await getVehicleAccessories(vehicleId, db);
            vehicle = {
                id: vehicleId,
                name: tryParseValue(resultSet.rows.item(0).Name, DataTypeEnum.STRING),
                type: tryParseValue(resultSet.rows.item(0).Type, DataTypeEnum.STRING),
                image: tryParseValue(resultSet.rows.item(0).Image, DataTypeEnum.STRING),
                versions: versions,
                preLaunch: (versions && versions.filter(version => version?.preLaunch == true).length > 0) ? true : false,
                colors: colors,
                images: images,
                featuresGroups: featuresGroups,
                accessories: accessories
            }
        }
    };
    return vehicle;
}

export const getVehicleNameById = async (db: SQLiteDatabase, vehicleId?: number): Promise<string | undefined> => {
    if (vehicleId == undefined || vehicleId == null)
        return undefined;

    let vehicleName: string | undefined = undefined;
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLES} WHERE ID = ${vehicleId}`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        if (resultSet.rows.length == 1) {
            vehicleName = tryParseValue(resultSet.rows.item(0).Name, DataTypeEnum.STRING);
        }
    };
    return vehicleName;
}

export const getVehicleVersions = async (vehicleId: number, db: SQLiteDatabase): Promise<VehicleVersion[]> => {
    const versions: VehicleVersion[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLE_VERSIONS} WHERE VehicleID = ${vehicleId}`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const versionId = tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT);
            const features = await getVehicleFeaturesVersions(versionId, db);
            if (vehicleId == 1) {
                console.log("Versión Prelaunch", resultSet.rows.item(index2).PreLaunch);
            }
            versions.push({
                id: versionId,
                name: tryParseValue(resultSet.rows.item(index2).Name, DataTypeEnum.STRING),
                price: tryParseValue(resultSet.rows.item(index2).Price, DataTypeEnum.INT),
                modelYear: tryParseValue(resultSet.rows.item(index2).ModelYear, DataTypeEnum.STRING),
                tma: tryParseValue(resultSet.rows.item(index2).TMA, DataTypeEnum.STRING),
                seq: tryParseValue(resultSet.rows.item(index2).SEQ, DataTypeEnum.STRING),
                preLaunch: tryParseValue(resultSet.rows.item(index2).PreLaunch, DataTypeEnum.BOOLEAN),
                features: features
            });
        }
    }
    return versions;
}

export const getVehicleColors = async (vehicleId: number, db: SQLiteDatabase): Promise<VehicleColor[]> => {
    const colors: VehicleColor[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLE_COLORS} WHERE VehicleID = ${vehicleId}`);
    results.forEach((resultSet) => {
        for (let index = 0; index < resultSet.rows.length; index++) {
            colors.push({
                id: tryParseValue(resultSet.rows.item(index).ID, DataTypeEnum.INT),
                colorName: tryParseValue(resultSet.rows.item(index).ColorName, DataTypeEnum.STRING),
                colorImageUrl: tryParseValue(resultSet.rows.item(index).ColorImageUrl, DataTypeEnum.STRING),
                vehicleImageUrl: tryParseValue(resultSet.rows.item(index).VehicleImageUrl, DataTypeEnum.STRING)
            });
        }
    });
    return colors;
}

export const getVehicleImages = async (vehicleId: number, db: SQLiteDatabase): Promise<VehicleImage[]> => {
    const images: VehicleImage[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLE_IMAGES} WHERE VehicleID = ${vehicleId}`);
    results.forEach((resultSet) => {
        for (let index = 0; index < resultSet.rows.length; index++) {
            images.push({
                id: tryParseValue(resultSet.rows.item(index).ID, DataTypeEnum.INT),
                vehicleImageUrl: tryParseValue(resultSet.rows.item(index).VehicleImageUrl, DataTypeEnum.STRING)
            });
        }
    });
    return images;
}

export const getVehicleFeatureGroups = async (vehicleId: number, db: SQLiteDatabase): Promise<VehicleFeatureGroup[]> => {
    const featureGroups: VehicleFeatureGroup[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLE_FEATURES_GROUPS} WHERE VehicleID = ${vehicleId} ORDER BY OrderIndex ASC`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const featureGroupId = tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT)
            const features = await getVehicleFeatures(featureGroupId, db);
            featureGroups.push({
                id: featureGroupId,
                name: tryParseValue(resultSet.rows.item(index2).Name, DataTypeEnum.STRING),
                order: tryParseValue(resultSet.rows.item(index2).OrderIndex, DataTypeEnum.INT),
                features: features
            });
        }
    }
    return featureGroups;
}

export const getVehicleFeatures = async (featureGroupID: number, db: SQLiteDatabase): Promise<VehicleFeature[]> => {
    const features: VehicleFeature[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLE_FEATURES} WHERE FeatureGroupID = ${featureGroupID} ORDER BY OrderIndex ASC`);
    results.forEach((resultSet) => {
        for (let index = 0; index < resultSet.rows.length; index++) {
            features.push({
                id: tryParseValue(resultSet.rows.item(index).ID, DataTypeEnum.INT),
                name: tryParseValue(resultSet.rows.item(index).Name, DataTypeEnum.STRING),
                order: tryParseValue(resultSet.rows.item(index).OrderIndex, DataTypeEnum.INT)
            });
        }
    });
    return features;
}

export const getVehicleFeaturesVersions = async (versionID: number, db: SQLiteDatabase): Promise<VehicleFeatureVersion[]> => {
    const featuresVersions: VehicleFeatureVersion[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLE_FEATURES_VERSIONS} WHERE VersionID = ${versionID}`);
    results.forEach((resultSet) => {
        for (let index = 0; index < resultSet.rows.length; index++) {
            featuresVersions.push({
                featureId: tryParseValue(resultSet.rows.item(index).FeatureID, DataTypeEnum.INT),
                value: tryParseValue(resultSet.rows.item(index).Value, DataTypeEnum.STRING)
            });
        }
    });
    return featuresVersions;
}

export const getVehicleAccessories = async (vehicleId: number, db: SQLiteDatabase): Promise<VehicleAccessory[]> => {
    const accessories: VehicleAccessory[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_VEHICLE_ACCESSORIES} WHERE VehicleID = ${vehicleId}`);
    results.forEach((resultSet) => {
        for (let index = 0; index < resultSet.rows.length; index++) {
            accessories.push({
                id: tryParseValue(resultSet.rows.item(index).ID, DataTypeEnum.INT),
                name: tryParseValue(resultSet.rows.item(index).Name, DataTypeEnum.STRING),
                image: tryParseValue(resultSet.rows.item(index).Image, DataTypeEnum.STRING),
                description: tryParseValue(resultSet.rows.item(index).Description, DataTypeEnum.STRING),
                observation: tryParseValue(resultSet.rows.item(index).Observation, DataTypeEnum.STRING),
                partNumber: tryParseValue(resultSet.rows.item(index).PartNumber, DataTypeEnum.STRING),
                modelFor: tryParseValue(resultSet.rows.item(index).ModelFor, DataTypeEnum.STRING)
            });
        }
    });
    return accessories;
}

//#endregion

//#region Search Queries Dealerships

export const getDealerships = async (db: SQLiteDatabase, provinceId?: number, localityId?: number): Promise<Dealership[]> => {
    const dealerships: Dealership[] = [];
    let query = `SELECT * FROM ${TABLE_DEALERSHIPS}`;
    if (provinceId != undefined)
        query += ` WHERE ProvinceID = ${provinceId}`;
    if (localityId != undefined)
        query += ` AND LocalityID = ${localityId}`;

    const results = await db.executeSql(query);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            dealerships.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                provinceId: tryParseValue(resultSet.rows.item(index2).ProvinceID, DataTypeEnum.INT),
                localityId: tryParseValue(resultSet.rows.item(index2).LocalityID, DataTypeEnum.INT),
                provinceName: decode(tryParseValue(resultSet.rows.item(index2).ProvinceName, DataTypeEnum.STRING)),
                localityName: decode(tryParseValue(resultSet.rows.item(index2).LocalityName, DataTypeEnum.STRING)),
                name: decode(tryParseValue(resultSet.rows.item(index2).Name, DataTypeEnum.STRING)),
                code: decode(tryParseValue(resultSet.rows.item(index2).Code, DataTypeEnum.STRING)),
                streetNameAndNumber: decode(tryParseValue(resultSet.rows.item(index2).StreetNameAndNumber, DataTypeEnum.STRING)),
                postalCode: decode(tryParseValue(resultSet.rows.item(index2).PostalCode, DataTypeEnum.STRING)),
                phone1: decode(tryParseValue(resultSet.rows.item(index2).Phone1, DataTypeEnum.STRING)),
                phone2: decode(tryParseValue(resultSet.rows.item(index2).Phone2, DataTypeEnum.STRING)),
                dealerCode: decode(tryParseValue(resultSet.rows.item(index2).DealerCode, DataTypeEnum.STRING)),
                latitude: tryParseValue(resultSet.rows.item(index2).Latitude, DataTypeEnum.FLOAT),
                longitude: tryParseValue(resultSet.rows.item(index2).Longitude, DataTypeEnum.FLOAT)
            });
        }
    };
    return dealerships;
}

//#endregion

//#region Search Queries Campaigns

export const getCampaign = async (db: SQLiteDatabase, patent?: string, vin?: string): Promise<Campaign[]> => {
    let campaigns: Campaign[] = [];

    let query = `SELECT * FROM ${TABLE_CAMPAIGNS}`;
    if (patent != undefined)
        query += ` WHERE Pat = '${patent?.toUpperCase()}'`;
    else if (vin != undefined)
        query += ` WHERE Vin = '${vin}'`;

    const results = await db.executeSql(query);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            campaigns.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                env: tryParseValue(resultSet.rows.item(index2).Env, DataTypeEnum.STRING),
                vin: tryParseValue(resultSet.rows.item(index2).Vin, DataTypeEnum.STRING),
                cc: tryParseValue(resultSet.rows.item(index2).CC, DataTypeEnum.STRING),
                pat: tryParseValue(resultSet.rows.item(index2).Pat, DataTypeEnum.STRING),
                serv: tryParseValue(resultSet.rows.item(index2).Serv, DataTypeEnum.STRING),
                fecha_serv: tryParseValue(resultSet.rows.item(index2).ServDate, DataTypeEnum.STRING),
                manten: tryParseValue(resultSet.rows.item(index2).Manten, DataTypeEnum.STRING)
            });
        }
    };
    return campaigns;
}

export const getCampaignSearches = async (db: SQLiteDatabase, patent?: string, vin?: string, dateFrom?: Date, dateTo?: Date, isSynchronized?: boolean): Promise<CampaignSearch[]> => {
    let searches: CampaignSearch[] = [];

    let query = `SELECT * FROM ${TABLE_CAMPAIGN_SEARCHES}`;
    if (
        isNotNullOrUndefined(isSynchronized)
        || isNotNullOrWhiteSpace(patent)
        || isNotNullOrWhiteSpace(vin)
        // || isNotNullOrUndefined(dateFrom)
        // || isNotNullOrUndefined(dateTo)
    ) {
        query += ' WHERE';
        if (isNotNullOrWhiteSpace(patent))
            query += ` AND SearchText = '${patent}'`;
        if (isNotNullOrWhiteSpace(vin))
            query += ` AND SearchText = '${vin}'`;
        // if (isNotNullOrUndefined(dateFrom))
        //     query += ` AND strftime('%Y-%m-%d',SearchDate) >= '${format(dateFrom!, 'yyyy-MM-dd')}'`;
        // if (isNotNullOrUndefined(dateTo))
        //     query += ` AND SearchDate <= ${dateTo}`;
        if (isNotNullOrUndefined(isSynchronized))
            query += ` AND IsSynchronized = ${isSynchronized ? 1 : 0}`;

        query = query.replace('WHERE AND', 'WHERE');
    }
    query += ' ORDER BY SearchDate DESC;';

    const results = await db.executeSql(query);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            const sync = resultSet.rows.item(index2).IsSynchronized;
            searches.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                eventId: tryParseValue(resultSet.rows.item(index2).EventID, DataTypeEnum.INT),
                eventName: tryParseValue(resultSet.rows.item(index2).EventName, DataTypeEnum.STRING),
                searchText: tryParseValue(resultSet.rows.item(index2).SearchText, DataTypeEnum.STRING),
                searchDate: tryParseValue(resultSet.rows.item(index2).SearchDate, DataTypeEnum.DATE),
                campaign: {
                    id: tryParseValue(resultSet.rows.item(index2).CampaignID, DataTypeEnum.INT),
                    env: tryParseValue(resultSet.rows.item(index2).Env, DataTypeEnum.STRING),
                    vin: tryParseValue(resultSet.rows.item(index2).Vin, DataTypeEnum.STRING),
                    cc: tryParseValue(resultSet.rows.item(index2).CC, DataTypeEnum.STRING),
                    pat: tryParseValue(resultSet.rows.item(index2).Pat, DataTypeEnum.STRING),
                    serv: tryParseValue(resultSet.rows.item(index2).Serv, DataTypeEnum.STRING),
                    fecha_serv: tryParseValue(resultSet.rows.item(index2).ServDate, DataTypeEnum.STRING),
                    manten: tryParseValue(resultSet.rows.item(index2).Manten, DataTypeEnum.STRING)
                },
                isSynchronized: tryParseValue(resultSet.rows.item(index2).IsSynchronized, DataTypeEnum.BOOLEAN),
                syncDate: tryParseValue(resultSet.rows.item(index2).SyncDate, DataTypeEnum.DATE)
            });
        }
    };
    return searches;
}

//#endregion

//#region Forms

export const getQuoteForms = async (db: SQLiteDatabase, eventId?: number, isSynchronized?: boolean): Promise<QuoteForm[]> => {
    const forms: QuoteForm[] = [];

    let query = `SELECT * FROM ${TABLE_QUOTE_FORM}`;
    if (isNotNullOrUndefined(eventId) || isNotNullOrUndefined(isSynchronized)) {
        query += ' WHERE';
        if (isNotNullOrUndefined(eventId))
            query += ` AND EventID = ${eventId}`;
        if (isNotNullOrUndefined(isSynchronized))
            query += ` AND IsSynchronized = ${isSynchronized ? 1 : 0}`;

        query = query.replace('WHERE AND', 'WHERE');
    }

    console.log("getQuoteForms - query:", query);
    const results = await db.executeSql(query);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            forms.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                eventId: tryParseValue(resultSet.rows.item(index2).EventID, DataTypeEnum.INT),
                eventName: tryParseValue(resultSet.rows.item(index2).EventName, DataTypeEnum.STRING),
                eventCode: tryParseValue(resultSet.rows.item(index2).EventCode, DataTypeEnum.STRING),
                dealershipId: tryParseValue(resultSet.rows.item(index2).DealershipID, DataTypeEnum.INT),
                dealershipName: decode(tryParseValue(resultSet.rows.item(index2).DealershipName, DataTypeEnum.STRING)),
                dealershipCode: decode(tryParseValue(resultSet.rows.item(index2).DealershipCode, DataTypeEnum.STRING)),
                provinceId: tryParseValue(resultSet.rows.item(index2).ProvinceId, DataTypeEnum.INT),
                provinceName: tryParseValue(resultSet.rows.item(index2).ProvinceName, DataTypeEnum.STRING),
                localityId: tryParseValue(resultSet.rows.item(index2).LocalityId, DataTypeEnum.INT),
                localityName: tryParseValue(resultSet.rows.item(index2).LocalityName, DataTypeEnum.STRING),
                vehicleId: tryParseValue(resultSet.rows.item(index2).VehicleID, DataTypeEnum.INT),
                vehicleName: tryParseValue(resultSet.rows.item(index2).VehicleName, DataTypeEnum.STRING),
                vehicleVersionId: tryParseValue(resultSet.rows.item(index2).VehicleVersionId, DataTypeEnum.INT),
                vehicleVersionName: tryParseValue(resultSet.rows.item(index2).VehicleVersionName, DataTypeEnum.STRING),
                vehicleModelYear: tryParseValue(resultSet.rows.item(index2).VehicleModelYear, DataTypeEnum.STRING),
                vehicleTMA: tryParseValue(resultSet.rows.item(index2).VehicleTMA, DataTypeEnum.STRING),
                vehicleSEQ: tryParseValue(resultSet.rows.item(index2).VehicleSEQ, DataTypeEnum.STRING),
                firstname: decode(tryParseValue(resultSet.rows.item(index2).Firstname, DataTypeEnum.STRING)),
                lastname: decode(tryParseValue(resultSet.rows.item(index2).Lastname, DataTypeEnum.STRING)),
                documentType: decode(tryParseValue(resultSet.rows.item(index2).DocumentType, DataTypeEnum.STRING)) as DocumentTypeEnum,
                documentNumber: decode(tryParseValue(resultSet.rows.item(index2).DocumentNumber, DataTypeEnum.STRING)),
                email: decode(tryParseValue(resultSet.rows.item(index2).Email, DataTypeEnum.STRING)),
                pointOfSale: decode(tryParseValue(resultSet.rows.item(index2).PointOfSale, DataTypeEnum.STRING)),
                phoneArea: decode(tryParseValue(resultSet.rows.item(index2).PhoneArea, DataTypeEnum.STRING)),
                phone: decode(tryParseValue(resultSet.rows.item(index2).Phone, DataTypeEnum.STRING)),
                contactPreference: decode(tryParseValue(resultSet.rows.item(index2).ContactPreference, DataTypeEnum.STRING)) as ContactPreferenceEnum,
                receiveInformation: tryParseValue(resultSet.rows.item(index2).ReceiveInformation, DataTypeEnum.INT) == 1,
                acceptConditions: tryParseValue(resultSet.rows.item(index2).AcceptConditions, DataTypeEnum.INT) == 1,
                createdOn: tryParseValue(resultSet.rows.item(index2).CreatedOn, DataTypeEnum.DATE),
                modifiedOn: tryParseValue(resultSet.rows.item(index2).ModifiedOn, DataTypeEnum.DATE),
                isSynchronized: tryParseValue(resultSet.rows.item(index2).IsSynchronized, DataTypeEnum.INT) == 1,
                syncDate: tryParseValue(resultSet.rows.item(index2).SyncDate, DataTypeEnum.DATE),
                syncFailed: tryParseValue(resultSet.rows.item(index2).SyncFailed, DataTypeEnum.INT) == 1
            });
        }
    };
    console.log("getQuoteForms - forms:", forms);
    return forms;
}

export const getNewsletterForms = async (db: SQLiteDatabase, eventId?: number, isSynchronized?: boolean): Promise<NewsletterForm[]> => {
    const forms: NewsletterForm[] = [];

    let query = `SELECT * FROM ${TABLE_NEWSLETTER_FORM}`;
    if (isNotNullOrUndefined(eventId) || isNotNullOrUndefined(isSynchronized)) {
        query += ' WHERE';
        if (isNotNullOrUndefined(eventId))
            query += ` AND EventID = ${eventId}`;
        if (isNotNullOrUndefined(isSynchronized))
            query += ` AND (IsSynchronized = ${isSynchronized ? 1 : 0} OR IsSynchronizedWithSaleforce = ${isSynchronized ? 1 : 0})`;

        query = query.replace('WHERE AND', 'WHERE');
    }

    console.log("getNewsletterForms - query:", query);
    const results = await db.executeSql(query);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            forms.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                eventId: tryParseValue(resultSet.rows.item(index2).EventID, DataTypeEnum.INT),
                eventName: tryParseValue(resultSet.rows.item(index2).EventName, DataTypeEnum.STRING),
                eventCode: tryParseValue(resultSet.rows.item(index2).EventCode, DataTypeEnum.STRING),
                vehicleId: tryParseValue(resultSet.rows.item(index2).VehicleID, DataTypeEnum.INT),
                vehicleName: tryParseValue(resultSet.rows.item(index2).VehicleName, DataTypeEnum.STRING),
                firstname: decode(tryParseValue(resultSet.rows.item(index2).Firstname, DataTypeEnum.STRING)),
                lastname: decode(tryParseValue(resultSet.rows.item(index2).Lastname, DataTypeEnum.STRING)),
                documentType: decode(tryParseValue(resultSet.rows.item(index2).DocumentType, DataTypeEnum.STRING)) as DocumentTypeEnum,
                documentNumber: decode(tryParseValue(resultSet.rows.item(index2).DocumentNumber, DataTypeEnum.STRING)),
                email: decode(tryParseValue(resultSet.rows.item(index2).Email, DataTypeEnum.STRING)),
                phoneArea: decode(tryParseValue(resultSet.rows.item(index2).PhoneArea, DataTypeEnum.STRING)),
                phone: decode(tryParseValue(resultSet.rows.item(index2).Phone, DataTypeEnum.STRING)),
                contactPreference: decode(tryParseValue(resultSet.rows.item(index2).ContactPreference, DataTypeEnum.STRING)) as ContactPreferenceEnum,
                receiveInformation: tryParseValue(resultSet.rows.item(index2).ReceiveInformation, DataTypeEnum.INT) == 1,
                acceptConditions: tryParseValue(resultSet.rows.item(index2).AcceptConditions, DataTypeEnum.INT) == 1,
                createdOn: tryParseValue(resultSet.rows.item(index2).CreatedOn, DataTypeEnum.DATE),
                modifiedOn: tryParseValue(resultSet.rows.item(index2).ModifiedOn, DataTypeEnum.DATE),
                isSynchronized: tryParseValue(resultSet.rows.item(index2).IsSynchronized, DataTypeEnum.INT) == 1,
                syncDate: tryParseValue(resultSet.rows.item(index2).SyncDate, DataTypeEnum.DATE),
                syncFailed: tryParseValue(resultSet.rows.item(index2).SyncFailed, DataTypeEnum.INT) == 1,
                isSynchronizedWithSaleforce: tryParseValue(resultSet.rows.item(index2).IsSynchronizedWithSaleforce, DataTypeEnum.INT) == 1
            });
        }
    };
    console.log("getNewsletterForms - forms:", forms)
    return forms;
}

export const getTestDriveForms = async (db: SQLiteDatabase, eventId?: number, isSynchronized?: boolean): Promise<TestDriveForm[]> => {
    const forms: TestDriveForm[] = [];

    let query = `SELECT * FROM ${TABLE_TEST_DRIVE_FORM}`;
    if (isNotNullOrUndefined(eventId) || isNotNullOrUndefined(isSynchronized)) {
        query += ' WHERE';
        if (isNotNullOrUndefined(eventId))
            query += ` AND EventID = ${eventId}`;
        if (isNotNullOrUndefined(isSynchronized))
            query += ` AND IsSynchronized = ${isSynchronized ? 1 : 0} OR IsSynchronizedWithSaleforce = ${isSynchronized ? 1 : 0}`;

        query = query.replace('WHERE AND', 'WHERE');
    }

    console.log("getTestDriveForms - query:", query);
    const results = await db.executeSql(query);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            forms.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                eventId: tryParseValue(resultSet.rows.item(index2).EventID, DataTypeEnum.INT),
                eventName: tryParseValue(resultSet.rows.item(index2).EventName, DataTypeEnum.STRING),
                eventCode: tryParseValue(resultSet.rows.item(index2).EventCode, DataTypeEnum.STRING),
                vehicleOfInterestId: tryParseValue(resultSet.rows.item(index2).VehicleID, DataTypeEnum.INT),
                vehicleName: tryParseValue(resultSet.rows.item(index2).VehicleName, DataTypeEnum.STRING),
                date: tryParseValue(resultSet.rows.item(index2).Date, DataTypeEnum.DATE),
                selectedTime: tryParseValue(resultSet.rows.item(index2).TimeZone, DataTypeEnum.STRING),
                firstname: decode(tryParseValue(resultSet.rows.item(index2).Firstname, DataTypeEnum.STRING)),
                lastname: decode(tryParseValue(resultSet.rows.item(index2).Lastname, DataTypeEnum.STRING)),
                documentType: decode(tryParseValue(resultSet.rows.item(index2).DocumentType, DataTypeEnum.STRING)) as DocumentTypeEnum,
                documentNumber: decode(tryParseValue(resultSet.rows.item(index2).DocumentNumber, DataTypeEnum.STRING)),
                email: decode(tryParseValue(resultSet.rows.item(index2).Email, DataTypeEnum.STRING)),
                drivingLicenseExpiration: tryParseValue(resultSet.rows.item(index2).DrivingLicenseExpiration, DataTypeEnum.DATE),
                phoneArea: decode(tryParseValue(resultSet.rows.item(index2).PhoneArea, DataTypeEnum.STRING)),
                phone: decode(tryParseValue(resultSet.rows.item(index2).Phone, DataTypeEnum.STRING)),
                contactPreference: decode(tryParseValue(resultSet.rows.item(index2).ContactPreference, DataTypeEnum.STRING)) as ContactPreferenceEnum,
                driverBool: getDriverFromNumber(tryParseValue(resultSet.rows.item(index2).HasVehicle, DataTypeEnum.INT)),
                vehicleInfo: decode(tryParseValue(resultSet.rows.item(index2).VehicleInfo, DataTypeEnum.STRING)),
                companion1Firstname: decode(tryParseValue(resultSet.rows.item(index2).Companion1Firstname, DataTypeEnum.STRING)),
                companion1Lastname: decode(tryParseValue(resultSet.rows.item(index2).Companion1Lastname, DataTypeEnum.STRING)),
                companion1Age: decode(tryParseValue(resultSet.rows.item(index2).Companion1Age, DataTypeEnum.STRING)),
                companion2Fullname: decode(tryParseValue(resultSet.rows.item(index2).Companion2Fullname, DataTypeEnum.STRING)),
                companion2Age: decode(tryParseValue(resultSet.rows.item(index2).Companion2Age, DataTypeEnum.STRING)),
                companion3Fullname: decode(tryParseValue(resultSet.rows.item(index2).Companion3Fullname, DataTypeEnum.STRING)),
                companion3Age: decode(tryParseValue(resultSet.rows.item(index2).Companion3Age, DataTypeEnum.STRING)),
                receiveInformation: tryParseValue(resultSet.rows.item(index2).ReceiveInformation, DataTypeEnum.INT) == 1,
                acceptConditions: tryParseValue(resultSet.rows.item(index2).AcceptConditions, DataTypeEnum.INT) == 1,
                signature: tryParseValue(resultSet.rows.item(index2).Signature, DataTypeEnum.STRING),
                resizedSignature: tryParseValue(resultSet.rows.item(index2).ResizedSignature, DataTypeEnum.STRING),
                createdOn: tryParseValue(resultSet.rows.item(index2).CreatedOn, DataTypeEnum.DATE),
                modifiedOn: tryParseValue(resultSet.rows.item(index2).ModifiedOn, DataTypeEnum.DATE),
                isSynchronized: tryParseValue(resultSet.rows.item(index2).IsSynchronized, DataTypeEnum.INT) == 1,
                isSynchronizedWithSaleforce: tryParseValue(resultSet.rows.item(index2).IsSynchronizedWithSaleforce, DataTypeEnum.INT) == 1,
                syncDate: tryParseValue(resultSet.rows.item(index2).SyncDate, DataTypeEnum.DATE),
                loadedByQR: tryParseValue(resultSet.rows.item(index2).LoadedByQR, DataTypeEnum.INT) == 1,
                syncFailed: tryParseValue(resultSet.rows.item(index2).SyncFailed, DataTypeEnum.INT) == 1

            });
        }
    };
    console.log("getTestDriveForms - forms:", forms);
    return forms;
}

//#endregion

//#region Configuration

export const getConfiguration = async (db: SQLiteDatabase): Promise<ConfigurationDB | undefined> => {
    let configuration: ConfigurationDB = {};
    const results = await db.executeSql(`SELECT * FROM ${TABLE_CONFIGURATIONS}`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            configuration.testDriveDemarcationOwnerUrl = tryParseValue(resultSet.rows.item(index2).TestDriveDemarcationOwnerUrl, DataTypeEnum.STRING)
            configuration.testDriveDemarcationFordUrl = tryParseValue(resultSet.rows.item(index2).TestDriveDemarcationFordUrl, DataTypeEnum.STRING);
            configuration.testDriveDemarcationOwnerInCaravanUrl = tryParseValue(resultSet.rows.item(index2).DemarcationOwnerInCaravan, DataTypeEnum.STRING);
            configuration.testDriveTermsUrl = tryParseValue(resultSet.rows.item(index2).TestDriveTermsUrl, DataTypeEnum.STRING);
            configuration.newsletterUrl = tryParseValue(resultSet.rows.item(index2).NewsletterUrl, DataTypeEnum.STRING);
            configuration.quoteUrl = tryParseValue(resultSet.rows.item(index2).QuoteUrl, DataTypeEnum.STRING);
            configuration.contactData = tryParseValue(resultSet.rows.item(index2).ContactData, DataTypeEnum.STRING);
        }
    }
    return configuration;
}

//#endregion

//#region Error

export const getErrorsFromDB = async (db: SQLiteDatabase): Promise<ErrorDB[]> => {
    let errors: ErrorDB[] = [];
    const results = await db.executeSql(`SELECT * FROM ${TABLE_ERRORS}`);
    for (let index1 = 0; index1 < results.length; index1++) {
        const resultSet = results[index1];
        for (let index2 = 0; index2 < resultSet.rows.length; index2++) {
            errors.push({
                id: tryParseValue(resultSet.rows.item(index2).ID, DataTypeEnum.INT),
                description: tryParseValue(resultSet.rows.item(index2).Description, DataTypeEnum.STRING),
                date: tryParseValue(resultSet.rows.item(index2).Date, DataTypeEnum.DATE),
                type: tryParseValue(resultSet.rows.item(index2).Type, DataTypeEnum.STRING),
                deviceUniqueId: tryParseValue(resultSet.rows.item(index2).DeviceId, DataTypeEnum.STRING),
                deviceName: tryParseValue(resultSet.rows.item(index2).DeviceName, DataTypeEnum.STRING),
                operativeSystem: tryParseValue(resultSet.rows.item(index2).OperativeSystem, DataTypeEnum.STRING),
                operativeSystemVersion: tryParseValue(resultSet.rows.item(index2).OperativeSystemVersion, DataTypeEnum.STRING),
                brand: tryParseValue(resultSet.rows.item(index2).Brand, DataTypeEnum.STRING),
                model: tryParseValue(resultSet.rows.item(index2).Model, DataTypeEnum.STRING),
                appVersion: tryParseValue(resultSet.rows.item(index2).AppVersion, DataTypeEnum.STRING),
                connectionType: tryParseValue(resultSet.rows.item(index2).ConnectionType, DataTypeEnum.STRING)
            });
        }
    }
    return errors;
}

//#endregion

//#endregion



/* ******************************* */
/* ***** Sync Data Functions ***** */
/* ******************************* */

//#region Sync Data

export const insertBaseSyncData = async (
    db: SQLiteDatabase,
    events: Event[],
    vehicles: Vehicle[],
    provinces: Province[],
    dealerships: Dealership[],
    configuration?: ConfigurationDB
): Promise<Transaction> => {
    const unsynchronizedEventIds = await getUnsynchronizedEventIds(db);
    const currentSubEvents = await getSubEvents(unsynchronizedEventIds, true, db);
    return db.transaction((trans) => {
        dropBaseData(trans, unsynchronizedEventIds);
        saveBaseData(trans, unsynchronizedEventIds, currentSubEvents, events, vehicles, provinces, dealerships, configuration);
    });
}

export const insertCampaignData = async (db: SQLiteDatabase, campaigns: Campaign[]): Promise<Transaction> => {
    return db.transaction((trans) => {
        dropCampaignData(trans);
        saveCampaignData(trans, campaigns);
    });
}

export const insertEventData = async (db: SQLiteDatabase, events: Event[]): Promise<Transaction> => {
    const unsynchronizedEventIds = await getUnsynchronizedEventIds(db);
    const currentSubEvents = await getSubEvents(unsynchronizedEventIds, true, db);
    return db.transaction((trans) => {
        dropEventData(trans, unsynchronizedEventIds);
        saveBaseEventData(trans, unsynchronizedEventIds, currentSubEvents, events)
    })
}

export const insertAllData = async (
    db: SQLiteDatabase,
    events: Event[],
    vehicles: Vehicle[],
    provinces: Province[],
    dealerships: Dealership[],
    campaigns: Campaign[],
    configuration?: ConfigurationDB
): Promise<Transaction> => {
    const unsynchronizedEventIds = await getUnsynchronizedEventIds(db);
    const currentSubEvents = await getSubEvents(unsynchronizedEventIds, true, db);
    return db.transaction((trans) => {
        // Base Data
        dropBaseData(trans, unsynchronizedEventIds);
        saveBaseData(trans, unsynchronizedEventIds, currentSubEvents, events, vehicles, provinces, dealerships, configuration);
        // Campaign Data
        dropCampaignData(trans);
        saveCampaignData(trans, campaigns);
    });
}

const dropBaseData = async (
    trans: Transaction,
    unsynchronizedEventIds: number[]
): Promise<void> => {
    // Provinces
    trans.executeSql(`DELETE FROM ${TABLE_LOCALITIES}`);
    trans.executeSql(`DELETE FROM ${TABLE_PROVINCES}`);
    // Events - delete only synchronized tables data
    const eventIds = unsynchronizedEventIds.join(', ');
    trans.executeSql(`DELETE FROM ${TABLE_CAMPAIGN_SEARCHES} WHERE EventID NOT IN (${eventIds});`);
    trans.executeSql(`DELETE FROM ${TABLE_QUOTE_FORM} WHERE EventID NOT IN (${eventIds});`);
    trans.executeSql(`DELETE FROM ${TABLE_NEWSLETTER_FORM} WHERE EventID NOT IN (${eventIds});`);
    trans.executeSql(`DELETE FROM ${TABLE_TEST_DRIVE_FORM} WHERE EventID NOT IN (${eventIds});`);
    trans.executeSql(`DELETE FROM ${TABLE_GUESTS} WHERE EventID NOT IN (${eventIds});`);
    trans.executeSql(`DELETE FROM ${TABLE_SUB_EVENTS} WHERE EventID NOT IN (${eventIds});`);
    trans.executeSql(`DELETE FROM ${TABLE_EVENTS} WHERE ID NOT IN (${eventIds});`);
    // Vehicles
    trans.executeSql(`DELETE FROM ${TABLE_VEHICLE_ACCESSORIES}`);
    trans.executeSql(`DELETE FROM ${TABLE_VEHICLE_COLORS}`);
    trans.executeSql(`DELETE FROM ${TABLE_VEHICLE_IMAGES}`);
    trans.executeSql(`DELETE FROM ${TABLE_VEHICLE_FEATURES_VERSIONS}`);
    trans.executeSql(`DELETE FROM ${TABLE_VEHICLE_VERSIONS}`);
    trans.executeSql(`DELETE FROM ${TABLE_VEHICLE_FEATURES}`);
    trans.executeSql(`DELETE FROM ${TABLE_VEHICLE_FEATURES_GROUPS}`);
    trans.executeSql(`DELETE FROM ${TABLE_VEHICLES}`);
    // Dealerships
    trans.executeSql(`DELETE FROM ${TABLE_DEALERSHIPS}`);
    // Configurations Always Delete
    trans.executeSql(`DELETE FROM ${TABLE_CONFIGURATIONS};`);
}

const dropCampaignData = async (trans: Transaction): Promise<void> => {
    trans.executeSql(`DELETE FROM ${TABLE_CAMPAIGNS};`);
}
const dropEventData = async (trans: Transaction,
    unsynchronizedEventIds: number[]
): Promise<void> => {
    // Events - delete only synchronized tables data
    const eventIds = unsynchronizedEventIds.join(', ');
    trans.executeSql(`DELETE FROM ${TABLE_GUESTS} WHERE EventID NOT IN (${eventIds});`);
    trans.executeSql(`DELETE FROM ${TABLE_SUB_EVENTS} WHERE EventID NOT IN (${eventIds});`);
}

const saveBaseData = async (
    trans: Transaction,
    unsynchronizedEventIds: number[],
    currentSubEvents: SubEvent[],
    events: Event[],
    vehicles: Vehicle[],
    provinces: Province[],
    dealerships: Dealership[],
    configuration?: ConfigurationDB
): Promise<void> => {
    // Provinces
    getInsertProvincesQueries(provinces)?.forEach(query => trans.executeSql(query));

    // Localities
    getInsertLocalitiesQueries(provinces)?.forEach(query => trans.executeSql(query));

    // Events
    getInsertEventsQueries(
        events.filter(x => unsynchronizedEventIds.findIndex(id => id == x.id) == -1 && !x.deleted)
    )?.forEach(query => trans.executeSql(query));
    getUpdateEventsQueries(
        events.filter(x => unsynchronizedEventIds.findIndex(id => id == x.id) != -1)
    )?.forEach(query => trans.executeSql(query));

    // SubEvents
    getInsertSubEventsQueries(
        events.filter(x => unsynchronizedEventIds.findIndex(id => id == x.id) == -1 && !x.deleted)
    )?.forEach(query => trans.executeSql(query));
    getUpdateSubEventsQueries(
        events.filter(x => unsynchronizedEventIds.findIndex(id => id == x.id) != -1),
        currentSubEvents
    )?.forEach(query => trans.executeSql(query));

    // Guests
    getInsertGuestsQueries(events, currentSubEvents)?.forEach(query => trans.executeSql(query));

    // Vehicles
    getInsertVehiclesQueries(vehicles)?.forEach(query => trans.executeSql(query));
    getInsertVehicleVersionsQueries(vehicles)?.forEach(query => trans.executeSql(query));
    getInsertVehicleColorsQueries(vehicles)?.forEach(query => trans.executeSql(query));
    getInsertVehicleImagesQueries(vehicles)?.forEach(query => trans.executeSql(query));
    getInsertVehicleFeaturesGroupsQueries(vehicles)?.forEach(query => trans.executeSql(query));
    getInsertVehicleFeaturesQueries(vehicles)?.forEach(query => trans.executeSql(query));
    getInsertVehicleFeaturesVersionsQueries(vehicles)?.forEach(query => trans.executeSql(query));
    getInsertVehicleAccessoriesQueries(vehicles)?.forEach(query => trans.executeSql(query));

    // Dealerships
    getInsertDealershipsQueries(dealerships)?.forEach(query => trans.executeSql(query));

    // Configurations
    getInsertConfigurationQueries(configuration)?.forEach(query => trans.executeSql(query));
}

const saveBaseEventData = async (
    trans: Transaction,
    unsynchronizedEventIds: number[],
    currentSubEvents: SubEvent[],
    events: Event[],
): Promise<void> => {
    // SubEvents
    getInsertSubEventsQueries(
        events.filter(x => unsynchronizedEventIds.findIndex(id => id == x.id) == -1 && !x.deleted)
    )?.forEach(query => trans.executeSql(query));
    getUpdateSubEventsQueries(
        events.filter(x => unsynchronizedEventIds.findIndex(id => id == x.id) != -1),
        currentSubEvents
    )?.forEach(query => trans.executeSql(query));

    // Guests
    getInsertGuestsQueries(events, currentSubEvents)?.forEach(query => trans.executeSql(query));
}

const saveCampaignData = async (trans: Transaction, campaigns: Campaign[]) => {
    let batchCampaigns: Campaign[][] = [];
    while (campaigns.length > 0) {
        batchCampaigns.push(campaigns.splice(0, 100));
    }

    batchCampaigns.forEach((campaingItems, index) => {
        const insertQuery = getInsertCampaignsQuery(campaingItems);
        if (insertQuery)
            trans.executeSql(insertQuery);
    });
}

//#endregion

//#region Forms

export const saveQuoteForm = async (db: SQLiteDatabase, form: QuoteForm): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        let deletePreviousQuery = "";
        if (form.id) {
            form.modifiedOn = new Date();
            form.isSynchronized = false;
            deletePreviousQuery = `DELETE FROM ${TABLE_QUOTE_FORM} WHERE ID = ${form.id}`
        }
        else
            form.createdOn = new Date();
        const saveQuery = getInsertQuoteFormQuery(form);
        if (saveQuery)
            db.transaction(trans => {
                if (deletePreviousQuery)
                    trans.executeSql(deletePreviousQuery);
                trans.executeSql(saveQuery);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        else
            resolve(false);
    });
}

export const deleteQuoteForms = async (db: SQLiteDatabase, formIds?: number[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        if (!formIds || formIds.length == 0) {
            resolve(true);
        } else {
            db.transaction(trans => {
                trans.executeSql(`DELETE FROM ${TABLE_QUOTE_FORM} WHERE ID IN (${formIds.join(', ')})`);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        }
    });
}

export const saveNewsletterForm = async (db: SQLiteDatabase, form: NewsletterForm): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        let deletePreviousQuery = "";
        if (form.id) {
            form.modifiedOn = new Date();
            form.isSynchronized = false;
            deletePreviousQuery = `DELETE FROM ${TABLE_NEWSLETTER_FORM} WHERE ID = ${form.id}`
        }
        else
            form.createdOn = new Date();
        const saveQuery = getInsertNewsletterFormQuery(form);
        if (saveQuery)
            db.transaction(trans => {
                if (deletePreviousQuery)
                    trans.executeSql(deletePreviousQuery);
                trans.executeSql(saveQuery);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        else
            resolve(false);
    });
}

export const deleteNewsletterForms = async (db: SQLiteDatabase, formIds: number[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        if (formIds.length == 0) {
            resolve(true);
        } else {
            db.transaction(trans => {
                trans.executeSql(`DELETE FROM ${TABLE_NEWSLETTER_FORM} WHERE ID IN (${formIds.join(', ')})`);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        }
    });
}

export const saveTestDriveForm = async (db: SQLiteDatabase, form: TestDriveForm): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        let deletePreviousQuery = "";
        if (form.id) {
            form.modifiedOn = new Date();
            form.isSynchronized = false;
            deletePreviousQuery = `DELETE FROM ${TABLE_TEST_DRIVE_FORM} WHERE ID = ${form.id}`
        }
        else
            form.createdOn = new Date();

        const saveQuery = getInsertTestDriveFormQuery(form);
        if (saveQuery)
            db.transaction(trans => {
                if (deletePreviousQuery)
                    trans.executeSql(deletePreviousQuery);
                trans.executeSql(saveQuery);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        else
            resolve(false);
    });
}

export const deleteTestDriveForms = async (db: SQLiteDatabase, formIds: number[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        if (formIds.length == 0) {
            resolve(true);
        } else {
            db.transaction(trans => {
                trans.executeSql(`DELETE FROM ${TABLE_TEST_DRIVE_FORM} WHERE ID IN (${formIds.join(', ')})`);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        }
    });
}

export const setFormSyncStatus = async (db: SQLiteDatabase, type: FormTypeEnum, success: boolean, formIds?: number[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        if (!formIds || formIds.length == 0)
            resolve(true);
        else {
            let saveQuery = '';
            const formIdsStr = formIds.join(', ');
            switch (type) {
                case FormTypeEnum.QUOTE:
                    saveQuery = `UPDATE ${TABLE_QUOTE_FORM} SET SyncFailed = ${success ? 0 : 1}, IsSynchronized = ${success ? 1 : 0} WHERE ID IN (${formIdsStr});`;
                    break;
                case FormTypeEnum.NEWSLETTER:
                    saveQuery = `UPDATE ${TABLE_NEWSLETTER_FORM} SET SyncFailed = ${success ? 0 : 1}, IsSynchronized = ${success ? 1 : 0} WHERE ID IN (${formIdsStr});`;
                    break;
                case FormTypeEnum.TESTDRIVE:
                    saveQuery = `UPDATE ${TABLE_TEST_DRIVE_FORM} SET SyncFailed = ${success ? 0 : 1}, IsSynchronized = ${success ? 1 : 0} WHERE ID IN (${formIdsStr});`;
                    break;
            }
            console.log("setFormSyncStatus - saveQuery:", saveQuery);
            if (saveQuery) {
                db.transaction(trans => {
                    trans.executeSql(saveQuery);
                }, error => {
                    console.log('Error:', error);
                    resolve(false);
                }, success => {
                    resolve(true);
                });
            }
            else resolve(false)
        }
    });
}

export const setNewsletterFormSyncSaleforceStatus = async (db: SQLiteDatabase, success: boolean, formIds?: number[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        if (!formIds || formIds.length == 0)
            resolve(true);
        else {
            const formIdsStr = formIds.join(', ');
            let saveQuery = `UPDATE ${TABLE_NEWSLETTER_FORM} SET IsSynchronizedWithSaleforce = ${success ? 1 : 0} WHERE ID IN (${formIdsStr});`;
            console.log("setNewsletterFormSyncSaleforceStatus - saveQuery:", saveQuery);
            if (saveQuery) {
                db.transaction(trans => {
                    trans.executeSql(saveQuery);
                }, error => {
                    console.log('Error:', error);
                    resolve(false);
                }, success => {
                    resolve(true);
                });
            }
            else resolve(false)
        }
    });
}

export const setTestDriveFormSyncSaleforceStatus = async (db: SQLiteDatabase, success: boolean, formIds?: number[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        if (!formIds || formIds.length == 0)
            resolve(true);
        else {
            const formIdsStr = formIds.join(', ');
            let saveQuery = `UPDATE ${TABLE_TEST_DRIVE_FORM} SET IsSynchronizedWithSaleforce = ${success ? 1 : 0} WHERE ID IN (${formIdsStr});`;
            console.log("setTestDriveFormSyncSaleforceStatus - saveQuery:", saveQuery);
            if (saveQuery) {
                db.transaction(trans => {
                    trans.executeSql(saveQuery);
                }, error => {
                    console.log('Error:', error);
                    resolve(false);
                }, success => {
                    resolve(true);
                });
            }
            else resolve(false)
        }
    });
}

//#endregion

//#region Guests

export const saveGuest = async (db: SQLiteDatabase, guest: Guest, eventId: number, subEventId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        let deletePreviousQuery = "";
        if (guest.id) {
            guest.modifiedOn = new Date();
            deletePreviousQuery = `DELETE FROM ${TABLE_GUESTS} WHERE ID = ${guest.id}`
        }
        else
            guest.createdOn = new Date();

        const saveQuery = getInsertGuestQuery(guest, subEventId);
        if (saveQuery) {
            db.transaction(trans => {
                if (deletePreviousQuery)
                    trans.executeSql(deletePreviousQuery);
                trans.executeSql(saveQuery);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        }
        else resolve(false)
    });
}

export const changeGuestStatus = async (db: SQLiteDatabase, guestId: number, newStatus: GuestStatusEnum): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        let saveQuery = `UPDATE ${TABLE_GUESTS} SET Status = '${encode(newStatus)}', IsSynchronized = 0, ModifiedOn = '${new Date().toISOString()}', WasModified = 1 WHERE ID = ${guestId};`;

        console.log("changeGuestStatus - saveQuery:", saveQuery);
        if (saveQuery) {
            db.transaction(trans => {
                trans.executeSql(saveQuery);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        }
        else resolve(false)
    });
}

export const setGuestAsPresent = async (db: SQLiteDatabase, guestId: number, subEventId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        let saveQuery = getSafeQuery(`
                    UPDATE ${TABLE_GUESTS} 
                    SET Status = '${encode(GuestStatusEnum.PRESENT)}', ChangedByQRScanner = 1, IsSynchronized = 0, ModifiedOn = '${new Date().toISOString()}', WasModified = 1
                    WHERE SubEventID = ${subEventId} AND ServerID = ${guestId};`
        );
        console.log("changeGuestStatus - saveQuery:", saveQuery);
        if (saveQuery) {
            db.transaction(trans => {
                trans.executeSql(saveQuery);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        }
        else resolve(false);
    });
}

export const deleteGuest = async (db: SQLiteDatabase, guestId: number): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        db.transaction(trans => {
            trans.executeSql(`UPDATE ${TABLE_GUESTS} SET Deleted = 1 WHERE ID = ${guestId}`);
        }, error => {
            console.log('Error:', error);
            resolve(false);
        }, success => {
            resolve(true);
        });
    });
}

export const deleteGuests = async (db: SQLiteDatabase, guestIds: number[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        db.transaction(trans => {
            const guestIdsSafe = guestIds.join(', ')
            trans.executeSql(`UPDATE ${TABLE_GUESTS} SET Deleted = 1 WHERE ID IN (${guestIdsSafe})`);
        }, error => {
            console.log('Error:', error);
            resolve(false);
        }, success => {
            resolve(true);
        });
    });
}

export const setGuestsAsSynchronized = async (db: SQLiteDatabase, guestIds: number[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        db.transaction(trans => {
            const guestIdsSafe = guestIds.join(', ')
            trans.executeSql(`UPDATE ${TABLE_GUESTS} SET IsSynchronized = 1 WHERE ID IN (${guestIdsSafe})`);
        }, error => {
            console.log('Error:', error);
            resolve(false);
        }, success => {
            resolve(true);
        });
    });
}

export const saveGuestsFromServer = async (db: SQLiteDatabase, guests: ExtendedGuest[]): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        // query to insert guests
        const insertQueries: string[] = [];
        guests?.forEach(guest => {
            insertQueries.push(getSafeQuery(`
                INSERT INTO ${TABLE_GUESTS} (ServerId, EventID, SubEventID, CreatedOn, ModifiedOn, WasModified, Firstname, Lastname, DocumentNumber, PhoneNumber, Email, CarLicencePlate, Type, CompanionReference, Observations1, Observations2, Observations3, Zone, Status, IsSynchronized, SyncDate, Deleted) VALUES (
                    ${guest.serverId},
                    ${guest.eventId},
                    ${guest.subEventId},
                    '${guest.createdOn}',
                    '${guest.modifiedOn}',
                    ${0},
                    '${encode(guest.firstname)}',
                    '${encode(guest.lastname)}',
                    '${encode(guest.documentNumber)}',
                    '${encode(guest.phoneNumber)}',
                    '${encode(guest.email)}',
                    '${encode(guest.carLicencePlate)}',
                    '${encode(guest.type)}',
                    '${encode(guest.companionReference)}',
                    '${encode(guest.observations1)}',
                    '${encode(guest.observations2)}',
                    '${encode(guest.observations3)}',
                    '${encode(guest.zone)}',
                    '${encode(guest.status)}',
                    ${guest.isSynchronized == true ? 1 : 0},
                    '${guest.syncDate}',
                    '${0}'
                );
            `));
        });

        // subeventIds to 
        const subEventIds: number[] = [];
        guests?.forEach(g => {
            if (g.subEventId && !subEventIds.includes(g.subEventId))
                subEventIds.push(g.subEventId)
        });

        db.transaction(trans => {
            // delete sincronized guests and save news
            trans.executeSql(`DELETE FROM ${TABLE_GUESTS} WHERE SubEventID IN (${subEventIds.join(', ')})`)
            insertQueries?.forEach(query => trans.executeSql(query));
        }, error => {
            console.log('Error:', error);
            resolve(false);
        }, success => {
            resolve(true);
        });
    });
}

//#endregion

//#region CampaignSearches

export const saveCampaignSearch = async (db: SQLiteDatabase, campaignSearch: CampaignSearch): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        const insertQuery = getInsertCampaignSearchQuery(campaignSearch);
        if (insertQuery) {
            db.transaction(trans => {
                trans.executeSql(insertQuery);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        }
        else resolve(false)
    });
}

export const setCampaignSearchesSynchronized = async (db: SQLiteDatabase): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        db.transaction(trans => {
            trans.executeSql(`UPDATE ${TABLE_CAMPAIGN_SEARCHES} SET IsSynchronized = 1;`);
        }, error => {
            console.log('Error:', error);
            resolve(false);
        }, success => {
            resolve(true);
        });
    });
}

export const deleteCampaignSearches = async (db: SQLiteDatabase): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        db.transaction(trans => {
            trans.executeSql(`DELETE FROM ${TABLE_CAMPAIGN_SEARCHES}`);
        }, error => {
            console.log('Error:', error);
            resolve(false);
        }, success => {
            resolve(true);
        });
    });
}

//#endregion

//#region Errors

export const saveError = async (db: SQLiteDatabase, error: ErrorDB): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        console.log('saveError - data: ', error);
        const insertQuery = getInsertErrorQuery(error);
        if (insertQuery) {
            db.transaction(trans => {
                trans.executeSql(insertQuery);
            }, error => {
                console.log('Error:', error);
                resolve(false);
            }, success => {
                resolve(true);
            });
        }
        else resolve(false)
    });
}

export const deleteErrors = async (db: SQLiteDatabase): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        db.transaction(trans => {
            trans.executeSql(`DELETE FROM ${TABLE_ERRORS}`);
        }, error => {
            console.log('Error:', error);
            resolve(false);
        }, success => {
            resolve(true);
        });
    });
}

//#endregion

/* **************************** */
/* ***** Common Functions ***** */
/* **************************** */

//#region Common Functions

const tryParseValue = (value: any, type: DataTypeEnum): any => {
    if (!value || value == 'null' || value == 'undefined')
        return undefined;
    try {
        switch (type) {
            case DataTypeEnum.STRING:
                return value.toString();
            case DataTypeEnum.INT:
                return parseInt(value);
            case DataTypeEnum.FLOAT:
                return parseFloat(value);
            case DataTypeEnum.BOOLEAN:
                return value == 1 || value.toString().toLowerCase() === 'true';
            case DataTypeEnum.DATE: {
                return ISOToDate(value);
            }
            case DataTypeEnum.BLOB:
            default:
                return value;
        }
    } catch (err) {
        return undefined;
    }
}

const getSafeQuery = (query: string): string => {
    return query.replace(/\s\s+/g, ' ');
}

const escapeValue = (value?: string): string | undefined => {
    return value?.replace(/\'/g, "''");
}

const encode = (value?: string): string | undefined => {
    return escapeValue(encrypt(value));
}

const decode = (value?: string): string | undefined => {
    return decrypt(value);
}

//#endregion