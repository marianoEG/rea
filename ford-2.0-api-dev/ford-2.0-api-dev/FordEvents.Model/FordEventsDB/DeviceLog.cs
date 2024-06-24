using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class DeviceLog
    {
        public long Id { get; set; }
        public long? DeviceId { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public string Ip { get; set; }
        public string ConnectionType { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Device Device { get; set; }
    }
}
