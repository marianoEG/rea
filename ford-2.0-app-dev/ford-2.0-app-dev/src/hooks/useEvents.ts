import { useEffect, useState } from "react";
import { DefaultRootState, useSelector } from "react-redux";
import { useDbContext } from "../context/DbContext";
import { Event } from "../model/Event";
import { getEvents } from "../utils/db";

export const useEvents = () => {
    const [isGettingEvents, setIsGettingEvents] = useState<boolean>(true);
    const [events, setEvents] = useState<Event[]>([]);
    const { db } = useDbContext();
    const { isSynchronizingBaseData, isSyncBaseDataFinished } = useSelector((st: DefaultRootState) => st.transient.sync);

    const getEventsFromDB = async () => {
        setIsGettingEvents(true);
        const events = await getEvents(db!,false);
        setEvents(events);
        setIsGettingEvents(false);
    }

    useEffect(() => {
        getEventsFromDB();
    }, []);

    useEffect(() => {
        if (!isSynchronizingBaseData && isSyncBaseDataFinished) {
            getEventsFromDB();
        }
    }, [isSynchronizingBaseData, isSyncBaseDataFinished]);

    return {
        isGettingEvents,
        events
    };
};