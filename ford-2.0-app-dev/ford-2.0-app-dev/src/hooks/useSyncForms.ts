import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { useDbContext } from "../context/DbContext";
import { getNewsletterForms, getQuoteForms, getTestDriveForms } from '../utils/db';
import { RootStackParams } from "../utils/rootNavigation";
import { TestDriveForm } from '../model/form/TestDriveForm';
import { NewsletterForm } from '../model/form/NewsletterForm';
import { QuoteForm } from "../model/form/QuoteForm";
import { DefaultRootState, useSelector } from "react-redux";
import { Screens } from '../navigation/Screens';
import { FormTypeEnum } from "../utils/constants";
import { Alert } from "react-native";
import { useUploadSyncContext } from "../context/UploadSyncContext";
import { NotAuthFormTokenException } from "../model/exception/NotAuthFormTokenException";

interface Forms {
    quoteForms?: QuoteForm[];
    newsletterForms?: NewsletterForm[];
    testDriveForms?: TestDriveForm[];
}

interface FormsCommon {
    id?: number;
    eventId?: number;
    createdOn?: Date;
    modifiedOn?: Date;
    firstname?: string;
    lastname?: string;
    documentNumber?: string;
    formType?: number;
    isSync?: boolean;
}

interface FormCount {
    quoteFormCount?: number;
    newsletterFormCount?: number;
    testDriveFormCount?: number;
}
export const useSyncForms = () => {
    const [isGettingForms, setIsGettingForms] = useState<boolean>(true);
    const [isGettingFormsToSync, setIsGettingFormsToSync] = useState<boolean>(false);
    const [allForms, setAllForms] = useState<Forms>();
    const [forms, setForms] = useState<FormsCommon[]>([]);
    const [formsCount, setFormsCount] = useState<FormCount>({ quoteFormCount: 0, newsletterFormCount: 0, testDriveFormCount: 0 });
    // Error Message
    const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();
    const { db } = useDbContext();
    const { startSyncForms, isSyncingForms, sendingFormType } = useUploadSyncContext();

    useEffect(() => {
        searchForms();
    }, []);

    const searchForms = async () => {
        setIsGettingForms(true);
        try {
            const quoteForms = await getQuoteForms(db!, currentEvent!.id, false);
            const newsletterForms = await getNewsletterForms(db!, currentEvent!.id, false);
            const testDriveForms = await getTestDriveForms(db!, currentEvent!.id, false);
            setForms(getFormMapped(quoteForms, newsletterForms, testDriveForms));
            setAllForms({ quoteForms, newsletterForms, testDriveForms });
            setFormsCount({ quoteFormCount: quoteForms?.length ?? 0, newsletterFormCount: newsletterForms?.length ?? 0, testDriveFormCount: testDriveForms?.length ?? 0 })
        } catch (error) {
            setSnackBarMessage('Ocurrió un error al obtener los formularios, intente nuevamente.');
            setForms([]);
            setAllForms({});
            setFormsCount({ quoteFormCount: 0, newsletterFormCount: 0, testDriveFormCount: 0 });
        }
        setIsGettingForms(false);
    }

    const filterFormsByType = (formType?: FormTypeEnum) => {
        setForms(getFormMapped(allForms?.quoteForms, allForms?.newsletterForms, allForms?.testDriveForms, formType));
    }

    const onPressEdit = (form: FormsCommon) => {
        if (isGettingForms || isGettingFormsToSync || isSyncingForms) return;

        switch (form.formType) {
            case FormTypeEnum.QUOTE:
                navigation.navigate(Screens.DelaerShipQuoteForm, { quoteForm: JSON.stringify(allForms?.quoteForms?.find(x => x.id == form.id)) });
                break;
            case FormTypeEnum.NEWSLETTER:
                navigation.navigate(Screens.NewsletterFormStack, { newsletterForm: JSON.stringify(allForms?.newsletterForms?.find(x => x.id == form.id)) });
                break;
            case FormTypeEnum.TESTDRIVE:
                navigation.navigate(Screens.TestDriveFormStack, { testDriveForm: JSON.stringify(allForms?.testDriveForms?.find(x => x.id == form.id)) });
                break;
        }
    }

    const closeSnackBar = () => {
        setSnackBarMessage(null);
    }

    const sendForms = async () => {
        if (isSyncingForms) return;

        try {

            // Start - this is to avoid send repeated guests (since autosync)
            setIsGettingFormsToSync(true);
            let quoteFormToSync: QuoteForm[] = [];
            if (allForms?.quoteForms?.length && allForms.quoteForms.length > 0)
                quoteFormToSync = await getQuoteForms(db!, currentEvent!.id, false);

            let newsletterForms: NewsletterForm[] = [];
            if (allForms?.newsletterForms?.length && allForms.newsletterForms.length > 0)
                newsletterForms = await getNewsletterForms(db!, currentEvent!.id, false);

            let testDriveForms: TestDriveForm[] = [];
            if (allForms?.testDriveForms?.length && allForms.testDriveForms.length > 0)
                testDriveForms = await getTestDriveForms(db!, currentEvent!.id, false);
            setIsGettingFormsToSync(false);
            // End - this is to avoid send repeated guests (since autosync)

            const isSuccess = await startSyncForms(quoteFormToSync ?? [], newsletterForms ?? [], testDriveForms ?? []);
            // property isSuccess could be null, in that case nothing is done
            if (isSuccess) {
                await searchForms();
            } else if (isSuccess == false) {
                Alert.alert("Importante", "Algunos formularios no han podido ser sincronizados, revise los valores y vuelva a intentar", [{ text: "Cerrar" }]);
            }
        } catch (error) {
            setIsGettingFormsToSync(false);
            if (error instanceof NotAuthFormTokenException)
                Alert.alert("Error al sincronizar", "No se pudo establecer una conexión con el servidor al momento de obtener un token", [{ text: "Cerrar" }]);
            else
                Alert.alert("Error al sincronizar", "Ocurrió un error al intentar sincronizar formulario, intente nuevamente", [{ text: "Cerrar" }]);
        }
    }

    //#region Private Methods

    const getFormMapped = (
        quoteForms?: QuoteForm[],
        newsletterForms?: NewsletterForm[],
        testDriveForms?: TestDriveForm[],
        formType?: FormTypeEnum
    ): FormsCommon[] => {
        let forms: FormsCommon[] = [];
        if (quoteForms && (!formType || formType == FormTypeEnum.QUOTE)) {
            forms.push(...quoteForms.map(x => ({
                id: x.id, eventId: x.eventId, createdOn: x.createdOn, modifiedOn: x.modifiedOn, firstname: x.firstname, lastname: x.lastname, documentNumber: x.documentNumber, formType: 1, isSync: x.isSynchronized
            })))
        }
        if (newsletterForms && (!formType || formType == FormTypeEnum.NEWSLETTER)) {
            forms.push(...newsletterForms.map(x => ({
                id: x.id, eventId: x.eventId, createdOn: x.createdOn, modifiedOn: x.modifiedOn, firstname: x.firstname, lastname: x.lastname, documentNumber: x.documentNumber, formType: 2, isSync: x.isSynchronized
            })))
        }
        if (testDriveForms && (!formType || formType == FormTypeEnum.TESTDRIVE)) {
            forms.push(...testDriveForms.map(x => ({
                id: x.id, eventId: x.eventId, createdOn: x.createdOn, modifiedOn: x.modifiedOn, firstname: x.firstname, lastname: x.lastname, documentNumber: x.documentNumber, formType: 3, isSync: x.isSynchronized
            })))
        }
        return forms;
    }
    //#endregion

    return {
        isGettingForms,
        forms,
        filterFormsByType,
        formsCount,
        onPressEdit,
        sendForms,
        isSyncingForms: isSyncingForms || isGettingFormsToSync,
        sendingFormType,
        snackBarMessage,
        closeSnackBar
    };
};