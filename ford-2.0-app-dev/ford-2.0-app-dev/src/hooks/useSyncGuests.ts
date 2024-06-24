import { useEffect, useState } from "react";
import { useDbContext } from "../context/DbContext";
import { getEvent, getUnsynchronizedGuests } from '../utils/db';
import { DefaultRootState, useSelector } from 'react-redux';
import { ExtendedGuest, Guest } from "../model/Guest";
import { Item } from "../utils/constants";
import { Alert } from "react-native";
import { useUploadSyncContext } from "../context/UploadSyncContext";

export const useSyncGuests = () => {
    const [isGettingGuests, setIsGettingGuests] = useState<boolean>(true);
    const [subEvents, setSubEvents] = useState<Item[]>([]);
    const [guests, setGuests] = useState<ExtendedGuest[]>([]);
    const [filteredGuests, setFilteredGuests] = useState<ExtendedGuest[]>([]);
    const [subEventSelected, setSubEventSelected] = useState<Item>();
    const [isDeletingGuests, setIsDeletingGuests] = useState<boolean>(false);
    // Error Message
    const [snackBarMessage, setSnackBarMessage] = useState<string | null>(null);
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const { db } = useDbContext();
    const { startSyncGuests, isSyncingGuests } = useUploadSyncContext();

    useEffect(() => {
        searchGuests();
    }, []);

    useEffect(() => {
        filterGuests();
    }, [subEventSelected]);

    const searchGuests = async () => {
        setIsGettingGuests(true);
        try {
            const event = await getEvent(db!, currentEvent!.id!);
            let allGuests: Guest[] = [];
            let subEvents: Item[] = [];
            event?.subEvents?.forEach(subEvent => {
                subEvents.push({ id: subEvent.id!, name: subEvent.name! });
                const guests: ExtendedGuest[] | undefined = subEvent.guests
                    ?.filter(guest => guest.isSynchronized != true)
                    ?.map(guest => ({
                        ...guest,
                        eventId: currentEvent!.id,
                        subEventId: subEvent.id,
                        subEventName: subEvent.name
                    }));
                allGuests.push(...(guests && guests.length > 0 ? guests : []))
            });
            allGuests = allGuests.sort((guest1: Guest, guest2: Guest) => {
                const fullname1 = guest1.lastname + ' ' + guest1.firstname;
                const fullname2 = guest2.lastname + ' ' + guest2.firstname;
                if (fullname1 < fullname2) return -1;
                if (fullname1 > fullname2) return 1;
                return 0;
            });
            setSubEvents(subEvents);
            setGuests(allGuests);

            if (subEventSelected && subEventSelected)
                filterGuests();
            else
                setFilteredGuests(allGuests);
        } catch (error) {
            setSnackBarMessage('Ocurrió un error al obtener los invitados, intente nuevamente.');
            setGuests([]);
            setFilteredGuests([]);
        }
        setIsGettingGuests(false);
    }

    const filterGuests = () => {
        setFilteredGuests(guests.filter(x => !subEventSelected?.id || x.subEventId == subEventSelected?.id));
    }

    const syncGuests = async (isVisible: boolean) => {
        if (isSyncingGuests) return;

        // this is to avoid send repeated guests (since autosync)
        const guests = await getUnsynchronizedGuests(db!, subEventSelected?.id);
        const isSuccess = await startSyncGuests(guests);
        // property isSuccess could be null, in that case nothing is done
        if (isSuccess && isVisible) {
            Alert.alert("Invitados sincronizados", "Los invitados se sincronizaron correctamente", [{ text: "Cerrar" }]);
            await searchGuests();
        } else if (isSuccess == false) {
            setSnackBarMessage('Ocurrió un error al sincronizar invitados, intente nuevamente');
        }
    }

    const closeSnackBar = () => {
        setSnackBarMessage(null);
    }

    return {
        isGettingGuests,
        subEvents,
        filteredGuests,
        subEventSelected,
        setSubEventSelected,
        syncGuests,
        isSyncingGuests,
        isDeletingGuests,
        snackBarMessage,
        closeSnackBar
    };
};