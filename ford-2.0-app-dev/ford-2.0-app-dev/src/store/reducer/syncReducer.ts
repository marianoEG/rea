interface SyncState {
  isSynchronizingBaseData: boolean;
  isSyncBaseDataFinished: boolean;
  isSynchronizingCampaignData: boolean;
  isSynchronizingEventData: boolean;
  isSyncCampaignDataFinished: boolean;
  isSyncEventDataFinished: boolean;
  isSynchronizingFullData: boolean;
  isSyncFullDataFinished: boolean;
}

const defaultState: SyncState = {
  isSynchronizingBaseData: false,
  isSyncBaseDataFinished: false,
  isSynchronizingCampaignData: false,
  isSynchronizingEventData: false,
  isSyncCampaignDataFinished: false,
  isSyncEventDataFinished: false,
  isSynchronizingFullData: false,
  isSyncFullDataFinished: false
};

export type SyncAction =
  | { type: "start-base-sync" }
  | { type: "start-campaign-sync" }
  | { type: "start-event-sync" }
  | { type: "start-full-sync" }
  | { type: "sync-base-finished" }
  | { type: "sync-campaign-finished" }
  | { type: "sync-event-finished" }
  | { type: "sync-full-finished" }
  | { type: "cancel-sync" };

export function syncReducer(state: SyncState | undefined = defaultState, action: SyncAction): SyncState {
  switch (action.type) {
    case "start-base-sync":
      return {
        ...state,
        isSynchronizingBaseData: true,
        isSyncBaseDataFinished: false
      };
    case "start-campaign-sync":
      return {
        ...state,
        isSynchronizingCampaignData: true,
        isSyncCampaignDataFinished: false
      };
    case "start-event-sync":
      return {
        ...state,
        isSynchronizingEventData: true,
        isSyncEventDataFinished: false
      };
    case "start-full-sync":
      return {
        ...state,
        isSynchronizingFullData: true,
        isSyncFullDataFinished: false
      };
    case "sync-base-finished":
      return {
        ...state,
        isSynchronizingBaseData: false,
        isSyncBaseDataFinished: true
      };
    case "sync-campaign-finished":
      return {
        ...state,
        isSynchronizingCampaignData: false,
        isSyncCampaignDataFinished: true
      };
    case "sync-event-finished":
      return {
        ...state,
        isSynchronizingEventData: false,
        isSyncEventDataFinished: true
      };
    case "sync-full-finished":
      return {
        ...state,
        isSynchronizingFullData: false,
        isSyncFullDataFinished: true
      };
    case "cancel-sync":
      return {
        ...state,
        isSynchronizingBaseData: false,
        isSynchronizingCampaignData: false,
        isSynchronizingFullData: false
      };
    default:
      return state;
  }
}