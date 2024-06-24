import { RouteProp, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDbContext } from "../context/DbContext";
import { RootStackParams } from "../utils/rootNavigation";
import { Screens } from '../navigation/Screens';
import { TestDriveForm } from "../model/form/TestDriveForm";
import { getConfiguration, saveTestDriveForm } from "../utils/db";
import { getMimeTypeFromBase64, readFileAsBase64, removeFile, resizeImage, writeFileFromImageBase64 } from "../utils/file";
import { Alert, Platform } from "react-native";
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { showFormSavedSuccessModal } from "../store/action/formSavedSuccessModalAction";
import { DriverTypeEnum, PlatformEnum, SIGNATURE_OPTIONS } from "../utils/constants";
import { cleanInfoCurrentGuest } from "../store/action/guestAction";

interface PdfResource {
    resourceType?: 'url' | 'base64' | 'file';
    file?: string;
}

const pdfResourceDefault: PdfResource = {
    resourceType: undefined,
    file: undefined
}

export const useTestDriveSignature = () => {
    const [defaultSignature, setDefaultSignature] = useState<string | undefined>(undefined);
    const [signature, setSignature] = useState<string | undefined>(undefined);
    const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
    const [pdfResource, setPdfResource] = useState<PdfResource>(pdfResourceDefault);
    const [isSavingForm, setIsSavingForm] = useState<boolean>(false);
    const [formParam, setFormParam] = useState<TestDriveForm>();
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const { db } = useDbContext();
    const route = useRoute<RouteProp<RootStackParams, Screens.TestDriveSignature>>();
    const dispatch = useDispatch();

    useEffect(() => {
        const init = async () => {
            if (route.params.testDriveForm) {
                try {
                    const form = JSON.parse(route.params.testDriveForm) as TestDriveForm;
                    console.log("Formmm", form)
                    setFormParam(form);
                    setIsLoadingPdf(true);
                    loadSignature(form?.signature);
                    const config = await getConfiguration(db!);
                    let pdfFile: string | undefined = undefined;
                    if (Platform.OS == PlatformEnum.ANDROID) {
                        if (form.driverType == DriverTypeEnum.WITH_OWN_VEHICLE)
                            pdfFile = config?.testDriveDemarcationOwnerUrl?.replace('data:application/octet-stream;base64,', '');
                        else if (form.driverType == DriverTypeEnum.WITH_OWN_VEHICLE_IN_CARAVAN)
                            pdfFile = config?.testDriveDemarcationOwnerInCaravanUrl?.replace('data:application/octet-stream;base64,', '');
                        else
                            pdfFile = config?.testDriveDemarcationFordUrl?.replace('data:application/octet-stream;base64,', '');

                        setPdfResource({
                            resourceType: 'base64',
                            file: pdfFile,
                        });
                    } else {
                        if (form.driverType == DriverTypeEnum.WITH_OWN_VEHICLE)
                            pdfFile = config?.testDriveDemarcationOwnerUrl?.split('/')?.pop();
                        else if (form.driverType == DriverTypeEnum.WITH_OWN_VEHICLE_IN_CARAVAN)
                            pdfFile = config?.testDriveDemarcationOwnerInCaravanUrl?.split('/')?.pop();
                        else
                            pdfFile = config?.testDriveDemarcationFordUrl?.split('/')?.pop();

                        setPdfResource({
                            resourceType: 'file',
                            file: pdfFile,
                        });
                    }

                    if (!pdfFile) {
                        Alert.alert(
                            "Archivo no encontrado",
                            "No se encontraron términos y condiciones",
                            [{ text: "Cerrar" }]
                        );
                        setIsLoadingPdf(false);
                    }
                } catch (error) {
                    console.log('error to parse form:', route.params.testDriveForm);
                }
            }
        }
        init();
    }, [route.params]);

    const loadSignature = (signaturePath?: string) => {
        if (!signaturePath) return;
        readFileAsBase64(signaturePath)
            .then(result => {
                const mimeType = getMimeTypeFromBase64(result);
                const fullBase64 = `data:${mimeType};base64,${result}`;
                console.log('loadSignature - Length', fullBase64.length);
                setDefaultSignature(fullBase64);
                setSignature(fullBase64);
            })
            .catch(error => {
                console.log('loadSignature - Error:', error);
            })
    }

    const saveForm = async () => {
        if (!formParam) return;
        if (isSavingForm) return;
        if (!signature) {
            Alert.alert(
                "Firma no encontrada",
                "Firme los términos y condiciones para continuar",
                [{ text: "Cerrar" }]
            );
        } else {
            setIsSavingForm(true);
            const oldSignature = formParam.signature;
            const oldResizeSignature = formParam.resizedSignature;

            const signatureImagePath = await writeFileFromImageBase64(signature);
            if (signatureImagePath) {
                console.log('Save TestDrive Form - Signature Path:', signatureImagePath);
                const resizedSignaturePath = await resizeImage(
                    signatureImagePath!,
                    SIGNATURE_OPTIONS.resizedWidth,
                    SIGNATURE_OPTIONS.resizedHeight,
                    SIGNATURE_OPTIONS.resizedQuality
                );
                console.log('Save TestDrive Form - Signature Resized Path:', resizedSignaturePath);

                formParam.eventId = currentEvent?.id;
                formParam.eventName = currentEvent?.name;
                formParam.eventCode = currentEvent?.code;
                formParam.signature = signatureImagePath;
                formParam.resizedSignature = resizedSignaturePath;
                const formSaved = await saveTestDriveForm(db!, formParam);
                if (formSaved) {
                    if (oldSignature)
                        await removeFile(oldSignature);
                    if (oldResizeSignature)
                        await removeFile(oldResizeSignature);
                    dispatch(showFormSavedSuccessModal('test-drive'));
                } else {
                    Alert.alert(
                        "Error de guardado",
                        "Ocurrió un error al guardar el formulario, intente nuevamente",
                        [{ text: "Cerrar" }]
                    );
                }
            } else {
                Alert.alert(
                    "Error de guardado",
                    "Ocurrió un error al guardar la imagen de la firma, intente nuevamente",
                    [{ text: "Cerrar" }]
                );
            }
            dispatch(cleanInfoCurrentGuest())
            setIsSavingForm(false);
        }
    }

    const loadingPdfFinished = () => {
        setIsLoadingPdf(false);
    }

    return {
        defaultSignature,
        signature,
        setSignature,
        isLoadingPdf,
        loadingPdfFinished,
        pdfResource,
        saveForm,
        isSavingForm
    };
};