using FordEvents.Common.Data.CampaignSearch;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.CampaignSearches
{
    public class CampaignSearchData : BaseData
    {
        public long? EventId { get; set; }
        public string EventName { get; set; }
        public string SearchText { get; set; }
        public DateTime? SearchDate { get; set; }
        public long? CampaignId { get; set; }
        public string Vin { get; set; }
        public string Cc { get; set; }
        public string Pat { get; set; }
        public string Serv { get; set; }
        public string ServDate { get; set; }
        public string Manten { get; set; }
        public DateTime? SyncDate { get; set; }
    }
}
