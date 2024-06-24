import { SyncModalAction } from "../reducer/syncModalReducer";


export const showSyncModal = (): SyncModalAction => ({
  type: "show-sync-modal"
});

export const hideSyncModal = (): SyncModalAction => ({
  type: "hide-sync-modal"
});
