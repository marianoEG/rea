export type FormSavedmodalType = 'quote' | 'test-drive' | 'newsletter' | undefined;

interface FormSavedSuccessModalReducerState {
  isVisible: boolean;
  formType: FormSavedmodalType;
}

const defaultState: FormSavedSuccessModalReducerState = {
  isVisible: false,
  formType: undefined
};

export type FormSavedSuccessModalAction =
  | { type: "show-form-saved-success-modal", payload: { formType: FormSavedmodalType } }
  | { type: "hide-form-saved-success-modal" };

export function FormSavedSuccessModalReducer(
  state: FormSavedSuccessModalReducerState | undefined = defaultState,
  action: FormSavedSuccessModalAction
): FormSavedSuccessModalReducerState {
  switch (action.type) {
    case "show-form-saved-success-modal":
      return {
        ...state,
        isVisible: true,
        formType: action.payload.formType
      };
    case "hide-form-saved-success-modal":
      return {
        ...state,
        isVisible: false,
        formType: undefined
      };
    default:
      return state;
  }
}