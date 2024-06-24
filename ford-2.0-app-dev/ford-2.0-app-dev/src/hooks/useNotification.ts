import {Notification} from '../model/Notification';
import {
  GetNotifications,
  postNotification,
} from '../services/action/notificationAction';
import {useServiceCall} from '../services/hooks/useServiceCall';
import {isRight} from 'fp-ts/lib/Either';
import {getUniqueId} from 'react-native-device-info';

export const useNotification = () => {
  const serviceDispatch = useServiceCall();

  const getNotifications = async (): Promise<Notification[]> => {
    const uniqueId = await getUniqueId();
    const response = await serviceDispatch(GetNotifications(uniqueId));
    if (isRight(response)) return response.right;
    else {
      throw new Error('Error al obtener eventos');
    }
  };

  const notificationAsRead = async (id: number) => {
    await serviceDispatch(postNotification(id));
  };

  return {getNotifications, notificationAsRead};
};
