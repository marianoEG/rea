import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import { useNotification } from '../../hooks/useNotification';
import { useServiceCall } from '../../services/hooks/useServiceCall';
import { Notification } from '../../model/Notification';
import { postNotification } from '../../services/action/notificationAction';
import { Button, Modal, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';

interface NotificationModalProps {
  visible: boolean;
  notifications: Notification[];
  countNotification: number;
  hideModal: (id: number | undefined) => void;
  disabled: boolean;
}

const NotificationsModal: React.FC<NotificationModalProps> = ({
  visible,
  notifications,
  countNotification,
  hideModal,
  disabled,
}) => {
  return (
    <Modal dismissable={false} visible={visible} contentContainerStyle={styles.modalContent}>
        <View style={styles.modalContainer}>
            <Text style={styles.title}>Nueva notificación sin leer</Text>
            <Text style={styles.notificationText}>
                {notifications[countNotification]?.message}
            </Text>
            <Button disabled={disabled} mode='contained' onPress={() => hideModal(notifications[countNotification].id)} style={styles.closeButton}>
                <Text style={{fontSize:RFValue(12), color: 'white'}}>
                    Aceptar
                </Text>
            </Button>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContent: {
      alignSelf: 'center',
      width: '80%',
      margin: 20,
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
  },
  modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
  },
  title: {
      fontSize: RFValue(16),
      fontWeight: 'bold',
      marginBottom: 10,
  },
  notificationText: {
      fontSize: RFValue(14),
      marginBottom: 10,
  },
  closeButton: {
      marginTop: 10,
  },
});

export default NotificationsModal