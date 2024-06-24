using FordEvents.Common.Data.CampaignSearch;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.SyncDeviceError
{
    public class SyncDeviceErrorData
    {
        public long Id { get; set; }
        public string Description { get; set; }
        public DateTime? Date { get; set; }
        public string Type { get; set; }
        public string DeviceUniqueId { get; set; }
        public string DeviceName { get; set; }
        public string OperativeSystem { get; set; }
        public string OperativeSystemVersion { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string AppVersion { get; set; }
        public string ConnectionType { get; set; }
    }
}
