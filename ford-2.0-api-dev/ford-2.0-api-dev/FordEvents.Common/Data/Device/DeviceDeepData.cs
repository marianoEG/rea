using FordEvents.Common.Data.CampaignSearch;
using FordEvents.Common.Data.Notification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Device
{
    public class DeviceDeepData : DeviceData
    {
        public List<DeviceLogData> Logs { get; set; }
        public List<DeviceErrorData> Errors { get; set; }
        public List<NotificationData> Notifications { get; set; }
    }
}
