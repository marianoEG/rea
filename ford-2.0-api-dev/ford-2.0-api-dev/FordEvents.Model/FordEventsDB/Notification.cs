using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Notification
    {
        public long Id { get; set; }
        public long DeviceId { get; set; }
        public string DeviceUniqueId { get; set; }
        public string Message { get; set; }
        public DateTime? CreatedOnDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public bool Deleted { get; set; }

        public virtual Device Device { get; set; }
    }
}
