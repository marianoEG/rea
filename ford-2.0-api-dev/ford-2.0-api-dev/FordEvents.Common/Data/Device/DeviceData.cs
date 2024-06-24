using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Common.Data.Device
{
    public class DeviceData : BaseData
    {
        public string UniqueId { get; set; }
        public string Name { get; set; }
        public string OperativeSystem { get; set; }
        public string OperativeSystemVersion { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string AppVersion { get; set; }
        public string Ip { get; set; }
        public string FreeSpace { get; set; }
        public DateTime? LastBaseDataDownloadSyncDate { get; set; }
        public DateTime? LastCampaignDownloadSyncDate { get; set; }
        public DateTime? LastGuestUploadSyncDate { get; set; }
        public DateTime? LastCampaignUploadSyncDate { get; set; }
        public DateTime? LastFormsUploadSyncDate { get; set; }
    }
}
