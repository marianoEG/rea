using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.Notification;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class NotificationController : BaseController
    {
        private NotificationServices _notificationServices;

        public NotificationController(NotificationServices notificationServices)
        {
            _notificationServices = notificationServices;
        }
        
        [HttpPost, Route("")]
        public NotificationData CreateNotification([FromBody] NotificationData notificationData)
        {
            return _notificationServices.CreateNotification(notificationData);
        }
        
        [HttpGet, Route("list/{uniqueId}")]
        public PagedList<NotificationData> GetNotificationList(string uniqueId, [FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _notificationServices.GetNotificationList(uniqueId, pageNumber, pageSize, searchText);
        }

        [HttpGet, Route("{notificationId}")]
        public NotificationData GetNotificationById(long notificationId)
        {
            return _notificationServices.GetNotification(notificationId);
        }

      
        [HttpDelete, Route("{notificationId}")]
        public void DeleteNotification(long notificationId)
        {
            _notificationServices.DeleteNotification(notificationId);
        }
    }
}
