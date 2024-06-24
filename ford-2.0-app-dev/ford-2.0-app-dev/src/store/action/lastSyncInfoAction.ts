import { LastSyncInfoAction } from "../reducer/lastSyncInfoReducer";

export const setLastSyncBaseDate = (date: Date): LastSyncInfoAction => ({
  type: "last-sync-base-date",
  payload: { date }
});

export const setLastSyncCampaignsDate = (date: Date): LastSyncInfoAction => ({
  type: "last-sync-campaigns-date",
  payload: { date }
});
export const setLastSyncEventsDate = (date: Date): LastSyncInfoAction => ({
  type: "last-sync-events-date",
  payload: { date }
});

export const setLastSyncFullDate = (date: Date): LastSyncInfoAction => ({
  type: "last-sync-base-and-campaigns-date",
  payload: { date }
});

export const setLastSyncGuestsDate = (date: Date): LastSyncInfoAction => ({
  type: "last-sync-guests-date",
  payload: { date }
});

export const setLastSyncCampaignSearchesDate = (date: Date): LastSyncInfoAction => ({
  type: "last-sync-campaign-searches-date",
  payload: { date }
});

export const setLastSyncFormsDate = (date: Date, quoteFormSynchronizedCount: number, newsletterFormSynchronizedCount: number, testDriveFormSynchronizedCount: number): LastSyncInfoAction => ({
  type: "last-sync-forms-date",
  payload: {
    date,
    quoteFormSynchronizedCount,
    newsletterFormSynchronizedCount,
    testDriveFormSynchronizedCount
  }
});

export const setLastSyncErrorsDate = (date: Date): LastSyncInfoAction => ({
  type: "last-sync-errors-date",
  payload: { date }
});