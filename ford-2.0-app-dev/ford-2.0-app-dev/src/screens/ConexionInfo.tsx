import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { theme } from '../core/theme';
import { ProgressBar } from 'react-native-paper';
import ButtonText from '../components/Buttons/ButtonText';
import { useDbContext } from '../context/DbContext';
import useConexionInfo from '../hooks/useConexionInfo';


interface ConexionInfoProps {
  onPressButton: () => void;
}

const ConexionInfo: React.FC<ConexionInfoProps> = ({ onPressButton }) => {
  const {
    isLoading,
    progress,
    isConnected,
    isConectedLow,
    downloadFile,
    saveErrorOnDB,
  } = useConexionInfo();

  StatusBar.setBackgroundColor(theme.colors.primary);

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <Image
          source={require('../assets/img/logo/oval_blue.png')}
          resizeMode='contain'
          style={styles.logo}
        />
        {isLoading ? (
          <>
            <Text style={{ color: theme.colors.accentText, marginBottom: 25, fontSize: 30 }}>
              Comprobando conexión a internet...
            </Text>
            <ProgressBar progress={progress} color={theme.colors.accentText} style={styles.progress} />
          </>
        ) : (
          <>
            {isConnected ? (
              <>
                {!isConectedLow ?
                  <>
                    <Text style={styles.textConection}>Conexión exitosa!</Text>
                    <Image
                      source={require('../assets/img/icons/ConexionExitosa_Icon.png')}
                      resizeMode='contain'
                      style={styles.ConexionIcon}
                    />
                  </>
                  :
                  <>
                    <Text style={styles.descriptionError}>
                      La conexión es un poco lenta.
                    </Text>
                    <Image
                      source={require('../assets/img/icons/Conexionwarning.png')}
                      resizeMode='contain'
                      style={styles.ConexionIcon}
                    />
                  </>
                }
                <ButtonText
                  textColor={theme.colors.primary}
                  style={styles.btnContinue}
                  title='Continuar'
                  uppercase={false}
                  onPress={onPressButton}
                />
              </>
            ) : (
              <>
                <Text style={styles.textConection}>No ha sido posible conectarse a internet</Text>
                <Image
                  source={require('../assets/img/icons/ConexionFalla_Icon.png')}
                  resizeMode='contain'
                  style={styles.ConexionIcon}
                />
                <Text style={styles.descriptionError}>
                  Puedes continuar sin acceso a internet.{"\n"}
                  Los datos serán los ultimos sincronizados.{"\n"}
                  Recordá conectar el dispositivo a internet para mantenerlo actualizado
                </Text>
                <ButtonText
                  textColor={theme.colors.primary}
                  style={styles.btnContinue}
                  title='Continuar'
                  uppercase={false}
                  onPress={onPressButton}
                />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    resizeMode: 'contain',
    width: 300,
    maxWidth: '100%',
    height: 150,
  },
  progress: {
    height: 10,
    width: 250,
  },
  textConection: {
    fontSize: 34,
    color: theme.colors.accentText,
    marginBottom: 25
  },
  ConexionIcon: {
    resizeMode: 'contain',
    width: 300,
    maxWidth: '17%',
    height: 110,
    marginBottom: 25
  },
  descriptionError: {
    fontSize: 22,
    color: theme.colors.accentText,
    textAlign: 'center',
    marginBottom: 25
  },
  btnContinue: {
    backgroundColor: theme.colors.accentText,
    borderRadius: 50
  }
});

export default ConexionInfo;
