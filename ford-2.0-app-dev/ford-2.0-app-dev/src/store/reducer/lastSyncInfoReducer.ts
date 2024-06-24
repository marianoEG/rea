export interface LastSyncInfoState {
  lastSyncBaseDate: Date | null;
  lastSyncCampaignsDate: Date | null;
  lastSyncEventsDate: Date | null;
  lastSyncGuestsDate: Date | null;
  lastSyncCampaignSearchesDate: Date | null;
  lastSyncFormsDate: Date | null;
  lastSyncErrorsDate: Date | null;
  quoteFormSynchronizedCount: number | null;
  newsletterFormSynchronizedCount: number | null;
  testDriveFormSynchronizedCount: number | null;
}

const defaultState: LastSyncInfoState = {
  lastSyncBaseDate: null,
  lastSyncCampaignsDate: null,
  lastSyncEventsDate: null,
  lastSyncGuestsDate: null,
  lastSyncCampaignSearchesDate: null,
  lastSyncFormsDate: null,
  lastSyncErrorsDate: null,
  quoteFormSynchronizedCount: null,
  newsletterFormSynchronizedCount: null,
  testDriveFormSynchronizedCount: null
};

export type LastSyncInfoAction =
  | { type: "last-sync-base-date", payload: { date: Date } }
  | { type: "last-sync-campaigns-date", payload: { date: Date } }
  | { type: "last-sync-events-date", payload: { date: Date } }
  | { type: "last-sync-base-and-campaigns-date", payload: { date: Date } }
  | { type: "last-sync-guests-date", payload: { date: Date } }
  | { type: "last-sync-campaign-searches-date", payload: { date: Date } }
  | {
    type: "last-sync-forms-date", payload: {
      date: Date,
      quoteFormSynchronizedCount: number,
      newsletterFormSynchronizedCount: number,
      testDriveFormSynchronizedCount: number
    }
  }
  | { type: "last-sync-errors-date", payload: { date: Date } }

export function syncDateReducer(state: LastSyncInfoState | undefined = defaultState, action: LastSyncInfoAction): LastSyncInfoState {
  switch (action.type) {
    case "last-sync-base-date":
      return {
        ...state,
        lastSyncBaseDate: action.payload.date,
      };
    case "last-sync-campaigns-date":
      return {
        ...state,
        lastSyncCampaignsDate: action.payload.date,
      };
    case "last-sync-events-date":
      return {
        ...state,
        lastSyncEventsDate: action.payload.date,
      };
    case "last-sync-base-and-campaigns-date":
      return {
        ...state,
        lastSyncBaseDate: action.payload.date,
        lastSyncCampaignsDate: action.payload.date,
      };
    case "last-sync-guests-date":
      return {
        ...state,
        lastSyncGuestsDate: action.payload.date,
      };
    case "last-sync-campaign-searches-date":
      return {
        ...state,
        lastSyncCampaignSearchesDate: action.payload.date,
      };
    case "last-sync-forms-date":
      return {
        ...state,
        lastSyncFormsDate: action.payload.date,
        quoteFormSynchronizedCount: action.payload.quoteFormSynchronizedCount,
        newsletterFormSynchronizedCount: action.payload.newsletterFormSynchronizedCount,
        testDriveFormSynchronizedCount: action.payload.testDriveFormSynchronizedCount
      };
    case "last-sync-errors-date":
      return {
        ...state,
        lastSyncErrorsDate: action.payload.date,
      };
    default:
      return state;
  }
}