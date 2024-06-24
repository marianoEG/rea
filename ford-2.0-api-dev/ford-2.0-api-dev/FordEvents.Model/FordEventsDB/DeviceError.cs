using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class DeviceError
    {
        public long Id { get; set; }
        public long? DeviceId { get; set; }
        public string Description { get; set; }
        public DateTime? Date { get; set; }
        public string Type { get; set; }
        public string DeviceUniqueId { get; set; }
        public string DeviceName { get; set; }
        public string OperativeSystem { get; set; }
        public string OperativeSystemVersion { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string AppVersion { get; set; }
        public string ConnectionType { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual Device Device { get; set; }
    }
}
