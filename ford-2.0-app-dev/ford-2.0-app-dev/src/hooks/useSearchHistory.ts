import { isNotNullOrUndefined, isNotNullOrWhiteSpace, isNullOrUndefined } from './../utils/utils';
import { useState, useEffect } from "react";
import { useDbContext } from "../context/DbContext";
import { CampaignSearch } from "../model/CampaignSearch";
import { deleteCampaignSearches, getCampaignSearches, setCampaignSearchesSynchronized } from "../utils/db";
import { isNumeric, isValidPatent } from "../utils/utils";
import { Alert } from 'react-native';
import { showCampaignModal } from '../store/action/campaignModalAction';
import { useDispatch } from 'react-redux';
import { SyncCampaignSearchAction } from '../services/action/syncCampaignSearchAction';
import { getDeviceName } from 'react-native-device-info';
import { useServiceCall } from '../services/hooks/useServiceCall';
import { isRight } from "fp-ts/lib/Either";
import { setLastSyncCampaignSearchesDate } from '../store/action/lastSyncInfoAction';
import { useUploadSyncContext } from '../context/UploadSyncContext';

export const useSearchHistory = () => {
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [totalSearches, setTotalSearches] = useState<number>(0);
    const [searchList, setSearchList] = useState<CampaignSearch[]>([]);
    const [isDeletingSearches, setIsDeletingSearches] = useState<boolean>(false);
    const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
    const [isSearchingCampaignsToSync, setIsSearchingCampaignsToSync] = useState<boolean>(false);
    const { startSyncCampaignSearches, isSyncingCampaignSearches } = useUploadSyncContext();
    const { db } = useDbContext();
    const dispatch = useDispatch();
    const serviceDispatch = useServiceCall();

    useEffect(() => {
        getCampaignSearchesFromDB();
        getTotalSearches();
    }, [])

    const getTotalSearches = async () => {
        const searches = await getCampaignSearches(db!);
        setTotalSearches(searches ? searches.length : 0);
    }

    const getCampaignSearchesFromDB = async (text?: string, dateFrom?: Date, dateTo?: Date, showSent?: boolean) => {
        if (isSearching || isDeletingSearches) return;
        let patent: string | undefined = undefined;
        let vin: string | undefined = undefined;
        if (isNotNullOrWhiteSpace(text)) {
            if (isNumeric(text)) {
                vin = text;
            } else if (isValidPatent(text)) {
                patent = text;
            } else {
                setSnackBarMessage('Por favor, ingrese un valor válido');
                return;
            }
        }

        setIsSearching(true);
        const currentDate = new Date();
        try {
            const searches = await getCampaignSearches(db!, patent, vin, dateFrom, dateTo, showSent ? true : false);
            console.log("searches:", searches.length)
            const filterSearches = searches?.filter(search => {
                if (isNullOrUndefined(dateFrom) && isNullOrUndefined(dateTo))
                    return true;
                else if (isNotNullOrUndefined(dateFrom) && isNullOrUndefined(dateTo))
                    return search.searchDate! >= dateFrom!;
                else if (isNullOrUndefined(dateFrom) && isNotNullOrUndefined(dateTo))
                    return search.searchDate! <= dateTo!;
                else
                    return search.searchDate! >= dateFrom! && search.searchDate! <= dateTo!
            })
            console.log("filterSearches:", filterSearches.length)
            setSearchList(filterSearches ?? []);
        } catch (error) {
            setSnackBarMessage('Ocurrió un error en la búsqueda, revisa los valores ingresados');
            setSearchList([]);
        }
        console.log("Duración de búsqueda total", (new Date().getTime() - currentDate.getTime()) / 1000);
        setIsSearching(false);
    }

    const askForDeleteAllSearches = () => {
        if (isSearchingCampaignsToSync || isSyncingCampaignSearches || isSearching || isDeletingSearches) return;

        Alert.alert(
            "Eliminar búsquedas",
            "¿Seguro desea eliminar todas las búsquedas? Al hacerlo se eliminarán todas las búsquedas realizadas en el dispositivo y aquellas que no estén sincronizadas, no podrán ser enviadas al servidor",
            [
                {
                    text: "Cancel",
                    style: "destructive"
                },
                {
                    text: ""
                },
                {
                    text: "Eliminar Todos",
                    onPress: deleteAllSearches
                }
            ],
            {
                cancelable: true
            }
        );
    }

    const deleteAllSearches = async () => {
        if (isDeletingSearches) return;

        setIsDeletingSearches(true);
        try {
            await deleteCampaignSearches(db!);
            setSearchList([]);
        } catch (error) {
            setSnackBarMessage('Ocurrió un error al eliminar las búsquedas, intente nuevamente');
        }
        setIsDeletingSearches(false);
    }

    const seeCampaignInfo = (item: CampaignSearch) => {
        dispatch(showCampaignModal(item?.campaign))
    }

    const dismissSnackBarMessage = () => {
        setSnackBarMessage(null);
    }

    const syncSearches = async () => {
        if (isSearchingCampaignsToSync || isSyncingCampaignSearches || isSearching || isDeletingSearches) return;

        setIsSearchingCampaignsToSync(true);
        const searches = await getCampaignSearchesToSync();
        setIsSearchingCampaignsToSync(false);
        if (!searches || searches.length == 0) {
            setSnackBarMessage("No se encontraron búsquedas para sincronizar");
            return;
        }

        const isSuccess = await startSyncCampaignSearches(searchList);
        // property isSuccess could be null, in that case nothing is done
        if (isSuccess) {
            Alert.alert("Búsquedas sincronizadas", "Las búsquedas se sincronizaron correctamente", [{ text: "Cerrar" }]);
            await getCampaignSearchesFromDB();
            await getTotalSearches();
        } else if (isSuccess == false) {
            setSnackBarMessage('Ocurrió un error al sincronizar búsquedas, intente nuevamente');
        }
    }

    const getCampaignSearchesToSync = async (): Promise<CampaignSearch[]> => {
        try {
            return await getCampaignSearches(db!, undefined, undefined, undefined, undefined, false);
        } catch (error) {
            console.log("getCampaignSearchesToSync:", error);
            return [];
        }
    }

    return {
        isSearching,
        totalSearches,
        searchList,
        getCampaignSearchesFromDB,
        askForDeleteAllSearches,
        seeCampaignInfo,
        isSyncingSearches: isSearchingCampaignsToSync || isSyncingCampaignSearches,
        syncSearches,
        snackBarMessage,
        dismissSnackBarMessage
    };
};