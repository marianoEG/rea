import React, { createContext, useContext, useEffect, useState } from "react";
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { getDeviceName } from 'react-native-device-info';
import { useServiceCall } from "../services/hooks/useServiceCall";
import { SyncGuestAction } from "../services/action/syncGuestAction";
import { Left, isRight } from "fp-ts/lib/Either";
import { setLastSyncCampaignSearchesDate, setLastSyncErrorsDate, setLastSyncFormsDate, setLastSyncGuestsDate } from "../store/action/lastSyncInfoAction";
import { useDbContext } from "./DbContext";
import { deleteErrors, getCampaignSearches, getErrorsFromDB, getNewsletterForms, getQuoteForms, getTestDriveForms, getUnsynchronizedGuests, saveError, saveGuestsFromServer, setCampaignSearchesSynchronized, setFormSyncStatus, setNewsletterFormSyncSaleforceStatus, setTestDriveFormSyncSaleforceStatus } from "../utils/db";
import { isNetworkConnected } from '../utils/network';
import { ExtendedGuest } from '../model/Guest';
import { CampaignSearch } from "../model/CampaignSearch";
import { SyncCampaignSearchAction } from "../services/action/syncCampaignSearchAction";
import { getBodyEncoded, getDeviceInfoForRequests, getNewsletterFormBodyToSyncArray, getNewsletterFormBodyToSyncSaleForceArray, getQuoteFormBodyToSyncArray, getSHA256, getTestDriveFormBodyToSyncArray, getTestDriveFormBodyToSyncSaleForceArray, isNullOrEmpty, newGUID } from "../utils/utils";
import { QuoteForm } from "../model/form/QuoteForm";
import { CUSTOM_SIGNATURE, ErrorDbType, FormTypeEnum, MAX_FORM_SYNC_COUNT, SyncFormStatus } from "../utils/constants";
import { SyncFormResponse } from "../model/SyncFormResponse";
import { SyncFormResult } from "../model/SyncFormResult";
import { NewsletterForm } from "../model/form/NewsletterForm";
import { TestDriveForm, TestDriveSignatureToSync } from "../model/form/TestDriveForm";
import { readFileAsBase64WithMimeType, removeFile } from "../utils/file";
import { NotAuthFormTokenException } from "../model/exception/NotAuthFormTokenException";
import { Screens } from "../navigation/Screens";
import { ErrorDB } from "../model/Error";
import { SyncErrorAction } from "../services/action/syncErrorAction";
import { ServiceCallError } from "../store/middleware/serviceCallMiddleware";
import { SyncFormAction } from "../services/action/syncFormAction";
import { SyncformBody } from "../model/SyncFormBody";

const SYNC_TIME = 180000; // 3 minutes

type UploadSyncContextProps = {
    isSyncingGuests: boolean;
    isSyncingCampaignSearches: boolean;
    isSyncingForms: boolean;
    sendingFormType: SyncFormStatus;
    startSyncGuests: (guests: ExtendedGuest[]) => Promise<boolean | null>;
    startSyncCampaignSearches: (searches: CampaignSearch[]) => Promise<boolean | null>;
    startSyncForms: (quoteForms: QuoteForm[], newsletterForms: NewsletterForm[], testDriveForms: TestDriveForm[]) => Promise<boolean | null>;
};

export const UploadSyncContext = createContext({} as UploadSyncContextProps);

export const useUploadSyncContext = () => {
    return useContext(UploadSyncContext);
}

export const UploadSyncContextProvider = ({ children }: any) => {
    const [isSyncingGuests, setIsSyncingGuests] = useState<boolean>(false);
    const [isSyncingCampaignSearches, setIsSyncingCampaignSearches] = useState<boolean>(false);
    const [isSyncingForms, setIsSyncingForms] = useState<boolean>(false);
    const [isSyncingErrors, setIsSyncingErrors] = useState<boolean>(false);
    const [sendingFormType, setSendingFormType] = useState<SyncFormStatus>(SyncFormStatus.NONE);
    const { lastSyncCampaignSearchesDate, lastSyncGuestsDate, lastSyncFormsDate, lastSyncErrorsDate } = useSelector((st: DefaultRootState) => st.persisted.lastSyncInfo);
    const { syncFormsOAuthHost, syncFormsOAuthClient, syncFormsOAuthSecret, syncFormsOAuthURI, syncFormsHost, saleForce } = useSelector((st: DefaultRootState) => st.transient.environment);
    const isSyncModalVisible = useSelector((st: DefaultRootState) => st.transient.syncModal.isSyncModalVisible);
    const { currentScreen } = useSelector((st: DefaultRootState) => st.transient.commonInfo);
    const { db } = useDbContext();
    const dispatch = useDispatch();
    const serviceDispatch = useServiceCall();
    const [intervalState, setIntervalState] = useState(0);

    /**
     * every 20 seconds verify if sync is needed
     */
    useEffect(() => {
        const interval = setInterval(() => { setIntervalState(s => s + 1) }, 20000);
        return () => {
            if (interval)
                clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (intervalState > 0)
            checkForSync();
    }, [intervalState])

    const checkForSync = async () => {
        console.log('currentScreen - checkForSync:', currentScreen);
        if (!isNetworkConnected() || isSyncing() || isSyncModalVisible || !(currentScreen == Screens.Home || currentScreen == Screens.Events))
            return;

        const currentDate = new Date();
        // Sync Guests
        console.log('last sync guests: ' + ((currentDate.getTime() - (lastSyncGuestsDate?.getTime() ?? 0)) / 1000 / 60) + ' minutes ago');
        if (isTimeToSync(currentDate, lastSyncGuestsDate))
            await getGuestsAndSync();

        // Sync Searches
        console.log('last sync searches: ' + ((currentDate.getTime() - (lastSyncCampaignSearchesDate?.getTime() ?? 0)) / 1000 / 60) + ' minutes ago');
        if (isTimeToSync(currentDate, lastSyncCampaignSearchesDate))
            await getCampaignSearchesAndSync();

        console.log('last sync forms: ' + ((currentDate.getTime() - (lastSyncFormsDate?.getTime() ?? 0)) / 1000 / 60) + ' minutes ago');
        if (isTimeToSync(currentDate, lastSyncFormsDate))
            await getFormsAndSync();

        console.log('last sync errors: ' + ((currentDate.getTime() - (lastSyncErrorsDate?.getTime() ?? 0)) / 1000 / 60) + ' minutes ago');
        if (isTimeToSync(currentDate, lastSyncErrorsDate))
            await getErrorsAndSync();
    }

    const isTimeToSync = (currentDate: Date, lastSyncDate: Date | null | undefined): boolean => {
        return !lastSyncDate || (currentDate.getTime() - lastSyncDate.getTime() >= SYNC_TIME)
    }

    const isSyncing = (): boolean => isSyncingGuests || isSyncingCampaignSearches || isSyncingForms;


    //#region Guests

    const getGuestsAndSync = async () => {
        try {
            const guests = await getUnsynchronizedGuests(db!);
            console.log('UploadSyncContextProvider - Time to sync guests, count: ' + guests?.length ?? 0);
            await startSyncGuests(guests);
        } catch (error) {
            console.log('UploadSyncContextProvider - Error to get unsynchronized guests');
        }
    }

    const startSyncGuests = async (guests: ExtendedGuest[]): Promise<boolean | null> => {
        //if (isSyncingGuests || !guests || guests.length == 0) return null;
        if (isSyncingGuests) return null;
        let isSuccess: boolean = false;

        setIsSyncingGuests(true);
        try {
            const deviceName = await getDeviceName();
            const response = await serviceDispatch(SyncGuestAction(guests ?? [], deviceName));
            if (isRight(response)) {
                const guestsFromServer = response.right;
                await saveGuestsFromServer(db!, guestsFromServer);
                dispatch(setLastSyncGuestsDate(new Date()));
                console.log('UploadSyncContextProvider - guests sync success: ');
                isSuccess = true;
            } else {
                console.log("UploadSyncContextProvider - sync guests error");
                await saveErrorOnDB(getErrorDetail(response.left), ErrorDbType.UPLOAD_GUESTS_SYNC)
            }
        } catch (error: any) {
            console.log("UploadSyncContextProvider - sync guests error:", error);
            const errorDetail = error?.message ?? JSON.stringify(error);
            await saveErrorOnDB(errorDetail, ErrorDbType.UPLOAD_GUESTS_SYNC);
            isSuccess = false;
        }
        setIsSyncingGuests(false);
        return isSuccess;
    }

    //#endregion Guests


    //#region Campaigns

    const getCampaignSearchesAndSync = async () => {
        try {
            const searches = await getCampaignSearches(db!, undefined, undefined, undefined, undefined, false);
            console.log('UploadSyncContextProvider - Time to sync campagin searches, count: ' + searches?.length ?? 0);
            await startSyncCampaignSearches(searches);
        } catch (error) {
            console.log('UploadSyncContextProvider - Error to get unsynchronized campaign searches');
        }
    }

    const startSyncCampaignSearches = async (searches: CampaignSearch[]): Promise<boolean | null> => {
        //if (isSyncingCampaignSearches || !searches || searches.length == 0) return null;
        if (isSyncingCampaignSearches) return null;
        let isSuccess: boolean = false;

        setIsSyncingCampaignSearches(true);
        try {
            const deviceName = await getDeviceName();
            const response = await serviceDispatch(SyncCampaignSearchAction(searches ?? [], deviceName));
            if (isRight(response)) {
                await setCampaignSearchesSynchronized(db!);
                dispatch(setLastSyncCampaignSearchesDate(new Date()))
                console.log('UploadSyncContextProvider - campaign searches sync success: ');
                isSuccess = true;
            } else {
                console.log("UploadSyncContextProvider - sync campaign searches error");
                await saveErrorOnDB(getErrorDetail(response.left), ErrorDbType.UPLOAD_CAMPAIGNS_SYNC)
            }
        } catch (error: any) {
            console.log("UploadSyncContextProvider - sync campaign searches error:", error);
            const errorDetail = error?.message ?? JSON.stringify(error);
            await saveErrorOnDB(errorDetail, ErrorDbType.UPLOAD_CAMPAIGNS_SYNC);
            isSuccess = false;
        }
        setIsSyncingCampaignSearches(false);
        return isSuccess;
    }

    //#endregion Campaign


    //#region Forms

    const getFormsAndSync = async () => {
        try {
            const quoteForms = await getQuoteForms(db!, undefined, false);
            const quoteFormCount = quoteForms?.length ?? 0;
            console.log('UploadSyncContextProvider - Time to sync Quote Forms, count: ' + quoteFormCount);

            const newsletterForms = await getNewsletterForms(db!, undefined, false);
            const newsletterFormCount = newsletterForms?.length ?? 0;
            console.log('UploadSyncContextProvider - Time to sync Newsletter Forms, count: ' + newsletterFormCount);

            const testDriveForms = await getTestDriveForms(db!, undefined, false);
            const testDriveFormCount = testDriveForms?.length ?? 0;
            console.log('UploadSyncContextProvider - Time to sync TestDrive Forms, count: ' + testDriveFormCount);

            if (quoteFormCount > 0 || newsletterFormCount > 0 || testDriveFormCount > 0) {
                await startSyncForms(quoteForms, newsletterForms, testDriveForms);
            } else {
                // Sync to Server to update FormSyncDate
                try { await serviceDispatch(SyncFormAction([])) } catch (error) { }
            }
        } catch (error) {
            console.log('UploadSyncContextProvider - Error to get unsynchronized guests');
        }
    }

    const startSyncForms = async (quoteForms: QuoteForm[], newsletterForms: NewsletterForm[], testDriveForms: TestDriveForm[]): Promise<boolean | null> => {
        if (isSyncingForms) return null;

        setIsSyncingForms(true);

        setSendingFormType(SyncFormStatus.CONNECTING);
        const token = await getFormAuthToken();
        if (!token) {
            setIsSyncingForms(false);
            setSendingFormType(SyncFormStatus.NONE);
            throw new NotAuthFormTokenException("Error to get auth token");
        }

        let filesToDelete: string[] = [];

        setSendingFormType(SyncFormStatus.SYNCING_QUOTE);
        const quoteFormSyncResult = await sendQuoteForms(token, quoteForms);
        if (quoteFormSyncResult.filesToDelete && quoteFormSyncResult.filesToDelete.length > 0)
            filesToDelete.push(...quoteFormSyncResult.filesToDelete);

        setSendingFormType(SyncFormStatus.SYNCING_NEWSLETTER);
        const syncToFord = newsletterForms.filter(x => x.isSynchronized != true);
        const newsletterFormSyncResult = await sendNewsletterForms(token, syncToFord);
        const syncToSaleforce = newsletterForms.filter(x => x.isSynchronizedWithSaleforce != true);
        const newsletterSaleForceSuccess = await sendNewsletterFormsToSaleForce(syncToSaleforce);
        if (newsletterFormSyncResult.filesToDelete && newsletterFormSyncResult.filesToDelete.length > 0)
            filesToDelete.push(...newsletterFormSyncResult.filesToDelete);

        setSendingFormType(SyncFormStatus.SYNCING_TESTDRIVE);
        const syncToFordTestDrive = testDriveForms.filter(x => x.isSynchronized != true);
        const testDriveFormSyncResult = await sendTestDriveForms(token, syncToFordTestDrive);
        const syncTestDriveToSaleforce = testDriveForms.filter(x => x.isSynchronizedWithSaleforce != true);
        const testDriveSaleForceSuccess = await sendTestDriveFormsToSaleForce(syncTestDriveToSaleforce);
        if (testDriveFormSyncResult.filesToDelete && testDriveFormSyncResult.filesToDelete.length > 0)
            filesToDelete.push(...testDriveFormSyncResult.filesToDelete);

        if (filesToDelete && filesToDelete.length > 0) {
            setSendingFormType(SyncFormStatus.DELETING_FILES);
            await deleteFiles(filesToDelete);
        }

        dispatch(
            setLastSyncFormsDate(
                new Date(),
                quoteFormSyncResult.totalSynchronized,
                newsletterFormSyncResult.totalSynchronized,
                testDriveFormSyncResult.totalSynchronized
            )
        )

        setIsSyncingForms(false);
        setSendingFormType(SyncFormStatus.NONE);

        console.log('Errors?:', quoteFormSyncResult.hasError, newsletterFormSyncResult.hasError, testDriveFormSyncResult.hasError);

        return !(quoteFormSyncResult.hasError || newsletterFormSyncResult.hasError || testDriveFormSyncResult.hasError);
    }

    const getFormAuthToken = async (): Promise<string | undefined> => {
        let token: string | undefined = undefined;

        console.log('getAuthToken - Gettin Token');
        try {
            const response = await fetch(syncFormsOAuthHost, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: getBodyEncoded({
                    'grant_type': 'client_credentials',
                    'client_id': syncFormsOAuthClient,
                    'client_secret': syncFormsOAuthSecret,
                    'resource': syncFormsOAuthURI
                })
            });
            if (response.ok) {
                const result = await (response.json());
                console.log('getAuthToken - Success??:', result);
                token = result.access_token;
            } else {
                await saveErrorOnDB('Error to get auth token', ErrorDbType.GET_FORM_AUTH_TOKEN);
            }
        } catch (error: any) {
            console.log('getAuthToken - Error:', error);
            const errorDetail = error?.message ?? JSON.stringify(error);
            await saveErrorOnDB(errorDetail, ErrorDbType.GET_FORM_AUTH_TOKEN);
        }
        return token;
    }

    const sendQuoteForms = async (oAtuhToken: string, forms: QuoteForm[]): Promise<SyncFormResult> => {
        const formCount = forms?.length ?? 0;
        let quoteFormsToSync: QuoteForm[][] = [];
        while (forms.length > 0) {
            quoteFormsToSync.push(forms.splice(0, MAX_FORM_SYNC_COUNT));
        }

        let totalSynchronized: number = 0;
        for (let idx = 0; idx < quoteFormsToSync.length; idx++) {
            try {
                const formsToSync = quoteFormsToSync[idx];
                const url = `${syncFormsHost}/saveSCLeads`;
                const body = JSON.stringify(getQuoteFormBodyToSyncArray(formsToSync));
                console.log('sendQuoteForms - Fetch to: ', url, body);
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${oAtuhToken}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: body
                });
                console.log("sendQuoteForms - Response Status:", response.status);
                if (response.status == 201) {
                    totalSynchronized += formsToSync.length;
                    //await deleteQuoteForms(db!, forms?.map(x => x.id!));
                    await setFormSyncStatus(db!, FormTypeEnum.QUOTE, true, formsToSync?.map(x => x.id!));
                } else if (response.status == 207) {
                    const errorResponse = await (response.json() as Promise<SyncFormResponse>);
                    if (errorResponse) {
                        const errorIndexs = errorResponse.result
                            ?.filter(x => x.sourceIndex != undefined && x.sourceIndex != null)
                            ?.map(x => x.sourceIndex!);
                        totalSynchronized += formsToSync.length - (errorIndexs?.length ?? 0);
                        console.log('sendQuoteForms - Error Total Synchronized', totalSynchronized);
                        await handleSyncMultiStatusError(FormTypeEnum.QUOTE, formsToSync.map(x => x.id!), errorIndexs, errorResponse);
                    }
                } else {
                    const errorResponse = await (response.json() as Promise<SyncFormResponse>);
                    console.log('sendQuoteForms - Error Response', errorResponse);
                    await setFormSyncStatus(db!, FormTypeEnum.QUOTE, false, formsToSync?.map(x => x.id!));
                    await saveErrorOnDB(JSON.stringify(errorResponse), ErrorDbType.UPLOAD_QUOTE_FORMS_SYNC);
                }
            } catch (error: any) {
                console.log("sendQuoteForms - Error:", JSON.stringify(error));
                const errorDetail = error?.message ?? JSON.stringify(error);
                await saveErrorOnDB(errorDetail, ErrorDbType.UPLOAD_QUOTE_FORMS_SYNC);
            }
        }
        return {
            totalSynchronized,
            hasError: totalSynchronized != formCount,
            filesToDelete: []
        };
    }

    const sendNewsletterFormsToSaleForce = async (forms: NewsletterForm[]): Promise<boolean> => {
        try {
            // OAuth
            const oAuthResponse = await fetch(saleForce.oAuth.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "grant_type": saleForce.oAuth.grantType,
                    "client_id": saleForce.oAuth.clientId,
                    "client_secret": saleForce.oAuth.clientSecret,
                    "account_id": saleForce.oAuth.accountId
                })
            });

            if (!oAuthResponse.ok) {
                const errorText = await oAuthResponse.text();
                await saveErrorOnDB(`Error to get saleforce token, status: ${oAuthResponse.status}, error: ${errorText}`, ErrorDbType.GET_SALE_SALEFORCE_AUTH_TOKEN);
                return false;
            }

            const oAuthJson = await oAuthResponse.json();
            if (!oAuthJson || !oAuthJson.access_token) {
                await saveErrorOnDB('Error to get saleforce token, access_token is undefined', ErrorDbType.GET_SALE_SALEFORCE_AUTH_TOKEN);
                return false;
            }

            // Form Send
            const body = JSON.stringify(getNewsletterFormBodyToSyncSaleForceArray(forms));
            console.log('sendNewsletterFormsToSaleForce - Fetch to:', saleForce.newsletterUrl, body);
            const response = await fetch(saleForce.newsletterUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${oAuthJson.access_token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: body
            });
            console.log('sendNewsletterFormsToSaleForce - response:', response);

            if (!response.ok) {
                const errorText = await response.text();
                await saveErrorOnDB(`Error to upload forms to saleforce, status: ${response.status}, error: ${errorText}`, ErrorDbType.UPLOAD_NEWSLETTER_FORMS_SALEFORCE_SYNC);
                return false;
            }

            const formIds = forms.map<number>(x => x.id ?? -1).filter(x => x != -1);
            await setNewsletterFormSyncSaleforceStatus(db!, true, formIds);

            return true;
        } catch (error: any) {
            const errorDetail = error?.message ?? JSON.stringify(error);
            await saveErrorOnDB(errorDetail, ErrorDbType.UPLOAD_NEWSLETTER_FORMS_SALEFORCE_SYNC);
            return false;
        }
    }

    const sendTestDriveFormsToSaleForce = async (forms: TestDriveForm[]): Promise<boolean> => {
        try {
            console.log("start send test drive for SaleForce");
            // OAuth
            const oAuthResponse = await fetch(saleForce.oAuth.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "grant_type": saleForce.oAuth.grantType,
                    "client_id": saleForce.oAuth.clientId,
                    "client_secret": saleForce.oAuth.clientSecret,
                    "account_id": saleForce.oAuth.accountId
                })
            });

            if (!oAuthResponse.ok) {
                const errorText = await oAuthResponse.text();
                await saveErrorOnDB(`Error to get saleforce token, status: ${oAuthResponse.status}, error: ${errorText}`, ErrorDbType.GET_SALE_SALEFORCE_AUTH_TOKEN);
                return false;
            }

            const oAuthJson = await oAuthResponse.json();
            if (!oAuthJson || !oAuthJson.access_token) {
                await saveErrorOnDB('Error to get saleforce token, access_token is undefined', ErrorDbType.GET_SALE_SALEFORCE_AUTH_TOKEN);
                return false;
            }

            // Form Send
            const deviceName = await getDeviceName()
            const body = JSON.stringify(getTestDriveFormBodyToSyncSaleForceArray(forms, deviceName));
            console.log('sendTestDriveFormsToSaleForce - Fetch to:', saleForce.testDriveUrl, body);
            const response = await fetch(saleForce.testDriveUrl, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${oAuthJson.access_token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: body
            });
            console.log('sendTestDriveFormsToSaleForce - response:', response);

            if (!response.ok) {
                const errorText = await response.text();
                await saveErrorOnDB(`Error to upload forms to saleforce, status: ${response.status}, error: ${errorText}`, ErrorDbType.UPLOAD_TEST_DRIVE_FORMS_SALEFORCE_SYNC);
                return false;
            }

            const formIds = forms.map<number>(x => x.id ?? -1).filter(x => x != -1);
            await setTestDriveFormSyncSaleforceStatus(db!, true, formIds);

            return true;
        } catch (error: any) {
            const errorDetail = error?.message ?? JSON.stringify(error);
            await saveErrorOnDB(errorDetail, ErrorDbType.UPLOAD_TEST_DRIVE_FORMS_SALEFORCE_SYNC);
            return false;
        }
    }

    const sendNewsletterForms = async (oAtuhToken: string, forms: NewsletterForm[]): Promise<SyncFormResult> => {
        const formCount = forms?.length ?? 0;
        let newsletterFormsToSync: NewsletterForm[][] = [];
        while (forms.length > 0) {
            newsletterFormsToSync.push(forms.splice(0, MAX_FORM_SYNC_COUNT));
        }

        let totalSynchronized: number = 0;
        for (let idx = 0; idx < newsletterFormsToSync.length; idx++) {
            try {
                const formsToSync = newsletterFormsToSync[idx];
                const url = `${syncFormsHost}/saveMILeads`;
                const body = JSON.stringify(getNewsletterFormBodyToSyncArray(formsToSync));
                console.log('sendNewsletterForms - Fetch to:', url, body);
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${oAtuhToken}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: body
                });
                console.log("sendNewsletterForms - Response Status:", response.status);
                if (response.status == 201) {
                    totalSynchronized += formsToSync.length;
                    //await deleteNewsletterForms(db!, forms?.map(x => x.id!));
                    await setFormSyncStatus(db!, FormTypeEnum.NEWSLETTER, true, formsToSync?.map(x => x.id!));
                } else if (response.status == 207) {
                    const errorResponse = await (response.json() as Promise<SyncFormResponse>);
                    if (errorResponse) {
                        const errorIndexs = errorResponse.result
                            ?.filter(x => x.sourceIndex != undefined && x.sourceIndex != null)
                            ?.map(x => x.sourceIndex!);
                        totalSynchronized += formsToSync.length - (errorIndexs?.length ?? 0);
                        console.log('sendNewsletterForms - Error Total Synchronized', totalSynchronized);
                        await handleSyncMultiStatusError(FormTypeEnum.NEWSLETTER, formsToSync.map(x => x.id!), errorIndexs, errorResponse);
                    }
                } else {
                    const errorResponse = await (response.json() as Promise<SyncFormResponse>);
                    console.log('sendNewsletterForms - Error Response', errorResponse);
                    await setFormSyncStatus(db!, FormTypeEnum.NEWSLETTER, false, formsToSync?.map(x => x.id!));
                    await saveErrorOnDB(JSON.stringify(errorResponse), ErrorDbType.UPLOAD_NEWSLETTER_FORMS_SYNC);
                }
            } catch (error: any) {
                console.log("sendNewsletterForms - Error:", error);
                const errorDetail = error?.message ?? JSON.stringify(error);
                await saveErrorOnDB(errorDetail, ErrorDbType.UPLOAD_NEWSLETTER_FORMS_SYNC);
            }
        }
        return {
            totalSynchronized,
            hasError: totalSynchronized != formCount,
            filesToDelete: []
        };
    }

    const sendTestDriveForms = async (oAtuhToken: string, forms: TestDriveForm[]): Promise<SyncFormResult> => {
        const formCount = forms?.length ?? 0;
        let testdriveFormsToSync: TestDriveForm[][] = [];
        while (forms.length > 0) {
            testdriveFormsToSync.push(forms.splice(0, MAX_FORM_SYNC_COUNT));
        }

        let filesToDelete: string[] = [];
        let totalSynchronized: number = 0;
        let totalSyncWithQR: number = 0;
        let syncFormBody: SyncformBody[] = [];
        for (let idx = 0; idx < testdriveFormsToSync.length; idx++) {
            try {
                const formsToSync = testdriveFormsToSync[idx];

                let signatureBody: TestDriveSignatureToSync[] = [];
                for (let i = 0; i < formsToSync.length; i++) {
                    const form = formsToSync[i];
                    form.userHash = newGUID();
                    let base64File: string;
                    try {
                        base64File = await readFileAsBase64WithMimeType(form.resizedSignature);
                    } catch (error) {
                        base64File = CUSTOM_SIGNATURE;
                    }
                    signatureBody.push({
                        fileid: await getSHA256((form?.eventId?.toString() ?? '') + (form.documentNumber ?? '') + form.userHash),
                        content: base64File
                    });
                }

                // Sync Signature User Files
                await uploadUserSignature(oAtuhToken, signatureBody);

                const url = `${syncFormsHost}/saveTDLeads`;
                const body = JSON.stringify(getTestDriveFormBodyToSyncArray(formsToSync));
                console.log('sendTestDriveForms - Fetch to:', url, body);
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${oAtuhToken}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: body
                });
                console.log("sendTestDriveForms - Response Status:", response.status);
                if (response.status == 201) {
                    totalSynchronized = formsToSync.length;
                    totalSyncWithQR = formsToSync.filter(x => x.loadedByQR == true).length
                    //await deleteTestDriveForms(db!, forms?.map(x => x.id!));
                    formsToSync.forEach(x => {
                        if (x.signature)
                            filesToDelete.push(x.signature);
                        if (x.resizedSignature)
                            filesToDelete.push(x.resizedSignature);

                        syncFormBody.push({ eventId: x.eventId, testDriveCount: 1, testDriveQRCount: (x.loadedByQR ? 1 : 0) })
                    });
                    try { await serviceDispatch(SyncFormAction(syncFormBody)) } catch (error) { }
                    await setFormSyncStatus(db!, FormTypeEnum.TESTDRIVE, true, formsToSync?.map(x => x.id!));

                } else if (response.status == 207) {
                    const errorResponse = await (response.json() as Promise<SyncFormResponse>);
                    if (errorResponse) {
                        const errorIndexs = errorResponse.result
                            ?.filter(x => x.sourceIndex != undefined && x.sourceIndex != null)
                            ?.map(x => x.sourceIndex!);
                        totalSynchronized = formsToSync.length - (errorIndexs?.length ?? 0);
                        //console.log('sendTestDriveForms - Error Total Synchronized', totalSynchronized);
                        console.log('sendTestDriveForms - Error', JSON.stringify(errorResponse));
                        let totalSyncWithQRHasNotError: TestDriveForm[] = [];
                        if (errorIndexs && errorIndexs.length > 0) {
                            formsToSync.forEach((x, index) => {
                                if (errorIndexs?.findIndex(i => i == index) == -1) {
                                    totalSyncWithQRHasNotError.push(x)
                                    if (x.signature)
                                        filesToDelete.push(x.signature);
                                    if (x.resizedSignature)
                                        filesToDelete.push(x.resizedSignature);
                                    syncFormBody.push({ eventId: x.eventId, testDriveCount: 1, testDriveQRCount: (x.loadedByQR ? 1 : 0) })
                                }
                            });
                        }
                        totalSyncWithQR = totalSyncWithQRHasNotError.filter(x => x.loadedByQR == true).length;
                        try { await serviceDispatch(SyncFormAction(syncFormBody)) } catch (error) { }
                        await handleSyncMultiStatusError(FormTypeEnum.TESTDRIVE, formsToSync.map(x => x.id!), errorIndexs, errorResponse);
                    }
                } else {
                    const errorResponse = await (response.json() as Promise<SyncFormResponse>);
                    console.log('sendTestDriveForms - Error Response', errorResponse);
                    await setFormSyncStatus(db!, FormTypeEnum.TESTDRIVE, false, formsToSync?.map(x => x.id!));
                    await saveErrorOnDB(JSON.stringify(errorResponse), ErrorDbType.UPLOAD_TEST_DRIVE_FORMS_SYNC);
                }
            } catch (error: any) {
                console.log("sendTestDriveForms - Error:", JSON.stringify(error));
                const errorDetail = error?.message ?? JSON.stringify(error);
                await saveErrorOnDB(errorDetail, ErrorDbType.UPLOAD_TEST_DRIVE_FORMS_SYNC);
            }
        }
        return {
            totalSynchronized,
            totalSyncWithQR,
            hasError: totalSynchronized != formCount,
            filesToDelete: filesToDelete
        };
    }

    const uploadUserSignature = async (oAtuhToken: string, data: TestDriveSignatureToSync[]): Promise<number> => {
        let totalSynchronized: number = 0;
        try {
            const url = `${syncFormsHost}/saveFiles`;
            const body = JSON.stringify(data);
            console.log('uploadUserSignature - Fetch to:', url);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${oAtuhToken}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: body
            });
            console.log("uploadUserSignature - Response Status:", response.status);
            if (response.status == 201) {
                totalSynchronized = data.length;
            } else if (response.status == 207) {
                const errorResponse = await (response.json() as Promise<SyncFormResponse>);
                console.log('uploadUserSignature - Error Response', errorResponse);
                if (errorResponse) {
                    const errorIndexs = errorResponse.result
                        ?.filter(x => x.sourceIndex != undefined && x.sourceIndex != null)
                        ?.map(x => x.sourceIndex!);
                    totalSynchronized = data.length - (errorIndexs?.length ?? 0);
                }
            } else {
                const errorResponse = await (response.json() as Promise<SyncFormResponse>);
                console.log('uploadUserSignature - Error Response', errorResponse);
                totalSynchronized = 0;
            }
        } catch (error) { console.log("uploadUserSignature - Error:", JSON.stringify(error)); }
        return totalSynchronized;
    }

    /**
     * Handle Sync Multi Status Response Error (http code 207)
     */
    const handleSyncMultiStatusError = async (formType: FormTypeEnum, formIds: number[], errorIndexs: number[] | undefined, error: SyncFormResponse) => {
        let errorIds: number[] = [];
        let successIds: number[] = [];
        formIds.forEach((id, index) =>
            errorIndexs?.findIndex(ei => ei == index) == -1
                ? successIds.push(id)
                : errorIds.push(id)
        );
        if (errorIds) {
            await setFormSyncStatus(db!, formType, false, errorIds);
            await saveErrorOnDB(JSON.stringify(error), getErrorDbTypeByFormType(formType));
        }
        if (successIds)
            await setFormSyncStatus(db!, formType, true, successIds);
    }

    const deleteFiles = async (filesToDelete: string[]): Promise<void> => {
        for (let index = 0; index < filesToDelete.length; index++) {

            try {
                await removeFile(filesToDelete[index]);
            } catch (error) {
                console.log('deleteAllFiles:', error);
            }
        }
    }

    //#endregion Forms


    //#region Errors

    const getErrorsAndSync = async () => {
        try {
            const errors = await getErrorsFromDB(db!);
            console.log('UploadSyncContextProvider - Time to sync errors, count: ' + errors?.length ?? 0);
            await startSyncErrors(errors);
        } catch (error) {
            console.log('UploadSyncContextProvider - Error to get unsynchronized errors');
        }
    }

    const startSyncErrors = async (errors: ErrorDB[]): Promise<boolean | null> => {
        if (isSyncingErrors || !errors || errors.length == 0) return null;
        let isSuccess: boolean = false;

        setIsSyncingErrors(true);
        try {
            console.log('startSyncErrors - body:', errors);
            const response = await serviceDispatch(SyncErrorAction(errors));
            if (isRight(response)) {
                await deleteErrors(db!);
                dispatch(setLastSyncErrorsDate(new Date()));
                console.log('UploadSyncContextProvider - errors sync success: ');
                isSuccess = true;
            } else {
                console.log('UploadSyncContextProvider - startSyncErrors Fail: ', response.left);

            }
        } catch (error) {
            console.log("UploadSyncContextProvider - sync errors fail:", error);
            isSuccess = false;
        }
        setIsSyncingErrors(false);
        return isSuccess;
    }

    const saveErrorOnDB = async (description: string, type: ErrorDbType): Promise<void> => {
        try {
            const deviceInfo = await getDeviceInfoForRequests();
            await saveError(db!, {
                description: description,
                date: new Date(),
                type: type,
                deviceUniqueId: deviceInfo?.uniqueId,
                deviceName: deviceInfo?.name,
                operativeSystem: deviceInfo?.operativeSystem,
                operativeSystemVersion: deviceInfo?.operativeSystemVersion,
                brand: deviceInfo?.brand,
                model: deviceInfo?.model,
                appVersion: deviceInfo?.appVersion,
                connectionType: deviceInfo?.connectionType
            });
            console.log('saveErrorOnDB - success');
        } catch (error) {
            console.log('saveErrorOnDB - Fail: ', error);
        }
    }

    const getErrorDetail = (error: ServiceCallError): string => {
        if (error.type == 'FETCH_ERROR') {
            return error?.error?.message ?? JSON.stringify(error);
        }
        return error.errorMessage ?? '';
    }

    const getErrorDbTypeByFormType = (formType: FormTypeEnum): ErrorDbType => {
        switch (formType) {
            case FormTypeEnum.QUOTE:
                return ErrorDbType.UPLOAD_QUOTE_FORMS_SYNC;
            case FormTypeEnum.NEWSLETTER:
                return ErrorDbType.UPLOAD_NEWSLETTER_FORMS_SYNC;
            case FormTypeEnum.TESTDRIVE:
                return ErrorDbType.UPLOAD_TEST_DRIVE_FORMS_SYNC;
        }
    }

    //#endregion


    return (
        <UploadSyncContext.Provider value={{
            isSyncingGuests,
            isSyncingCampaignSearches,
            isSyncingForms,
            sendingFormType,
            startSyncGuests,
            startSyncCampaignSearches,
            startSyncForms
        }}>
            {children}
        </UploadSyncContext.Provider >
    )
}