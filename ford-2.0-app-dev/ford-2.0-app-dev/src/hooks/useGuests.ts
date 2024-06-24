import { RouteProp, useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useState, useCallback } from 'react';
import { Alert } from "react-native";
import { useDbContext } from "../context/DbContext";
import { Guest } from "../model/Guest";
import { SubEvent } from "../model/SubEvent";
import { Screens } from "../navigation/Screens";
import { GuestStatusEnum, Item, PieChartGuestValues, SortType } from "../utils/constants";
import { getGuestsBySubEvent, saveGuest } from "../utils/db";
import { RootStackParams } from "../utils/rootNavigation";
import { capitalize, isNotNullOrEmpty, isNullOrEmpty } from "../utils/utils";
import { DefaultRootState, useSelector } from "react-redux";
import { useSync } from "./useSync";
import { useSyncGuests } from "./useSyncGuests";

interface GuestListState {
    allGuests: Guest[];
    filteredGuests: Guest[];
}

const defaultGuestListState: GuestListState = {
    allGuests: [],
    filteredGuests: []
}

export const useGuests = () => {
    const [pieChartGuestValues, setPieChartGuestValues] = useState<PieChartGuestValues>({ presentCount: 0, absentCount: 0, absentWithNoticeCount: 0 });
    const [isGettingGuests, setIsGettingGuests] = useState<boolean>(false);
    const [guestListState, setGuestListState] = useState<GuestListState>(defaultGuestListState);
    const [textFilter, setTextFilter] = useState<string>('');
    const [sortType, setSortType] = useState<SortType>(SortType.ASC);
    const [observations, setObservations] = useState<Item[]>([]);
    const [observationFilter, setObservationFilter] = useState<Item>();
    const [statusFilter, setStatusFilter] = useState<GuestStatusEnum>();
    const [isGuestModalVisible, setIsGuestModalVisible] = useState<boolean>(false);
    const [isSavingGuest, setIsSavingGuest] = useState<boolean>(false);
    const [intervalState, setIntervalState] = useState(0);
    const isFocused = useIsFocused();
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();
    const route = useRoute<RouteProp<RootStackParams, Screens.Guests>>();
    const { db } = useDbContext();
    const { startEventSync } = useSync()
    const { syncGuests } = useSyncGuests()

    const getSubEvent = useCallback((): SubEvent | null | undefined => {
        if (route.params.subEvent)
            return JSON.parse(route.params.subEvent)
        else null;
    }, [])


    /**
     * every 30 seconds verify if sync is needed
     */
    useEffect(() => {
        const interval = setInterval(() => { setIntervalState(s => s + 1) }, 30 * 1000);
        return () => {
            if (interval)
                clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        if (intervalState > 0)
            reloadGuest();
    }, [intervalState])

    useEffect(() => {
        if (route.params.subEvent) {
            getGuestsFromDB(true)

            const subEvent = getSubEvent();
            navigation.setOptions({ title: `Invitados (${subEvent?.name})` });
        }
    }, [route.params, isFocused]);

    useEffect(() => {
        calculateSummary();
    }, [guestListState]);

    useEffect(() => {
        sortGuests();
        console.log(sortType)
    }, [sortType]);


    const reloadGuest = async () => {
        if (isGuestModalVisible) return
        await syncGuests(false);
        await startEventSync();
        getGuestsFromDB(false);
    }

    const getGuestsFromDB = async (cleanFilters: boolean) => {
        if (isGettingGuests) return;
        if (cleanFilters)
            setIsGettingGuests(true);

        const subEvent = getSubEvent();
        if (subEvent) {
            let date = new Date();
            let newGuests = await getGuestsBySubEvent(db!, subEvent?.id!);
            console.log("Duración de query total", (new Date().getTime() - date.getTime()) / 1000);
            console.log("Invitados:", newGuests?.length);
            console.log('test sort type')
            const sortedGuests = _getGuestsSorted(newGuests, sortType);
            const filteredGuests = _getGuestsFiltered(sortedGuests, textFilter, observationFilter, statusFilter);
            setGuestListState({
                allGuests: sortedGuests,
                filteredGuests: filteredGuests
            })

            if (cleanFilters) {
                setTextFilter("");
                setObservationFilter(undefined);
                setStatusFilter(undefined);
            }

            const observations = _getAllObservationsToFilter(sortedGuests);
            setObservations(observations);
        }
        setIsGettingGuests(false);
    }

    const onFilterChange = (text: string | undefined | null, observation: Item | undefined | null, status: GuestStatusEnum | undefined | null) => {
        if (isGettingGuests) return;

        const filteredGuests = _getGuestsFiltered(guestListState?.allGuests, text, observation, status);
        setGuestListState({
            ...guestListState,
            filteredGuests: filteredGuests
        });
    }

    const sortGuests = () => {
        if (isGettingGuests) return;

        const sortedGuests = _getGuestsSorted(guestListState.allGuests, sortType);
        const filteredGuests = _getGuestsFiltered(sortedGuests, textFilter, observationFilter, statusFilter);
        setGuestListState({
            allGuests: sortedGuests,
            filteredGuests: filteredGuests
        })
    }

    const calculateSummary = () => {
        const presentCount = guestListState?.allGuests?.filter(x => x.status == GuestStatusEnum.PRESENT)?.length ?? 0;
        const absentCount = guestListState?.allGuests?.filter(x => !x.status || x.status == GuestStatusEnum.ABSENT)?.length ?? 0;
        const absentWithNoticeCount = guestListState?.allGuests?.filter(x => x.status == GuestStatusEnum.ABSENT_WITH_NOTICE)?.length ?? 0;
        setPieChartGuestValues({ presentCount, absentCount, absentWithNoticeCount });
    }

    const onGuestStatusChange = () => {
        calculateSummary();
    }

    const onTextFilterChange = (text: string): void => {
        setTextFilter(text);
        onFilterChange(text, observationFilter, statusFilter);
    }

    const onObservationFilterChange = (observation: Item | undefined): void => {
        setObservationFilter(observation);
        onFilterChange(textFilter, observation, statusFilter);
    }

    const onStatusFilterChange = (status: GuestStatusEnum | undefined): void => {
        setStatusFilter(status);
        onFilterChange(textFilter, observationFilter, status);
    }

    const onPressSort = () => {
        if (isGettingGuests) return;

        let newSortType = SortType.NONE
        if (sortType == SortType.ASC || sortType == SortType.NONE)
            newSortType = SortType.DESC;
        else
            newSortType = SortType.ASC;
        setSortType(newSortType);
    }

    const saveGuestToDB = async (guest: Guest) => {
        if (isSavingGuest) return;
        setIsGuestModalVisible(false);

        const subEvent = getSubEvent();
        if (!currentEvent || !currentEvent.id) {
            Alert.alert("Error de guardado", "Debe seleccionar un evento para continuar", [{ text: "Cerrar" }]);
            return;
        } else if (!subEvent || !subEvent.id) {
            Alert.alert("Error de guardado", "Debe seleccionar un sub-evento para continuar", [{ text: "Cerrar" }]);
            return;
        }

        setIsSavingGuest(true);
        const saved = await saveGuest(db!, guest, currentEvent.id, subEvent.id);
        if (saved) {
            await syncGuests(false)
            getGuestsFromDB(true);
        } else {
            Alert.alert("Error de guardado", "Ocurrió un error al guardar el formulario, intente nuevamente", [{ text: "Cerrar" }]);
        }
        setIsSavingGuest(false);
    }

    const showGuestModal = () => {
        setIsGuestModalVisible(true);
    }

    const closeGuestModal = () => {
        setIsGuestModalVisible(false);
    }

    const scanQRCode = () => {
        const subEvent = getSubEvent();
        navigation.navigate(Screens.QRCodeGuestScanner, { subEventId: subEvent?.id, subEventName: subEvent?.name })
    }

    const _getGuestsSorted = (items: Guest[], sortType: SortType): Guest[] => {
        if (!items) return [];
        return items.sort((guest1: Guest, guest2: Guest) => {
            const fullname1 = capitalize(guest1.lastname?.trim() + ' ' + guest1.firstname?.trim());
            const fullname2 = capitalize(guest2.lastname?.trim() + ' ' + guest2.firstname?.trim());
            if (fullname1 < fullname2) return sortType == SortType.NONE || sortType == SortType.ASC ? -1 : 1;
            if (fullname1 > fullname2) return sortType == SortType.NONE || sortType == SortType.ASC ? 1 : -1;
            return 0;
        });
    }

    const _getGuestsFiltered = (
        items: Guest[],
        text: string | undefined | null,
        observation: Item | undefined | null,
        status: GuestStatusEnum | undefined | null
    ): Guest[] => {
        if (!items) return [];

        const textSafe = text?.toLowerCase()?.trim() ?? '';
        return items.filter(guest => {
            const fullname = (guest?.lastname ?? '') + ' ' + (guest?.firstname ?? '');
            return (
                fullname?.toLowerCase()?.includes(textSafe)
                ||
                guest.documentNumber?.toLowerCase().includes(textSafe)
            )
                &&
                (
                    observation && observation.id != -1
                        ? guest.observations3 == observation.name
                        : (guest.observations3 == undefined || guest.observations3 == null || guest.observations3.includes(''))
                )
                &&
                (
                    status
                        ? guest.status == status
                        : (guest.status == undefined || guest.status == null || guest.status.includes(''))
                );
        });
    }

    const _getAllObservationsToFilter = (items: Guest[]): Item[] => {
        if (!items) return [];
        const observations = items
            ?.filter(x => isNotNullOrEmpty(x.observations3?.trim()))
            ?.map(x => x.observations3!)
            ?.filter((item, index, array) => { // remove repeated (distinct)
                return array.findIndex(x => x === item) === index;
            })
            ?.sort((a, b) => {
                if (a < b) return -1;
                if (a > b) 1;
                return 0;
            })
            ?.map<Item>((x, index) => ({ id: index, name: x }))

        if (observations && observations.length > 0)
            observations.unshift({ id: -1, name: 'Todas' });

        return observations;
    }


    return {
        getSubEvent,
        isGettingGuests,
        guests: guestListState.filteredGuests,
        textFilter,
        onTextFilterChange,
        onObservationFilterChange,
        onStatusFilterChange,
        statusFilter,
        observationFilter,
        onGuestStatusChange,
        onPressSort,
        sortType,
        observations,
        isGuestModalVisible,
        showGuestModal,
        closeGuestModal,
        saveGuestToDB,
        isSavingGuest,
        pieChartGuestValues,
        scanQRCode
    };
};