using FordEvents.Common.Data.CampaignSearch;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.SyncDeviceData
{
    public class SyncDeviceData
    {
        public long Id { get; set; }
        public string UniqueId { get; set; }
        public string Name { get; set; }
        public string OperativeSystem { get; set; }
        public string OperativeSystemVersion { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string AppVersion { get; set; }
        public string Ip { get; set; }
        public string FreeSpace { get; set; }
        public string ConnectionType { get; set; }
    }
}
