import { createTransform } from 'redux-persist';
import { ISOToDate } from '../utils/utils';

// Transformo las fechas de los reducers: 'lastSyncInfo' y 'currentEvent' (tambien los subEvents y guests)
export const persistTransform = createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState: any, key) => {
        return { ...inboundState };
    },
    // transform state being rehydrated
    (outboundState: any, key) => {
        let data = { ...outboundState };

        // lastSyncInfo
        if (data.hasOwnProperty('lastSyncBaseDate')) {
            data.lastSyncBaseDate = ISOToDate(data.lastSyncBaseDate);
        }
        if (data.hasOwnProperty('lastSyncCampaignsDate')) {
            data.lastSyncCampaignsDate = ISOToDate(data.lastSyncCampaignsDate);
        }
        if (data.hasOwnProperty('lastSyncCampaignSearchesDate')) {
            data.lastSyncCampaignSearchesDate = ISOToDate(data.lastSyncCampaignSearchesDate);
        }
        if (data.hasOwnProperty('lastSyncGuestsDate')) {
            data.lastSyncGuestsDate = ISOToDate(data.lastSyncGuestsDate);
        }
        if (data.hasOwnProperty('lastSyncFormsDate')) {
            data.lastSyncFormsDate = ISOToDate(data.lastSyncFormsDate);
        }
        if (data.hasOwnProperty('lastSyncErrorsDate')) {
            data.lastSyncErrorsDate = ISOToDate(data.lastSyncErrorsDate);
        }
        // event
        if (data.event && data.event.hasOwnProperty('dateFrom')) {
            data.event.dateFrom = ISOToDate(data.event.dateFrom);
        }
        if (data.event && data.event.hasOwnProperty('dateTo')) {
            data.event.dateTo = ISOToDate(data.event.dateTo);
        }
        // subevents
        if (data.event && data.event.hasOwnProperty('subEvents') && data.event.subEvents && data.event.subEvents.length > 0) {
            data.event.subEvents.forEach((subevent: any) => {
                if (subevent.hasOwnProperty('dateFrom')) {
                    subevent.dateFrom = ISOToDate(subevent.dateFrom);
                }
                if (subevent.hasOwnProperty('dateTo')) {
                    subevent.dateTo = ISOToDate(subevent.dateTo);
                }
                // guests
                if (subevent.hasOwnProperty('guests') && subevent.guests && subevent.guests.length > 0) {
                    subevent.guests.forEach((guest: any) => {
                        if (guest.hasOwnProperty('createdOn')) {
                            guest.createdOn = ISOToDate(guest.createdOn);
                        }
                        if (guest.hasOwnProperty('modifiedOn')) {
                            guest.modifiedOn = ISOToDate(guest.modifiedOn);
                        }
                    });
                }
            });
        }

        return data;
    },
    // define which reducers this transform gets called for.
    { whitelist: ['lastSyncInfo', 'currentEvent'] }
);