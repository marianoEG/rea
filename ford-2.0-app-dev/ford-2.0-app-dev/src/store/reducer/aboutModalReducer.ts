interface AboutModalState {
  isAboutModalVisible: boolean;
}

const defaultState: AboutModalState = {
  isAboutModalVisible: false
};

export type AboutModalAction =
  | { type: "show-about-modal" }
  | { type: "hide-about-modal" };

export function aboutModalReducer(state: AboutModalState | undefined = defaultState, action: AboutModalAction): AboutModalState {
  switch (action.type) {
    case "show-about-modal":
      return {
        ...state,
        isAboutModalVisible: true
      };
    case "hide-about-modal":
      return {
        ...state,
        isAboutModalVisible: false
      };
    default:
      return state;
  }
}