using System;
using System.Collections.Generic;

#nullable disable

namespace FordEvents.Model.FordEventsDB
{
    public partial class Device
    {
        public Device()
        {
            DeviceErrors = new HashSet<DeviceError>();
            DeviceLogs = new HashSet<DeviceLog>();
            Notifications = new HashSet<Notification>();
        }

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
        public DateTime? LastBaseDataDownloadSyncDate { get; set; }
        public DateTime? LastCampaignDownloadSyncDate { get; set; }
        public DateTime? LastGuestUploadSyncDate { get; set; }
        public DateTime? LastCampaignUploadSyncDate { get; set; }
        public DateTime? LastFormsUploadSyncDate { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public Guid? ModifiedBy { get; set; }
        public Guid? CreatedBy { get; set; }
        public bool Deleted { get; set; }

        public virtual ICollection<DeviceError> DeviceErrors { get; set; }
        public virtual ICollection<DeviceLog> DeviceLogs { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
