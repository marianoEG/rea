import React, { useRef, useState } from 'react';
import { View, Text, Dimensions, Alert, StyleSheet, EventEmitter } from 'react-native';
import { theme } from '../../core/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts } from '../../utils/fonts';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useDbContext } from '../../context/DbContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../utils/rootNavigation';
import { decrypQRCodeGuest } from '../../utils/utils';
import { DefaultRootState, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { saveInfoCurrentGuest } from '../../store/action/guestAction';
import { Screens } from '../../navigation/Screens';

interface GuestDecoded {
  Id?: number;
  EventId?: number;
  SubeventId?: number;
  Firstname?: string;
  Lastname?: string;
  DocumentNumber?: string;
  Email?: string;
  PhoneNumber?: string;
  PreferenceDate?: string;
  PreferenceHour?: string;
  PreferenceVehicle?: string;
}

const QRTestDriveScanner = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const scannerRef = useRef<QRCodeScanner | null>(null);
  const { db } = useDbContext();
  const dispatch = useDispatch();
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const currentEvent = useSelector((st: DefaultRootState) => st.transient.currentEvent.event);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams, any>>();

  const onQRCodeRead = (event: BarCodeReadEvent) => {
    console.log('QRTestDriveScanner - onQRCodeRead:', event.data);
    setIsProcessing(true)
    setTimeout(() => {
      const guestDecodedStr = decrypQRCodeGuest(event.data);
      console.log('QRTestDriveScanner - decrypQRTestDriveScanner:', guestDecodedStr);
      if (!guestDecodedStr) {
        showAlertAndContinue('¡Advertencia!', 'No se pudo leer correctamente la información escaneada en el código QR');
        setIsProcessing(false);
        return;
      }
      try {
        const guestDecoded = JSON.parse(guestDecodedStr) as GuestDecoded;
      if (guestDecoded?.EventId == currentEvent?.id){
          updateInputs(guestDecoded)
          } else {
            showAlertAndContinue('¡Advertencia!', 'El invitado escaneado no pertenece a este evento');
            setIsProcessing(false);
        }
    } catch (error) {
        showAlertAndContinue('¡Advertencia!', 'No se encontró información correspondiente a un invitado de Ford en el código QR escaneado');
        setIsProcessing(false);
    }
    }, 1000)
  }

  const updateInputs = (guestDecoded: GuestDecoded) => {
    setIsProcessing(false)
    dispatch(saveInfoCurrentGuest(guestDecoded));
    navigation.goBack();
  }

  const showAlertAndContinue = (title: string, message: string) => {
    Alert.alert(
      title,
      message,
      [{
        text: "Continuar", onPress: () => {
          scannerRef?.current?.reactivate();
        }
      }]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>
          Escaneá el código QR del invitado
        </Text>
      </View>
      {
        isProcessing &&
        <View style={styles.processingContainer}>
          <Text style={styles.processingText}>
            Procesando...
          </Text>
        </View>
      }
      <QRCodeScanner
        ref={scannerRef}
        onRead={onQRCodeRead}
        cameraType={'back'}
        cameraStyle={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        cameraProps={{
          notAuthorizedView:
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.notAuthorizedText}>
                Se necesitan permisos de la cámara para poder escanear el código QR, dirigase a la configuración de la aplicación y acepte los permisos de la cámara
              </Text>
            </View>
        }}
        notAuthorizedView={
          <Text style={styles.notAuthorizedText}>
            Se necesitan permisos de la cámara para poder escanear el código QR
          </Text>
        }

      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground
  },
  topBar: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 48,
    paddingVertical: 24
  },
  title: {
    fontFamily: Fonts.FordAntennaWGLLight,
    fontSize: RFValue(13),
    color: theme.colors.textDark,
    textAlign: 'center'
  },
  notAuthorizedText: {
    fontFamily: Fonts.FordAntennaWGLExtraLight,
    fontSize: RFValue(13),
    color: theme.colors.textDark,
    textAlign: 'center',
    marginHorizontal: 48
  },
  processingContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 8,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  processingText: {
    width: '80%',
    fontFamily: Fonts.FordAntennaWGLRegular,
    fontSize: RFValue(13),
    backgroundColor: '#000000aa',
    color: theme.colors.textLight,
    textAlign: 'center',
    paddingVertical: 12,
    borderRadius: 8
  }
});

export default QRTestDriveScanner;
