import { TermsModalAction, TermsModalType } from "../reducer/termsModalReducer";

export const showTermsModal = (type: TermsModalType): TermsModalAction => ({
  type: "show-terms-modal",
  payload: { type }
});

export const hideTermsModal = (): TermsModalAction => ({
  type: "hide-terms-modal"
});
