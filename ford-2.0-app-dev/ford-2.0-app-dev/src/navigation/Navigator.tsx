import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Portal, TouchableRipple } from 'react-native-paper';
import { Screens } from "./Screens";
import DrawerNavigator from "./DrawerNavigator";
import Events from "../screens/event/Events";
import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import ButtonIcon from "../components/Buttons/ButtonIcon";
import SyncModal from "../components/Modals/SyncModal";
import { showSyncModal } from "../store/action/syncModalAction";
import SyncNotFound from "../screens/SyncNotFound";
import { Fonts } from "../utils/fonts";
import { theme } from "../core/theme";
import { rootNavigationRef } from '../utils/rootNavigation';
import VehicleDetail from "../screens/vehicle/VehicleDetail";
import VehicleComparator from "../screens/vehicle/VehicleComparator";
import { useCallback } from 'react';
import DealerShips from "../screens/DealerShips";
import DelaerShipQuoteForm from "../screens/form/DelaerShipQuoteForm";
import TermsAndConditionsModal from "../components/Modals/TermsAndConditionsModal";
import FormSavedSuccessModal from "../components/Modals/FormSavedSuccessModal";
import NewsletterForm from "../screens/form/NewsletterForm";
import AboutModal from "../components/Modals/AboutModal";
import CampaignInfoModal from "../components/Modals/CampaignInfoModal";
import Guests from "../screens/event/Guests";
import TestDriveSignature from "../screens/form/TestDriveSignature";
import TestDriveForm from "../screens/form/TestDriveForm";
import HeaderRight from "./HeaderRight";
import ImageViewerModal from "../components/Modals/ImageViewerModal";
import QRCodeGuestScanner from "../screens/event/QRCodeGuestScanner";
import { setCurrentScreen } from "../store/action/commonInfoAction";
import { useUploadSyncContext } from "../context/UploadSyncContext";
import QRTestDriveScanner from "../screens/event/QRTestDriveScanner";
import ConexionInfo from "../screens/ConexionInfo";
import { Image } from "react-native";
import { useNotification } from "../hooks/useNotification";
import { useServiceCall } from "../services/hooks/useServiceCall";
import { Notification } from "../model/Notification";
import NotificationsModal from "../components/Modals/NotificationsModal";
import { postNotification } from "../services/action/notificationAction";

const Stack = createNativeStackNavigator();

const Navigator = () => {
    const [showNavigator, setShowNavigator] = useState(false);
    const handlePressButton = () => {
        setShowNavigator(true);
    };
    return (
        <Portal>
            <NavigationContainer ref={rootNavigationRef}>
                {!showNavigator 
                    ? <ConexionInfo onPressButton={handlePressButton} />
                    : <RootNavigator />
                }
            </NavigationContainer>
        </Portal>
    );
}

const RootNavigator = () => {
    const { lastSyncBaseDate } = useSelector((st: DefaultRootState) => st.persisted.lastSyncInfo);
    const isEventSelected = useSelector((st: DefaultRootState) => st.transient.currentEvent.event != null);
    const isSyncModalVisible = useSelector((st: DefaultRootState) => st.transient.syncModal.isSyncModalVisible);
    const { isTermsModalVisible, type: termsModalType } = useSelector((st: DefaultRootState) => st.transient.termsModal);
    const { isVisible: isFormSavedSuccessModalVisible, formType: formSavedSuccessType } = useSelector((st: DefaultRootState) => st.transient.formSavedSuccesModal);
    const { isCampaignModalVisible, campaign } = useSelector((st: DefaultRootState) => st.transient.campaignModal);
    const isAboutModalVisible = useSelector((st: DefaultRootState) => st.transient.aboutModal.isAboutModalVisible);
    const { isImageViewerModalVisible, image: ImageViewerImage } = useSelector((st: DefaultRootState) => st.transient.imageViewerModal);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { isSyncingGuests, isSyncingCampaignSearches, isSyncingForms } = useUploadSyncContext();
    const { getNotifications, notificationAsRead } = useNotification();
    const serviceDispatch = useServiceCall();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [visible, setVisible] = useState(false);
    const [countNotification, setCountNotification] = useState(0)
    const [disabled, setDisable] = useState(false)
    const isCurrentScreen = useSelector((st: DefaultRootState) => st.transient.commonInfo.currentScreen);


    const headerRight = useCallback((showEventName: boolean = true) => {
        return (
            <HeaderRight
                showEventName={showEventName}
            />
        )
    }, []);

    const backButton = useMemo(() => {
        return (
            <ButtonIcon
                icon="arrow-back"
                size={30}
                color={theme.colors.primary}
                onPress={() => navigation.goBack()}
            />
        );
    }, []);

    useEffect(() => {
        if(isCurrentScreen === Screens.Home || isCurrentScreen === Screens.Events){
            _getNotifications()
        }
    }, [isCurrentScreen])

    const handleNavigationFocusChanged = (screen: Screens): void => {
        dispatch(setCurrentScreen(screen));
    }

    const _getNotifications = async () => {
        setCountNotification(0)
        try {
        const response = await getNotifications();
        setNotifications(response);
        console.log(response)
        if(response.length > 0){
            setVisible(true);
        }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const hideModal = async(id: number | undefined) => {
        setDisable(true)
        await serviceDispatch(postNotification(id))
        if(countNotification < notifications.length - 1){
            setCountNotification(current=>current+1)
        }else{
            setVisible(false)
        }
        setDisable(false)
    };


    return (
        <>
            <Stack.Navigator>
                {!lastSyncBaseDate
                    ?
                    (
                        <Stack.Screen
                            listeners={{ focus: () => handleNavigationFocusChanged(Screens.SyncNotFound) }}
                            name={Screens.SyncNotFound}
                            component={SyncNotFound}
                            options={{ headerShown: false }} />
                    )
                    :
                    (
                        <>
                            {!isEventSelected
                                ?
                                (
                                    <Stack.Screen
                                        listeners={{ focus: () => handleNavigationFocusChanged(Screens.Events) }}
                                        name={Screens.Events}
                                        component={Events}
                                        options={{
                                            title: 'Eventos',
                                            headerTitleStyle: {
                                                fontFamily: Fonts.FordAntennaWGLRegular,
                                                color: theme.colors.primary
                                            },
                                            headerRight: () => (
                                                <TouchableRipple
                                                    disabled={isSyncingGuests || isSyncingCampaignSearches || isSyncingForms}
                                                    onPress={() => dispatch(showSyncModal())}
                                                >
                                                    <Image
                                                        source={require('../assets/img/icons/DescargaIcon.png')}
                                                        resizeMode='contain'
                                                        style={{width:25, height: 25}}
                                                    />
                                                </TouchableRipple>
                                            )
                                        }} />
                                )
                                :
                                (
                                    <Stack.Group>
                                        {/* Drawer Navigation */}
                                        <Stack.Screen
                                            name={Screens.NavDrawer}
                                            component={DrawerNavigator}
                                            options={{ headerShown: false }}
                                        />
                                        <Stack.Group>
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.Guests) }}
                                                name={Screens.Guests}
                                                component={Guests}
                                                options={{
                                                    title: 'Invitados',
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.QRCodeGuestScanner) }}
                                                name={Screens.QRCodeGuestScanner}
                                                component={QRCodeGuestScanner}
                                                options={{
                                                    title: 'Escaner QR',
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.QRTestDriveScanner) }}
                                                name={Screens.QRTestDriveScanner}
                                                component={QRTestDriveScanner}
                                                options={{
                                                    title: 'Escaner QR',
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.VehicleDetail) }}
                                                name={Screens.VehicleDetail}
                                                component={VehicleDetail}
                                                options={{
                                                    title: '',
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.VehicleComparator) }}
                                                name={Screens.VehicleComparator}
                                                component={VehicleComparator}
                                                options={{
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    title: 'Comparador',
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.DealerShips) }}
                                                name={Screens.DealerShips}
                                                component={DealerShips}
                                                options={{
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    title: 'Concesionarios',
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.DelaerShipQuoteForm) }}
                                                name={Screens.DelaerShipQuoteForm}
                                                component={DelaerShipQuoteForm}
                                                options={{
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    title: 'Formulario de cotización',
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.NewsletterFormStack) }}
                                                name={Screens.NewsletterFormStack}
                                                component={NewsletterForm}
                                                options={{
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    title: 'Formulario de newsletter',
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.TestDriveFormStack) }}
                                                name={Screens.TestDriveFormStack}
                                                component={TestDriveForm}
                                                options={{
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    title: 'Test Drive',
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />
                                            <Stack.Screen
                                                listeners={{ focus: () => handleNavigationFocusChanged(Screens.TestDriveSignature) }}
                                                name={Screens.TestDriveSignature}
                                                component={TestDriveSignature}
                                                options={{
                                                    headerTitleStyle: {
                                                        fontFamily: Fonts.FordAntennaWGLRegular,
                                                        color: theme.colors.primary
                                                    },
                                                    title: 'Test Drive (2/2)',
                                                    headerLeft: () => backButton,
                                                    headerRight: () => headerRight()
                                                }}
                                            />


                                        </Stack.Group>
                                        {/* Sub-Event Navigation */}
                                        {/* <Stack.Group>
                                        </Stack.Group> */}
                                    </Stack.Group>
                                )
                            }
                        </>
                    )
                }
            </Stack.Navigator>
            <SyncModal
                isVisible={isSyncModalVisible}
            />
            <TermsAndConditionsModal
                isVisible={isTermsModalVisible}
                type={termsModalType}
            />
            <FormSavedSuccessModal
                isVisible={isFormSavedSuccessModalVisible}
                formType={formSavedSuccessType}
            />
            <CampaignInfoModal
                isVisible={isCampaignModalVisible}
                campaign={campaign}
            />
            <AboutModal
                isVisible={isAboutModalVisible}
            />
            <ImageViewerModal
                isVisible={isImageViewerModalVisible}
                image={ImageViewerImage}
            />
            <NotificationsModal
                visible={visible}
                notifications={notifications}
                countNotification={countNotification}
                hideModal={hideModal}
                disabled={disabled}
            />
        </>
    )
}

export default Navigator;