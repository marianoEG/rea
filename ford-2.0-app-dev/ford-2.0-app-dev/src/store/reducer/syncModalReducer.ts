interface SyncModalState {
  isSyncModalVisible: boolean;
}

const defaultState: SyncModalState = {
  isSyncModalVisible: false
};

export type SyncModalAction =
  | { type: "show-sync-modal" }
  | { type: "hide-sync-modal" };

export function syncModalReducer(state: SyncModalState | undefined = defaultState, action: SyncModalAction): SyncModalState {
  switch (action.type) {
    case "show-sync-modal":
      return {
        ...state,
        isSyncModalVisible: true
      };
    case "hide-sync-modal":
      return {
        ...state,
        isSyncModalVisible: false
      };
    default:
      return state;
  }
}