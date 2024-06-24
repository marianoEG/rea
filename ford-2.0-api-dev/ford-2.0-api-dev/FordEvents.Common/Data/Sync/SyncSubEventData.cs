using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncSubEventData : BaseData
    {
        public string Name { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int? GuestNumber { get; set; }
        public string Image { get; set; }
        public bool? Deleted { get; set; }
        public List<SyncGuestData> Guests { get; set; }
    }
}
