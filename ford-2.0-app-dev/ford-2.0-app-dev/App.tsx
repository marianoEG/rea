import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from './src/core/theme';
import { store, persistor } from "./src/store/store";
import Navigator from './src/navigation/Navigator';
import DbContextProvider from './src/context/DbContext';
import { PermissionsProvider } from './src/context/PermissionsContext/PermissionsContext';
import { LogBox } from 'react-native';
import { UploadSyncContextProvider } from './src/context/UploadSyncContext';

// ignore warnings that start in a string that matchs any of
// the ones in the array
LogBox.ignoreLogs(["Require cycle:"]);
//LogBox.ignoreAllLogs();
//(console as any).disableYellowBox = true;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  
  return (
    <SafeAreaProvider>
      <DbContextProvider>
        <PermissionsProvider>
          <Provider store={store}>
            <PersistGate persistor={persistor} loading={<View />}>
              <UploadSyncContextProvider>
                <PaperProvider theme={theme}>
                  <StatusBar backgroundColor={theme.colors.primaryDark} />
                  <Navigator />
                </PaperProvider>
              </UploadSyncContextProvider>
            </PersistGate>
          </Provider>
        </PermissionsProvider>
      </DbContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
