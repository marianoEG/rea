using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Campaign
{
    public class CampaignData : BaseData
    {
        public long? CampaignId { get; set; }
        public string Env { get; set; }
        public string Vin { get; set; }
        public string Cc { get; set; }
        public string Pat { get; set; }
        public string Serv { get; set; }
        public DateTime? ServDate { get; set; }
        public string Manten { get; set; }
        public string Recall1 { get; set; }
        public string Recall2 { get; set; }
    }
}
