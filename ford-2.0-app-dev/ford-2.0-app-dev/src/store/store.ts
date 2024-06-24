import { serviceCallMiddleware } from './middleware/serviceCallMiddleware';
import AsyncStorage from "@react-native-community/async-storage";
import { createStore, combineReducers, Reducer, CombinedState, applyMiddleware } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { currentEventReducer, EventState } from "./reducer/currentEventReducer";
import { currentSubEventReducer, SubEventState } from "./reducer/currentSubEventReducer";
import { Environment, environmentReducer } from "./reducer/environmentReducer";
import { syncReducer } from "./reducer/syncReducer";
import { syncModalReducer } from './reducer/syncModalReducer';
import { LastSyncInfoState, syncDateReducer } from './reducer/lastSyncInfoReducer';
import { selectedVehicleFeaturesReducer } from './reducer/selectedVehicleFeaturesReducer';
import { TermsModalReducer } from './reducer/termsModalReducer';
import { FormSavedSuccessModalReducer } from './reducer/FormSavedSuccessModalReducer';
import { aboutModalReducer } from './reducer/aboutModalReducer';
import { persistTransform } from './transforms';
import { campaignModalReducer } from './reducer/campaignModalReducer';
import { imageViewerModalReducer } from './reducer/imageViewerReducer';
import { commonInfoReducer } from './reducer/commonInfoReducer';
import { GuestInfoSuccessReducer } from './reducer/guestReducer';

interface PersistedReducer {
    lastSyncInfo: LastSyncInfoState;
    currentSubEvent: SubEventState;
    //environment: Environment
}

declare module "react-redux" {
    interface DefaultRootState extends StoreContent { }
}

type StateOf<T> = T extends Reducer<CombinedState<infer C>, infer A>
    ? C
    : never;

const persistedReducer = persistReducer<PersistedReducer>(
    {
        key: "root",
        keyPrefix: "FORD",
        storage: AsyncStorage,
        transforms: [persistTransform]
    },
    combineReducers({
        lastSyncInfo: syncDateReducer,
        currentSubEvent: currentSubEventReducer,
    })
);

const transientReducer = combineReducers({
    environment: environmentReducer,
    currentEvent: currentEventReducer,
    sync: syncReducer,
    syncModal: syncModalReducer,
    termsModal: TermsModalReducer,
    aboutModal: aboutModalReducer,
    campaignModal: campaignModalReducer,
    formSavedSuccesModal: FormSavedSuccessModalReducer,
    vehicleFeatures: selectedVehicleFeaturesReducer,
    imageViewerModal: imageViewerModalReducer,
    commonInfo: commonInfoReducer,
    currentGuest: GuestInfoSuccessReducer,
});

const storeReducer = combineReducers({
    persisted: persistedReducer,
    transient: transientReducer
})

export const store = createStore(
    storeReducer,
    applyMiddleware(serviceCallMiddleware)
);
export type StoreContent = StateOf<typeof storeReducer>;
export const persistor = persistStore(store, {

});
