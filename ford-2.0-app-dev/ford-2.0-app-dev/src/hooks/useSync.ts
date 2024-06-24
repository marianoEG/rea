import { useState } from 'react';
import { isRight } from "fp-ts/lib/Either";
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { useDbContext } from "../context/DbContext";
import { useServiceCall } from "../services/hooks/useServiceCall";
import { finishSyncBase, finishSyncCampaign, finishSyncEvent, finishSyncFull, startSyncBase, startSyncCampaign, startSyncEvent, startSyncFull } from "../store/action/syncAction";
import { setLastSyncBaseDate, setLastSyncCampaignsDate, setLastSyncEventsDate, setLastSyncFullDate } from "../store/action/lastSyncInfoAction";
import { hideSyncModal } from "../store/action/syncModalAction";
import { insertBaseSyncData, getEvents as getEventsFromDb, insertCampaignData, insertAllData, saveError, getErrorsFromDB, insertEventData } from '../utils/db';
import { downloadFile, downloadFileAsBase64, downloadImage } from "../utils/file";
import { selectEvent, unselectEvent } from '../store/action/currentEventAction';
import { Event } from '../model/Event';
import { usePermissionsContext } from "../context/PermissionsContext/PermissionsContext";
import { ErrorDbType, PermissionStatusEnum, PlatformEnum, SyncStatusEnum } from '../utils/constants';
import { Alert, Platform } from "react-native";
import { isNetworkConnected } from '../utils/network';
import { Vehicle } from '../model/Vehicle';
import { GetVehicles } from '../services/action/vehicleAction';
import { Province } from '../model/Province';
import { GetProvinces } from '../services/action/provinceAction';
import { Dealership } from '../model/Dealership';
import { GetDealerships } from '../services/action/dealershipAction';
import { Campaign } from '../model/Campaign';
import { GetCampaigns } from '../services/action/campaignAction';
import { Configuration, ConfigurationDB } from '../model/Configuration';
import { GetConfiguration } from '../services/action/configurationAction';
import { GetEvents } from '../services/action/eventAction';
import { getDeviceInfoForRequests } from '../utils/utils';

interface BaseSync {
    events: Event[];
    vehicles: Vehicle[];
    provinces: Province[];
    dealerships: Dealership[];
    configuration?: ConfigurationDB;
}

interface SyncStatusFile {
    totalToDownload: number;
    totalDownloaded: number;
}

interface SyncStatus {
    status: SyncStatusEnum;
    eventFiles?: SyncStatusFile;
    vehicleFiles?: SyncStatusFile;
    configurationFiles?: SyncStatusFile;
    errorDetail?: any;
}

const defaultSyncStatus: SyncStatus = {
    status: SyncStatusEnum.NONE
}

export const useSync = () => {
    const [syncStatus, setSyncStatus] = useState<SyncStatus>(defaultSyncStatus);
    const serviceDispatch = useServiceCall();
    const dispatch = useDispatch();
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const { lastSyncBaseDate } = useSelector((st: DefaultRootState) => st.persisted.lastSyncInfo);
    const { db } = useDbContext();
    const { askStoragePermission, permissions } = usePermissionsContext();

    //#region Public Methods

    const startBaseSync = async () => {
        console.log("startBaseSync starts");

        if (!(await isNetworkConnected())) {
            showDeviceNotNetworkConnectedAlert();
            return;
        }

        if (!(await hasPermissions())) {
            showNotPermissionsGrantedAlert();
            return;
        }

        dispatch(startSyncBase());
        try {
            const currentDate = new Date();
            const { events, vehicles, provinces, dealerships, configuration } = await doStartBaseSync();
            // Writing on DB
            setSyncStatus({ status: SyncStatusEnum.WRITTING_IN_DATABASE });
            await insertBaseSyncData(db!, events, vehicles, provinces, dealerships, configuration);
            // Validate Current Event
            checkIfCurrentEventExists(await getEventsFromDb(db!, false));

            setSyncStatus({ status: SyncStatusEnum.NONE });
            dispatch(finishSyncBase());
            closeModal();
            console.log("Duración de sincro base", (new Date().getTime() - currentDate.getTime()) / 1000);
            dispatch(setLastSyncBaseDate(currentDate));
        } catch (error: any) {
            console.log('Error en Sincronización Base', error);
            const errorDetail = error?.message ?? JSON.stringify(error);
            saveErrorOnDB(errorDetail, ErrorDbType.BASE_SYNC);
            setSyncStatus({ status: SyncStatusEnum.ERROR, errorDetail });
            dispatch(finishSyncBase());
        }
    }

    const startCampaignSync = async () => {

        if (!(await isNetworkConnected())) {
            showDeviceNotNetworkConnectedAlert();
            return;
        }

        // if (!(await hasPermissions())) {
        //     showNotPermissionsGrantedAlert();
        //     return;
        // }

        dispatch(startSyncCampaign());
        try {
            const currentDate = new Date();
            const campaigns = await doStartCampaignSync();
            // Writing on DB
            setSyncStatus({ status: SyncStatusEnum.WRITTING_IN_DATABASE });
            console.log("Duración del get campañas", (new Date().getTime() - currentDate.getTime()) / 1000);
            insertCampaignData(db!, campaigns)
                .then(success => {
                    setSyncStatus({ status: SyncStatusEnum.NONE });
                    dispatch(finishSyncCampaign());
                    closeModal();
                    console.log("Duración de sincro de campañas", (new Date().getTime() - currentDate.getTime()) / 1000);
                    dispatch(setLastSyncCampaignsDate(currentDate));
                })
                .catch(error => {
                    console.log('Error en Sincronización de Campañas', error);
                    const errorDetail = `Error en Sincronización de Campañas: ${JSON.stringify(error)}`;
                    saveErrorOnDB(errorDetail, ErrorDbType.CAMPAING_SYNC);
                    setSyncStatus({ status: SyncStatusEnum.ERROR, errorDetail });
                    dispatch(finishSyncCampaign());
                });
        } catch (error: any) {
            console.log('Error en Sincronización de Campañas', error);
            const errorDetail = error?.message ?? JSON.stringify(error);
            saveErrorOnDB(errorDetail, ErrorDbType.CAMPAING_SYNC);
            setSyncStatus({ status: SyncStatusEnum.ERROR, errorDetail });
            dispatch(finishSyncCampaign());
        }
    }

    const startFullSync = async () => {
        if (!(await isNetworkConnected())) {
            showDeviceNotNetworkConnectedAlert();
            return;
        }

        if (!(await hasPermissions())) {
            showNotPermissionsGrantedAlert();
            return;
        }

        dispatch(startSyncFull());
        try {
            const currentDate = new Date();
            const { events, vehicles, provinces, dealerships, configuration } = await doStartBaseSync();
            const campaigns = await doStartCampaignSync();
            console.log('campañas descargadas, Insertando');
            // Writing on DB
            setSyncStatus({ status: SyncStatusEnum.WRITTING_IN_DATABASE });
            const insertDate = new Date();
            await insertAllData(db!, events, vehicles, provinces, dealerships, campaigns, configuration);
            console.log("Duración de escritra en base total", (new Date().getTime() - insertDate.getTime()) / 1000);

            setSyncStatus({ status: SyncStatusEnum.NONE });
            dispatch(finishSyncFull());
            closeModal();
            console.log("Duración de sincro total", (new Date().getTime() - currentDate.getTime()) / 1000);
            dispatch(setLastSyncFullDate(currentDate));
        } catch (error: any) {
            console.log('Error en Sincronización Full', error);
            const errorDetail = error?.message ?? JSON.stringify(error);
            saveErrorOnDB(errorDetail, ErrorDbType.FULL_SYNC);
            setSyncStatus({ status: SyncStatusEnum.ERROR, errorDetail });
            dispatch(finishSyncFull());
        }
    }

    const startEventSync = async () => {
        if (!(await isNetworkConnected())) {
            return;
        }

        dispatch(startSyncEvent());
        try {
            const currentDate = new Date();
            const events = await doStartEventSync();
            // Writing on DB
            setSyncStatus({ status: SyncStatusEnum.WRITTING_IN_DATABASE });
            const insertDate = new Date();
            await insertEventData(db!, events);
            console.log("Duración de escritra en base Eventos", (new Date().getTime() - insertDate.getTime()) / 1000);

            setSyncStatus({ status: SyncStatusEnum.NONE });
            dispatch(finishSyncEvent());
            closeModal();
            console.log("Duración de sincro eventos", (new Date().getTime() - currentDate.getTime()) / 1000);
            dispatch(setLastSyncEventsDate(currentDate));
        } catch (error: any) {
            console.log('Error en Sincronización Full', error);
            const errorDetail = error?.message ?? JSON.stringify(error);
            saveErrorOnDB(errorDetail, ErrorDbType.EVENT_SYNC);
            setSyncStatus({ status: SyncStatusEnum.ERROR, errorDetail });
            dispatch(finishSyncEvent());
        }
    }

    const retrySync = () => {
        setSyncStatus({ status: SyncStatusEnum.NONE });
    }

    const getSyncStatusStr = (): string => {
        switch (syncStatus.status) {
            case SyncStatusEnum.GETTING_EVENTS:
                return 'Obteniendo eventos';
            case SyncStatusEnum.DOWNLOADING_EVENTS_FILES:
                if (syncStatus.eventFiles?.totalDownloaded)
                    return `Descargando imágenes de eventos: ${syncStatus.eventFiles?.totalDownloaded ?? 0}/${syncStatus.eventFiles?.totalToDownload ?? 0}`;
                else
                    return 'Descargando imágenes de eventos';
            case SyncStatusEnum.GETTING_VEHICLES:
                return 'Obteniendo vehículos';
            case SyncStatusEnum.DOWNLOADING_VEHICLES_FILES:
                if (syncStatus.vehicleFiles?.totalDownloaded)
                    return `Descargando imágenes de vehículos: ${syncStatus.vehicleFiles?.totalDownloaded ?? 0}/${syncStatus.vehicleFiles?.totalToDownload ?? 0}`;
                else
                    return 'Descargando imágenes de vehículos';
            case SyncStatusEnum.GETTING_PROVINCES_AND_LOCALITIES:
                return 'Obteniendo provincías y localidades';
            case SyncStatusEnum.GETTING_DEALERSHIPS:
                return 'Obteniendo concesionarios';
            case SyncStatusEnum.GETTING_CONFIGURATIONS:
                return 'Obteniendo configuraciones';
            case SyncStatusEnum.DOWNLOADING_CONFIGURATIONS_FILES:
                if (syncStatus.configurationFiles?.totalDownloaded)
                    return `Descargando archivos: ${syncStatus.configurationFiles?.totalDownloaded ?? 0}/${syncStatus.configurationFiles?.totalToDownload ?? 0}`;
                else
                    return 'Descargando archivos';
            case SyncStatusEnum.GETTING_CAMPAIGNS:
                return 'Obteniendo campañas';
            case SyncStatusEnum.WRITTING_IN_DATABASE:
                return 'Guardando datos en base';
            case SyncStatusEnum.ERROR:
                return syncStatus.errorDetail ?? ''
            case SyncStatusEnum.NONE:
            default:
                return '';
        }
    }

    const isSyncError = (): boolean => {
        return syncStatus.status == SyncStatusEnum.ERROR;
    }

    const canCancelSync = (): boolean => {
        return syncStatus.status != SyncStatusEnum.WRITTING_IN_DATABASE;
    }

    const closeModal = () => {
        dispatch(hideSyncModal())
    }

    //#endregion

    //#region Private Methods

    const hasPermissions = async (): Promise<boolean> => {
        if (permissions.storageStatus == PermissionStatusEnum.GRANTED)
            return true;
        else
            return askStoragePermission();
    }

    const doStartBaseSync = async (): Promise<BaseSync> => {
        // Events
        const events = await getEvents();
        await downloadEventImages(events);
        // Vehicles
        const vehicles = await getVehicles();
        await downloadVehicleImages(vehicles);
        // Provinces And Localities
        const provinces = await getProvinces();
        // Dealerships
        const dealerships = await getDealerships();
        // Configurations
        const config = await getConfiguration();
        const configuration = await downloadConfigurationFiles(config);
        return { events, vehicles, provinces, dealerships, configuration };
    }

    const doStartEventSync = async (): Promise<Event[]> => {
        // Events
        const events = await getEvents();
        await downloadEventImages(events);
        return events;
    }

    const doStartCampaignSync = async (): Promise<Campaign[]> => {
        const campaignUrls = await getCampaigns();
        console.log("Url de campañas", campaignUrls);
        const campaigns: Campaign[] = [];
        if (campaignUrls) {
            for (let index = 0; index < campaignUrls.length; index++) {
                const response = await fetch(campaignUrls[index]);
                if (response.ok) {
                    const campaignsResponse = await (response.json() as Promise<Campaign[]>);
                    campaigns.push(...campaignsResponse);
                } else {
                    throw new Error("Error to get campaings");
                }
            }
        }
        return campaigns;
    }

    const showDeviceNotNetworkConnectedAlert = () => {
        Alert.alert(
            "Error de conexión",
            "Para realizar la sincronización es necesaria una conexión a internet. Por favor conecte el dispositivo a la red.",
            [{ text: "Cerrar" }]
        );
    }

    const showNotPermissionsGrantedAlert = () => {
        Alert.alert(
            "Permiso denegado",
            "Para realizar una sincronización se necesita acceder al almacenamiento del dispositivo. Por favor acepte los permisos solicitados.",
            [{ text: "Cerrar" }]
        );
    }

    //#region Get Data

    const getEvents = async (): Promise<Event[]> => {
        setSyncStatus({ status: SyncStatusEnum.GETTING_EVENTS });
        const response = await serviceDispatch(GetEvents(lastSyncBaseDate));
        if (isRight(response))
            return response.right;
        else {
            throw new Error("Error al obtener eventos");
        }
    }

    const getVehicles = async (): Promise<Vehicle[]> => {
        setSyncStatus({ status: SyncStatusEnum.GETTING_VEHICLES });
        const response = await serviceDispatch(GetVehicles(lastSyncBaseDate));
        if (isRight(response))
            return response.right;
        else {
            console.log("Error al obtener vehículos:", response.left)
            throw new Error("Error al obtener vehículos");
        }
    }

    const getProvinces = async (): Promise<Province[]> => {
        setSyncStatus({ status: SyncStatusEnum.GETTING_PROVINCES_AND_LOCALITIES });
        const response = await serviceDispatch(GetProvinces(lastSyncBaseDate));
        if (isRight(response))
            return response.right;
        else
            throw new Error("Error al obtener provincías");
    }

    const getDealerships = async (): Promise<Dealership[]> => {
        setSyncStatus({ status: SyncStatusEnum.GETTING_DEALERSHIPS });
        const response = await serviceDispatch(GetDealerships(lastSyncBaseDate));
        if (isRight(response))
            return response.right;
        else
            throw new Error("Error al obtener concesionarias");
    }

    const getCampaigns = async (): Promise<string[]> => {
        setSyncStatus({ status: SyncStatusEnum.GETTING_CAMPAIGNS });
        const response = await serviceDispatch(GetCampaigns());
        if (isRight(response))
            return response.right;
        else
            throw new Error("Error al obtener campañas");
    }

    const getConfiguration = async (): Promise<Configuration> => {
        setSyncStatus({ status: SyncStatusEnum.GETTING_CONFIGURATIONS });
        const response = await serviceDispatch(GetConfiguration());
        if (isRight(response))
            return response.right;
        else
            throw new Error("Error al obtener configuraciones");
    }

    const downloadEventImages = async (events: Event[]): Promise<void> => {
        let eventFilesCount = events.length ?? 0;
        events.forEach(event => eventFilesCount += event.subEvents?.length ?? 0)
        setSyncStatusDownloadEventFile(eventFilesCount, 1);

        let downloadingCount = 1;
        const eventFilesPaths = await Promise.all([...events.map(event => {
            return downloadImage(event.image, () => {
                downloadingCount += 1;
                setSyncStatusDownloadEventFile(eventFilesCount, downloadingCount);
            })
        })])
        for (let index = 0; index < events.length; index++) {
            const event = events[index];
            event.image = eventFilesPaths[index];
            if (event.subEvents) {
                const imagesFilesPaths = await Promise.all([...event.subEvents.map(se => {
                    return downloadImage(se.image, () => {
                        downloadingCount += 1;
                        setSyncStatusDownloadEventFile(eventFilesCount, downloadingCount);
                    })
                })]);
                event.subEvents.forEach((se, idx) => { se.image = imagesFilesPaths[idx]; });
            }
        }
    }

    const setSyncStatusDownloadEventFile = (totalToDownload: number, totalDownloaded: number) => {
        console.log('setSyncStatusDownloadEventFile', totalDownloaded, totalToDownload);
        setSyncStatus({
            status: SyncStatusEnum.DOWNLOADING_EVENTS_FILES, eventFiles: { totalToDownload, totalDownloaded: Math.min(totalToDownload, totalDownloaded) }
        });
    }

    const downloadVehicleImages = async (vehicles: Vehicle[]): Promise<void> => {
        let vehiclesFilesCount = vehicles.length ?? 0; // iamge property
        vehicles.forEach(vehicle => {
            vehiclesFilesCount += vehicle.images?.length ?? 0; // vehicleImageUrl property (inside images)
            vehiclesFilesCount += vehicle.colors ? vehicle.colors.length * 2 : 0; // vehicleImageUrl and colorImageUrl property (inside colors)
            vehiclesFilesCount += vehicle.accessories?.length ?? 0; // image property (inside accessories)
        })
        setSyncStatusDownloadVehicleFile(vehiclesFilesCount, 1);

        let downloadingCount = 1;
        const vehiclesFilesPaths = await Promise.all([...vehicles.map(vehicle => {
            return downloadImage(vehicle.image, () => {
                downloadingCount += 1;
                setSyncStatusDownloadVehicleFile(vehiclesFilesCount, downloadingCount);
            })
        })]);
        for (let index = 0; index < vehicles.length; index++) {
            const vehicle = vehicles[index];
            vehicle.image = vehiclesFilesPaths[index];
            if (vehicle.images) {
                const vehicleImagesFilesPaths = await Promise.all([...vehicle.images.map(image => {
                    return downloadImage(image.vehicleImageUrl, () => {
                        downloadingCount += 1;
                        setSyncStatusDownloadVehicleFile(vehiclesFilesCount, downloadingCount);
                    })
                })]);
                vehicle.images.forEach((image, idx) => { image.vehicleImageUrl = vehicleImagesFilesPaths[idx]; });
            }
            if (vehicle.colors) {
                const vehicleColorsFilesPaths = await Promise.all([...vehicle.colors.map(color => {
                    return downloadImage(color.vehicleImageUrl, () => {
                        downloadingCount += 1;
                        setSyncStatusDownloadVehicleFile(vehiclesFilesCount, downloadingCount);
                    })
                })]);
                vehicle.colors.forEach((color, idx) => { color.vehicleImageUrl = vehicleColorsFilesPaths[idx]; });

                const colorsFilesPaths = await Promise.all([...vehicle.colors.map(color => {
                    return downloadImage(color.colorImageUrl, () => {
                        downloadingCount += 1;
                        setSyncStatusDownloadVehicleFile(vehiclesFilesCount, downloadingCount);
                    })
                })]);
                vehicle.colors.forEach((color, idx) => { color.colorImageUrl = colorsFilesPaths[idx]; });
            }
            if (vehicle.accessories) {
                const vehicleAccessoriesFilesPaths = await Promise.all([...vehicle.accessories.map(accessory => {
                    return downloadImage(accessory.image, () => {
                        downloadingCount += 1;
                        setSyncStatusDownloadVehicleFile(vehiclesFilesCount, downloadingCount);
                    });
                })]);
                vehicle.accessories.forEach((accessory, idx) => { accessory.image = vehicleAccessoriesFilesPaths[idx]; });
            }
        }
    }

    const setSyncStatusDownloadVehicleFile = (totalToDownload: number, totalDownloaded: number) => {
        console.log('setSyncStatusDownloadVehicleFile', totalDownloaded, totalToDownload);
        setSyncStatus({
            status: SyncStatusEnum.DOWNLOADING_VEHICLES_FILES, vehicleFiles: { totalToDownload, totalDownloaded: Math.min(totalToDownload, totalDownloaded) }
        });
    }

    const downloadConfigurationFiles = async (configuration?: Configuration): Promise<ConfigurationDB> => {
        let config: ConfigurationDB = {};
        if (configuration) {
            setSyncStatusDownloadConfigurationFile(5, 1);
            const urls = [
                configuration?.testDriveDemarcationOwnerUrl,
                configuration?.testDriveDemarcationFordUrl,
                configuration?.testDriveDemarcationOwnerInCaravanUrl,
                configuration?.testDriveTermsUrl,
                configuration?.newsletterUrl,
                configuration?.quoteUrl
            ];
            let downloadingCount = 1;
            const downloadedFilesPaths = await Promise.all([
                ...urls.map(url => {
                    if (Platform.OS == PlatformEnum.ANDROID) {
                        return downloadFileAsBase64(url, () => {
                            downloadingCount += 1;
                            setSyncStatusDownloadConfigurationFile(urls.length, downloadingCount);
                        })
                    } else {
                        return downloadFile(url, () => {
                            downloadingCount += 1;
                            setSyncStatusDownloadConfigurationFile(urls.length, downloadingCount);
                        })
                    }
                })
            ]);
            config.testDriveDemarcationOwnerUrl = downloadedFilesPaths[0];
            config.testDriveDemarcationFordUrl = downloadedFilesPaths[1];
            config.testDriveDemarcationOwnerInCaravanUrl = downloadedFilesPaths[2];
            config.testDriveTermsUrl = downloadedFilesPaths[3];
            config.newsletterUrl = downloadedFilesPaths[4];
            config.quoteUrl = downloadedFilesPaths[5];
            config.contactData = configuration.contactData;
        }
        return config;
    }

    const setSyncStatusDownloadConfigurationFile = (totalToDownload: number, totalDownloaded: number) => {
        console.log('setSyncStatusDownloadConfigurationFile', totalDownloaded, totalToDownload);
        setSyncStatus({
            status: SyncStatusEnum.DOWNLOADING_CONFIGURATIONS_FILES, configurationFiles: { totalToDownload, totalDownloaded: Math.min(totalToDownload, totalDownloaded) }
        });
    }

    //#endregion 

    const checkIfCurrentEventExists = (events: Event[]) => {
        if (currentEvent) {
            const event = events.find(event => { return event.id == currentEvent.id });
            if (!event)
                dispatch(unselectEvent());
            else
                dispatch(selectEvent(event));
        }
    }

    //#endregion

    const saveErrorOnDB = async (description: string, type: ErrorDbType): Promise<void> => {
        try {
            const deviceInfo = await getDeviceInfoForRequests();
            await saveError(db!, {
                description: description,
                date: new Date(),
                type: type,
                deviceUniqueId: deviceInfo?.uniqueId,
                deviceName: deviceInfo?.name,
                operativeSystem: deviceInfo?.operativeSystem,
                operativeSystemVersion: deviceInfo?.operativeSystemVersion,
                brand: deviceInfo?.brand,
                model: deviceInfo?.model,
                appVersion: deviceInfo?.appVersion,
                connectionType: deviceInfo?.connectionType
            });
            console.log('saveErrorOnDB - success');
        } catch (error) {
            console.log('saveErrorOnDB - Fail: ', error);
        }
    }

    return {
        getSyncStatusStr,
        isSyncError,
        startBaseSync,
        startEventSync,
        startCampaignSync,
        startFullSync,
        retrySync,
        canCancelSync,
        closeModal
    };
};