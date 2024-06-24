import { useState } from "react";
import { Alert } from "react-native";
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { useDbContext } from "../context/DbContext";
import { QuoteForm } from "../model/form/QuoteForm";
import { saveQuoteForm } from '../utils/db';
import { showFormSavedSuccessModal } from '../store/action/formSavedSuccessModalAction';
import { showTermsModal } from "../store/action/termsModalAction";

export const useDealerShipsQuoteForm = () => {
    const [isSavingForm, setIsSavingForm] = useState<boolean>(false);
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const { db } = useDbContext();
    const dispatch = useDispatch();

    const showTerms = () => {
        dispatch(showTermsModal('quote'))
    }

    const saveForm = async (quoteForm: QuoteForm) => {
        console.log('Saving Quote Form');
        setIsSavingForm(true);
        quoteForm.eventId = currentEvent?.id;
        quoteForm.eventName = currentEvent?.name;
        quoteForm.eventCode = currentEvent?.code;
        const formSaved = await saveQuoteForm(db!, quoteForm);
        if (formSaved) {
            dispatch(showFormSavedSuccessModal('quote'));
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
        isSavingForm,
        showTerms,
        saveForm
    };
};