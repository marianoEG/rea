import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { TNullableNumber, TNullableString } from "../../utils/constants";
import { ISOToDate, getSafeOrUndefined } from "../../utils/utils";
import { Notification } from "../../model/Notification"

const NotificationCodec = t.type({
  id: TNullableNumber,
  deviceId: TNullableNumber,
  message: TNullableString,
  createdOnDate: TNullableString,
  deliveredDate: TNullableString,
});

const NotificationResponseCodec = t.union([t.null, t.undefined, t.array(NotificationCodec)]);

const toNotification = (parsed: t.TypeOf<typeof NotificationResponseCodec>): Notification[] => {
  let notification: Notification[] = [];
  parsed?.map((notifications) => {
    notification.push({
      id: getSafeOrUndefined(notifications.id),
      deviceId: getSafeOrUndefined(notifications.deviceId),
      message: getSafeOrUndefined(notifications.message),
      createdOnDate: ISOToDate(notifications.createdOnDate),
      deliveredDate: ISOToDate(notifications.deliveredDate),
    });
  });
  return notification;
};

export const decodeNotificationResponse = (json: unknown) => {
  return either.map(NotificationResponseCodec.decode(json), toNotification);
};
