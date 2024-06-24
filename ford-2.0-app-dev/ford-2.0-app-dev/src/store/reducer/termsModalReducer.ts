export type TermsModalType = 'quote' | 'test-drive' | 'newsletter' | undefined;

interface TermsModalReducerState {
  isTermsModalVisible: boolean;
  type: TermsModalType;
}

const defaultState: TermsModalReducerState = {
  isTermsModalVisible: false,
  type: undefined
};

export type TermsModalAction =
  | { type: "show-terms-modal", payload: { type: TermsModalType } }
  | { type: "hide-terms-modal" };

export function TermsModalReducer(
  state: TermsModalReducerState | undefined = defaultState,
  action: TermsModalAction
): TermsModalReducerState {
  switch (action.type) {
    case "show-terms-modal":
      return {
        ...state,
        isTermsModalVisible: true,
        type: action.payload.type
      };
    case "hide-terms-modal":
      return {
        ...state,
        isTermsModalVisible: false,
        type: undefined
      };
    default:
      return state;
  }
}