using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.CampaignSearch
{
    public class SyncCampaignSearchDetailData
    {
        public long? Id { get; set; }
        public string Vin { get; set; }
        public string Cc { get; set; }
        public string Pat { get; set; }
        public string Serv { get; set; }
        public string Fecha_serv { get; set; }
        public string Manten { get; set; }
    }
}
