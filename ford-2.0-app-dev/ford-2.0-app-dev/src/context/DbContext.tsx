import React, { createContext, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { getDbConnection, createTables, alterTables } from '../utils/db';

export interface DbContextState {
    db: SQLiteDatabase | null;
}

export const DbContext = createContext({} as DbContextState);

export const useDbContext = () => {
    return useContext(DbContext);
}

const DbContextProvider = ({ children }: any) => {
    const [isConnecting, setIsConnecting] = useState<boolean>(true);
    const [dbContextState, setDbContextState] = useState<DbContextState>({ db: null });

    useEffect(() => {
        let _db: SQLiteDatabase
        const getConnection = async () => {
            _db = await getDbConnection();
            await createTables(_db);
            await alterTables(_db);
            setDbContextState({ db: _db });
            setIsConnecting(false);
            console.log('Database Loaded');
            SplashScreen.hide();
        }
        getConnection();
        return () => {
            if (_db != null) {
                _db.close();
            }
        }
    }, []);

    if (isConnecting) {
        return (<View />)
    }

    return (
        <DbContext.Provider value={dbContextState}>
            {children}
        </DbContext.Provider >
    )
}

export default DbContextProvider;