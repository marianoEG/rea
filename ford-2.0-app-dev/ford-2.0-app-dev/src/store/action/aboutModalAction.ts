import { AboutModalAction } from "../reducer/aboutModalReducer";


export const showAboutModal = (): AboutModalAction => ({
  type: "show-about-modal"
});

export const hideAboutModal = (): AboutModalAction => ({
  type: "hide-about-modal"
});
