using FordEvents.Common.Data.CampaignSearch;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Device
{
    public class DeviceLogData: BaseData
    {
        public long DeviceId { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; }
        public string Ip { get; set; }
        public string ConnectionType { get; set; }
    }
}
