using FordEvents.Common.Data.Event;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncEventData : BaseData
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string Image { get; set; }
        public bool? TestDriveDemarcationOwnerEnabled { get; set; }
        public bool? TestDriveDemarcationOwnerInCaravanEnabled { get; set; }
        public bool? TestDriveDemarcationFordEnabled { get; set; }
        public bool? Deleted { get; set; }

        public List<SyncSubEventData> SubEvents { get; set; }
    }
}
