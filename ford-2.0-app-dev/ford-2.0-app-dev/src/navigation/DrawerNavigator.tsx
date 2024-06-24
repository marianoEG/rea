import React from "react";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { Image, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Divider, Text, TouchableRipple } from "react-native-paper";
import { theme } from "../core/theme";
import Home from '../screens/Home';
import { Screens } from './Screens';
import Vehicles from '../screens/vehicle/Vehicles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ButtonIcon from "../components/Buttons/ButtonIcon";
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { showSyncModal } from "../store/action/syncModalAction";
import { unselectEvent } from '../store/action/currentEventAction';
import { RFValue, RFPercentage } from 'react-native-responsive-fontsize';
import { Fonts } from "../utils/fonts";
import { ScrollView } from "react-native-gesture-handler";
import SubEvents from "../screens/event/SubEvents";
import DealerShips from "../screens/DealerShips";
import NewsletterForm from "../screens/form/NewsletterForm";
import { showAboutModal } from "../store/action/aboutModalAction";
import CampaignsChecker from "../screens/CampaignsChecker";
import SearchHistory from "../screens/SearchHistory";
import Signature from "../screens/form/TestDriveSignature";
import TestDriveSignature from "../screens/form/TestDriveSignature";
import TestDriveForm from "../screens/form/TestDriveForm";
import ContactInformation from "../screens/ContactInformation";
import SyncForms from "../screens/SyncForms";
import SyncGuests from "../screens/SyncGuests";
import SyncDevices from "../screens/SyncDevices";
import { useCallback } from 'react';
import HeaderRight from "./HeaderRight";
import { setCurrentScreen } from "../store/action/commonInfoAction";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
    const dispatch = useDispatch();

    const headerRight = useCallback((showEventName: boolean, showSyncButton: boolean) => {
        return (
            showSyncButton
                ?
                <HeaderRight
                    showEventName={showEventName}
                    onPressSync={() => dispatch(showSyncModal())}
                />
                :
                <HeaderRight
                    showEventName={showEventName}
                />
        )
    }, []);

    const handleNavigationFocusChanged = (screen: Screens): void => {
        dispatch(setCurrentScreen(screen));
    }

    return (
        <Drawer.Navigator
            // backBehavior="history"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerType: 'front',
                unmountOnBlur: true,
                headerShown: true,
                headerTitleStyle: {
                    fontFamily: Fonts.FordAntennaWGLRegular,
                    color: theme.colors.primary,
                    marginTop: -4
                },
                headerTitleContainerStyle: {
                    marginLeft: 2
                },
                headerTintColor: theme.colors.primary,
                headerRight: () => headerRight(true, true),
                headerStyle: {
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.36,
                    shadowRadius: 6.68,
                    elevation: 11,
                },
                drawerStyle: {
                    borderRadius: 0,
                    width: '75%',
                    maxWidth: 500
                },
                swipeEnabled: true,
            }}>
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.Home) }}
                name={Screens.Home}
                component={Home}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.Vehicles) }}
                name={Screens.Vehicles}
                component={Vehicles}
                options={{
                    title: 'Vehículos'
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.SubEvents) }}
                name={Screens.SubEvents}
                component={SubEvents}
                options={{
                    title: 'Invitados'
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.DealerShips) }}
                name={Screens.DealerShips}
                component={DealerShips}
                options={{
                    title: 'Solicitar una cotización',
                    headerRight: () => headerRight(true, false)
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.NewsletterForm) }}
                name={Screens.NewsletterForm}
                component={NewsletterForm}
                options={{
                    title: 'Formulario de newsletter',
                    headerRight: () => headerRight(true, false)
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.CampaignsChecker) }}
                name={Screens.CampaignsChecker}
                component={CampaignsChecker}
                options={{
                    title: 'Verificador de campañas',
                    headerRight: () => headerRight(true, false)
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.SearchHistory) }}
                name={Screens.SearchHistory}
                component={SearchHistory}
                options={{
                    title: 'Histórico de búsquedas',
                    headerRight: () => headerRight(true, false)
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.TestDriveForm) }}
                name={Screens.TestDriveForm}
                component={TestDriveForm}
                options={{
                    title: 'Test Drive (1/2)',
                    headerRight: () => headerRight(true, false)
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.ContactInformation) }}
                name={Screens.ContactInformation}
                component={ContactInformation}
                options={{
                    title: 'Información de contacto',
                    headerRight: () => headerRight(true, false)
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.SyncForms) }}
                name={Screens.SyncForms}
                component={SyncForms}
                options={{
                    title: 'Sincronizar formularios',
                    headerRight: () => headerRight(true, false)
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.SyncGuests) }}
                name={Screens.SyncGuests}
                component={SyncGuests}
                options={{
                    title: 'Sincronizar invitados',
                    headerRight: () => headerRight(true, false)
                }}
            />
            <Drawer.Screen
                listeners={{ focus: () => handleNavigationFocusChanged(Screens.SyncDevices) }}
                name={Screens.SyncDevices}
                component={SyncDevices}
                options={{
                    title: 'Sincronizar dispositivos',
                    headerRight: () => headerRight(true, false)
                }}
            />
        </Drawer.Navigator>
    )
}

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const dispatch = useDispatch();

    const clearCurrentEvent = () => {
        dispatch(unselectEvent());
    }

    const showAboutModalInfo = () => {
        dispatch(showAboutModal());
    }

    const navigate = (screen: Screens) => {
        props.navigation.navigate(screen);
    }

    return (
        <DrawerContentScrollView
            {...props}
            style={{
                backgroundColor: theme.colors.drawerBackgroud,
                overflow: "hidden"
            }}
            contentContainerStyle={{
                height: "100%",
                paddingTop: 0
            }} >
            <Header onPress={showAboutModalInfo} />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Item title="Home" onPress={() => navigate(Screens.Home)} />
                <Item title="Vehículos" onPress={() => navigate(Screens.Vehicles)} />
                <Item title="Lista de invitados" onPress={() => navigate(Screens.SubEvents)} />
                <Item title="Solicitar una cotización" onPress={() => navigate(Screens.DealerShips)} />
                <Item title="Newsletters" onPress={() => navigate(Screens.NewsletterForm)} />
                <Item title="Verificador de campañas" onPress={() => navigate(Screens.CampaignsChecker)} />
                <Item title="Histórico de búsquedas" onPress={() => navigate(Screens.SearchHistory)} />
                <Item title="Test Drive" onPress={() => navigate(Screens.TestDriveForm)} />
                <Item title="Información de contacto" onPress={() => navigate(Screens.ContactInformation)} />
                <Item title="Sincronizar formularios" onPress={() => navigate(Screens.SyncForms)} />
                <Item title="Sincronizar invitados" onPress={() => navigate(Screens.SyncGuests)} />
                {/* <Item title="Sincronizar dispositivos" onPress={() => navigate(Screens.SyncDevices)} /> */}
                {/* Spacer */}
                <View style={{ flex: 1 }}></View>
                <Item title="Volver a listado de eventos" showBorderBottom={false} onPress={clearCurrentEvent} />
            </ScrollView>
        </DrawerContentScrollView>
    );
};

interface HeaderProps {
    onPress?: () => void
}

const Header = ({ onPress }: HeaderProps) => {
    return (
        <TouchableWithoutFeedback
            onPress={onPress}
        >
            <View style={styles.headerContainer}>
                <Image
                    source={require('../assets/img/logo/oval_white.png')}
                    style={{ width: 175, resizeMode: 'contain' }}
                />
            </View>
        </TouchableWithoutFeedback>
        // <View style={styles.headerContainer}>
        //     <Image
        //         source={require('../assets/img/logo/oval_white.png')}
        //         style={{ width: 175, resizeMode: 'contain' }}
        //     />
        // </View>
    )
}

interface ItemProps {
    title: string;
    showBorderBottom?: boolean,
    onPress: () => void;
}
const Item = ({ title, showBorderBottom = true, onPress }: ItemProps) => {
    return (
        <TouchableRipple
            onPress={onPress}
            rippleColor={theme.colors.primary + '20'} >
            <View style={{}}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 12,
                        paddingHorizontal: 18
                    }} >
                    <Text style={styles.itemText}>{title}</Text>
                    <Icon name='chevron-right' color={theme.colors.primary} size={35} style={{ justifyContent: 'center' }} />
                </View>
                {showBorderBottom && <Divider
                    style={{
                        width: '100%',
                        height: RFValue(1),
                        backgroundColor: theme.colors.primary
                    }}
                />}
            </View>
        </TouchableRipple>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        //height: heightPercentageToDP("22%"),
        height: RFPercentage(25),
        maxHeight: 250,
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemText: {
        //fontSize: heightPercentageToDP("2*%"),
        fontSize: RFValue(14),
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.primary,
    },
    eventName: {
        fontFamily: Fonts.FordAntennaWGLRegular,
        color: theme.colors.primary,
        fontSize: RFValue(11.5),
        marginRight: 8
    }
});

export default DrawerNavigator;