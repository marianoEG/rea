using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncSaveGuestsData
    {
        public List<SyncGuestDeepData> Guests { get; set; }
        public string DeviceName { get; set; }
    }
}
