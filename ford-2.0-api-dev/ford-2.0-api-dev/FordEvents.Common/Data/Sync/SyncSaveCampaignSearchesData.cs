using FordEvents.Common.Data.CampaignSearches;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Sync
{
    public class SyncSaveCampaignSearchesData
    {
        public List<SyncCampaignSearchData> Searches { get; set; }
        public string DeviceName { get; set; }
    }
}
