using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncGuestDeepData : SyncGuestData
    {
        public long? EventId { get; set; }
        public long? SubeventId { get; set; }
    }
}
