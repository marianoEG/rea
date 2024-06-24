using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FordEvents.Common.Data.SyncDeviceData;
using FordEvents.Common.Data.Vehicle;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Interfaces;
using FordEvents.Common.Utils;
using Microsoft.EntityFrameworkCore;

namespace FordEvents.Model.FordEventsDB
{
    public partial class Device : IDestroyable
    {
        public void Validate()
        {

        }

        public void AddTracking(SyncActionTypeEnum syncActionType, SyncDeviceData data)
        {
            this.Name = data.Name;
            this.OperativeSystem = data.OperativeSystem;
            this.OperativeSystemVersion = data.OperativeSystemVersion;
            this.Brand = data.Brand;
            this.Model = data.Model;
            this.AppVersion = data.AppVersion;
            this.Ip = data.Ip;
            this.FreeSpace = data.FreeSpace;
            DateTime currentDate = DateTime.UtcNow;
            switch (syncActionType)
            {
                case SyncActionTypeEnum.DOWNLOAD_EVENTS:
                case SyncActionTypeEnum.DOWNLOAD_VEHICLES:
                case SyncActionTypeEnum.DOWNLOAD_DEALERSHIPS:
                case SyncActionTypeEnum.DOWNLOAD_PROVINCES:
                case SyncActionTypeEnum.DOWNLOAD_CONFIGURATIONS:
                    this.LastBaseDataDownloadSyncDate = currentDate;
                    break;
                case SyncActionTypeEnum.DOWNLOAD_CAMPAIGNS:
                    this.LastCampaignDownloadSyncDate = currentDate;
                    break;
                case SyncActionTypeEnum.UPLOAD_GUESTS:
                    this.LastGuestUploadSyncDate = currentDate;
                    break;
                case SyncActionTypeEnum.UPLOAD_CAMPAIGN_SEARCHES:
                    this.LastCampaignUploadSyncDate = currentDate;
                    break;
                case SyncActionTypeEnum.UPLOAD_FORMS:
                    this.LastFormsUploadSyncDate = currentDate;
                    break;
                case SyncActionTypeEnum.GET_NOTIFICATIONS:
                    break;
            }

            this.AddLog(syncActionType, data);
        }

        public void AddLog(SyncActionTypeEnum syncActionType, SyncDeviceData data)
        {
            DeviceLog newLog = new DeviceLog();
            newLog.Device = this;
            newLog.Type = syncActionType.ToString();
            newLog.Date = DateTime.UtcNow;
            newLog.Ip = data.Ip;
            newLog.ConnectionType = data.ConnectionType;

            FEContext.CurrentContext.DeviceLogs.Add(newLog);
        }

        public List<DeviceLog> GetLogs()
        {
            return FEContext.CurrentContext
                .DeviceLogs
                .Where(x => x.DeviceId == this.Id && !x.Deleted)
                .OrderByDescending(x => x.Date)
                .ToList();
        }

        public void DeleteAllLogs(Guid? userID)
        {
            FEContext
                .CurrentContext
                .Database
                .ExecuteSqlRaw("UPDATE DeviceLogs SET Deleted = 1, ModifiedOn = GETUTCDATE(), ModifiedBy = '" + userID + "' WHERE DeviceID = " + this.Id + " AND Deleted = 0");
        }

        public List<DeviceError> GetErrors()
        {
            return FEContext.CurrentContext
                .DeviceErrors
                .Where(x => x.DeviceUniqueId == this.UniqueId && !x.Deleted)
                .OrderByDescending(x => x.Date)
                .ToList();
        }

        public List<Notification> GetNotifications()
        {
            return FEContext.CurrentContext
                .Notifications
                .Where(x => x.DeviceUniqueId == this.UniqueId && !x.Deleted)
                .OrderByDescending(x => x.CreatedOnDate)
                .ToList();
        }

        public void DeleteAllErrors(Guid? userID)
        {
            FEContext
                .CurrentContext
                .Database
                .ExecuteSqlRaw("UPDATE DeviceErrors SET Deleted = 1, ModifiedOn = GETUTCDATE(), ModifiedBy = '" + userID + "' WHERE DeviceID = " + this.Id + " AND Deleted = 0");
        }

        public void Destroy()
        {
            this.Deleted = true;
        }
    }
}