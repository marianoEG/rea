import { FormSavedSuccessModalAction, FormSavedmodalType } from "../reducer/FormSavedSuccessModalReducer";
export const showFormSavedSuccessModal = (formType: FormSavedmodalType): FormSavedSuccessModalAction => ({
  type: "show-form-saved-success-modal",
  payload: { formType }
});

export const hideFormSavedSuccessModal = (): FormSavedSuccessModalAction => ({
  type: "hide-form-saved-success-modal"
});
