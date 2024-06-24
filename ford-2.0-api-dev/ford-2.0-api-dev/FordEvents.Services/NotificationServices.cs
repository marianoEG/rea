using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.Notification;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using System.Collections.Generic;
using System.Linq;

namespace FordEvents.Services
{
    public class NotificationServices : BaseServices
    {
        public NotificationServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public PagedList<NotificationData> GetNotificationList(string uniqueId, int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Device device = context.GetDeviceByUniqueIdOrDefault(uniqueId);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<Notification> query = context.Notifications
                    .Where(x =>
                        x.DeviceId == device.Id
                        &&
                        !x.Deleted
                        &&
                        (x.Message.ToLower().Contains(filter))
                    )
                    .OrderByDescending(x => x.CreatedOnDate);

                PagedList<Notification> result = new PagedList<Notification>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<Notification>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return null;
            }
        }

        public NotificationData GetNotification(long notificationId)
        {
            using (var context = this.GetCurrentContext())
            {
                return context.GetNotificationById(notificationId)
                    .ToData<NotificationData>();
            }
        }

        public NotificationData CreateNotification(NotificationData notificationData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Device device = context.GetDeviceByUniqueIdOrDefault(notificationData.DeviceUniqueId);

                Notification _notif = new Notification();
                _notif.DeviceId = device.Id;
                _notif.DeviceUniqueId = notificationData.DeviceUniqueId;
                _notif.Message = notificationData.Message;
                _notif.CreatedOnDate = System.DateTime.Now;

                _notif.Validate();
                context.Notifications.Add(_notif);
                context.SaveChanges();

                return _notif.ToData<NotificationData>();
            }
        }

        public void DeleteNotification(long notificationId)
        {
            using (var context = this.GetCurrentContext())
            {
               if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                context.GetNotificationById(notificationId).Destroy();
                context.SaveChanges();
            }
        }
    }
}

