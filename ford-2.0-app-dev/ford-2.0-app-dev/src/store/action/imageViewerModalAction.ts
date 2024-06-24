import { ImageURISource } from "react-native";
import { ImageViewerModalAction } from "../reducer/imageViewerReducer";

export const showImageViewerModal = (image: ImageURISource): ImageViewerModalAction => ({
  type: 'show-image-viewer-modal',
  payload: { image }
});

export const hideImageViewerModal = (): ImageViewerModalAction => ({
  type: 'hide-image-viewer-modal'
});
