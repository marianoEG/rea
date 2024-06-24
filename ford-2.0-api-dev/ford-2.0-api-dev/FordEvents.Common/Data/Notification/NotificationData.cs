using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Notification
{
    public class NotificationData :  BaseData
    {
        public long DeviceId { get; set; }
        
        public string DeviceUniqueId { get; set; }

        public string Message { get; set; }

        public DateTime? CreatedOnDate { get; set; }

        public DateTime? DeliveredDate { get; set; }

    }
}
