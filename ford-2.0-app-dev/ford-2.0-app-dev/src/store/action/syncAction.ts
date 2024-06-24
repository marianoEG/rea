import { Event } from '../../model/Event';
import { SyncAction } from '../reducer/syncReducer';

export const startSyncBase = (): SyncAction => ({
  type: "start-base-sync"
});

export const startSyncCampaign = (): SyncAction => ({
  type: "start-campaign-sync"
});

export const startSyncEvent = (): SyncAction => ({
  type: "start-event-sync"
});

export const startSyncFull = (): SyncAction => ({
  type: "start-full-sync"
});

export const finishSyncBase = (): SyncAction => ({
  type: "sync-base-finished"
});

export const finishSyncCampaign = (): SyncAction => ({
  type: "sync-campaign-finished"
});

export const finishSyncEvent = (): SyncAction => ({
  type: "sync-event-finished"
});

export const finishSyncFull = (): SyncAction => ({
  type: "sync-full-finished"
});

export const cancelSync = (): SyncAction => ({
  type: "cancel-sync"
});