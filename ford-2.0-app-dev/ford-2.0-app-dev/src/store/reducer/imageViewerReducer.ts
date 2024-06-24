import { ImageURISource } from "react-native";

interface ImageViewerReducerState {
  isImageViewerModalVisible: boolean;
  image?: ImageURISource;
}

const defaultState: ImageViewerReducerState = {
  isImageViewerModalVisible: false,
  image: undefined
};

export type ImageViewerModalAction =
  | { type: "show-image-viewer-modal", payload: { image: ImageURISource } }
  | { type: "hide-image-viewer-modal" };

export function imageViewerModalReducer(
  state: ImageViewerReducerState | undefined = defaultState,
  action: ImageViewerModalAction
): ImageViewerReducerState {
  switch (action.type) {
    case "show-image-viewer-modal":
      return {
        ...state,
        isImageViewerModalVisible: true,
        image: action.payload.image
      };
    case "hide-image-viewer-modal":
      return {
        ...state,
        isImageViewerModalVisible: false,
        image: undefined
      };
    default:
      return state;
  }
}