import { useState, useEffect } from "react";
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { useDbContext } from "../context/DbContext";
import { NewsletterForm } from "../model/form/NewsletterForm";
import { getVehicles, saveNewsletterForm } from '../utils/db';
import { Alert } from "react-native";
import { showFormSavedSuccessModal } from "../store/action/formSavedSuccessModalAction";
import { Vehicle } from '../model/Vehicle';
import { showTermsModal } from "../store/action/termsModalAction";

export const useNewsletterForm = () => {
    const [isGettingVehicles, setIsGettingVehicles] = useState<boolean>(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isSavingForm, setIsSavingForm] = useState<boolean>(false);
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const { db } = useDbContext();
    const dispatch = useDispatch();

    useEffect(() => {
        const getVehiclesFromDB = async () => {
            let vehicles = await getVehicles(db!,false);
            vehicles.sort((a: Vehicle, b: Vehicle) => {
                if ((a.name ?? '') > (b.name ?? '')) return 1;
                if ((a.name ?? '') < (b.name ?? '')) return -1;
                return 0;
            });

            setIsGettingVehicles(false);
            setVehicles(vehicles);
        }

        setIsGettingVehicles(true);
        getVehiclesFromDB();
    }, [])

    const showTerms = () => {
        dispatch(showTermsModal('newsletter'))
    }

    const saveForm = async (newsletterForm: NewsletterForm) => {
        console.log('Saving Newsletter Form');
        setIsSavingForm(true);
        newsletterForm.eventId = currentEvent?.id;
        newsletterForm.eventName = currentEvent?.name;
        newsletterForm.eventCode = currentEvent?.code;
        newsletterForm.vehicleName = vehicles?.find(x => x.id == newsletterForm.vehicleId)?.name;
        const formSaved = await saveNewsletterForm(db!, newsletterForm);
        if (formSaved) {
            dispatch(showFormSavedSuccessModal('newsletter'));
        } else {
            Alert.alert(
                "Error de guardado",
                "Ocurrió un error al guardar el formulario, intente nuevamente",
                [{ text: "Cerrar" }]
            );
        }
        setIsSavingForm(false);
    }

    return {
        isGettingVehicles,
        vehicles,
        isSavingForm,
        showTerms,
        saveForm
    };
};