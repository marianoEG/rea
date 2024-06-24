using FordEvents.Common.Data.CampaignSearch;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.CampaignSearches
{
    public class SyncCampaignSearchData : BaseData
    {
        public long? EventId { get; set; }
        public string EventName { get; set; }
        public string SearchText { get; set; }
        public DateTime SearchDate { get; set; }
        public SyncCampaignSearchDetailData Campaign { get; set; }
    }
}
