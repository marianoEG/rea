import { Notification } from '../../model/Notification';
import {ServiceCallAction} from '../../store/middleware/serviceCallMiddleware';
import { decodeNotificationResponse } from '../types/decodeNotification';

export const GetNotifications = (
  uniqueId: string,
): ServiceCallAction<Notification[]> => ({
  type: 'SERVICE_CALL',
  method: 'GET',
  endpoint: `sync/unread-notifications/${uniqueId}`,
  serviceKey: 'notification',
  parseResponse: decodeNotificationResponse
});

export const postNotification = (notificationId: number | undefined): ServiceCallAction<void> => ({
  type: "SERVICE_CALL",
  method: "POST",
  endpoint: `sync/mark-notification-as-read/${notificationId}`,
  serviceKey: "notification",
  body: {
    type: "json",
    value: null,
  }
});
