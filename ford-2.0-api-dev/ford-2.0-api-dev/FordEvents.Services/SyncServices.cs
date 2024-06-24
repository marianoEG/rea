using FordEvents.Common.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Model.FordEventsDB;
using FordEvents.Common.Utils;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Sync;
using FordEvents.Common;
using FordEvents.ApiClientInvoker;
using FordEvents.Common.Data.CampaignSearches;
using System.IO;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using FordEvents.Common.Data.SyncDeviceError;
using FordEvents.Common.Data.Notification;

namespace FordEvents.Services
{
    public class SyncServices : BaseServices
    {
        private CampaignApiInvoker _campaignApiInvoker;
        private readonly ILogger<SyncServices> _logger;

        public SyncServices(CurrentUserService currentUserService, CampaignApiInvoker campaignApiInvoker, ILogger<SyncServices> logger) : base(currentUserService)
        {
            _campaignApiInvoker = campaignApiInvoker;
            _logger = logger;
        }

        public List<SyncEventData> SyncEvents(DateTime? lastSync)
        {
            using (var context = this.GetCurrentContext())
            {
                DateTime currentDate = DateTime.UtcNow;
                return context.Events
                    .Where(x =>
                        (
                            (lastSync == null && x.Enable && !x.Deleted)
                            ||
                            (
                                lastSync != null
                                &&
                                x.Enable
                                &&
                                (
                                    x.ModifiedOn >= lastSync
                                    ||
                                    // Verifica si existe algún subevento modificado después de la fecha de la sincro
                                    x.SubEvents.Any(se =>
                                        se.ModifiedOn >= lastSync
                                        ||
                                        se.Guests.Any(g => g.ModifiedOn >= lastSync)
                                    )
                                )
                            )
                        )
                        &&
                        (x.DateFrom <= currentDate)
                        &&
                        (x.DateTo >= currentDate)
                    )
                    .ToList<object>()
                    .ToDataList<SyncEventData>();
            }
        }

        public List<SyncVehicleData> SyncVehicles(DateTime? lastSync)
        {
            using (var context = this.GetCurrentContext())
            {
                return context.Vehicles
                    .Where(x =>
                            (lastSync == null && x.Enabled && !x.Deleted)
                            ||
                            (
                                lastSync != null
                                &&
                                (
                                    x.ModifiedOn >= lastSync
                                    ||
                                    // Verifica si existe alguna imagen modificada después de la fecha de la sincro
                                    x.VehicleImages.Any(vi => vi.ModifiedOn >= lastSync)
                                    ||
                                    // Verifica si existe algún color modificado después de la fecha de la sincro
                                    x.VehicleColors.Any(vc => vc.ModifiedOn >= lastSync)
                                    ||
                                    // Verifica si existe algún accesorio modificado después de la fecha de la sincro
                                    x.VehicleAccessories.Any(va => va.ModifiedOn >= lastSync)
                                    ||
                                    // Verifica si existe alguna versión modificada después de la fecha de la sincro
                                    x.Versions.Any(v =>
                                        v.ModifiedOn >= lastSync
                                        ||
                                        // Verifica si existe algún FeatureVersion modificado después de la fecha de la sincro
                                        v.FeatureVersions.Any(fv => fv.ModifiedOn >= lastSync)
                                    )
                                    ||
                                    // Verifica si existe algún grupo de características modificado después de la fecha de la sincro
                                    x.FeaturesGroups.Any(fg =>
                                        fg.ModifiedOn >= lastSync
                                        ||
                                        // Verifica si existe alguna característica modificada después de la fecha de la sincro
                                        fg.Features.Any(f =>
                                            f.ModifiedOn >= lastSync
                                            ||
                                            // Verifica si existe algún FeatureVersion modificado después de la fecha de la sincro
                                            f.FeatureVersions.Any(fv => fv.ModifiedOn >= lastSync)
                                        )
                                    )
                                )
                            )
                    )
                    .ToList<object>()
                    .ToDataList<SyncVehicleData>();
            }
        }

        public List<SyncVehicleData> SyncVehiclesAux(DateTime? lastSync)
        {
            using (var context = this.GetCurrentContext())
            {
                return context.Vehicles
                    .Where(x =>
                            (lastSync == null && !x.Deleted)
                            ||
                            (lastSync != null && x.ModifiedOn >= lastSync)
                    )
                    .ToList<object>()
                    .ToDataList<SyncVehicleData>();
            }
        }

        public List<SyncDealershipData> SyncDealerShips(DateTime? lastSync)
        {
            using (var context = this.GetCurrentContext())
            {
                return context.Dealerships
                    .Where(x =>
                        (lastSync == null && !x.Deleted)
                        ||
                        (lastSync != null && x.ModifiedOn >= lastSync)
                    )
                    .ToList<object>()
                    .ToDataList<SyncDealershipData>();
            }
        }

        public List<SyncProvinceData> SyncProvinces(DateTime? lastSync)
        {
            using (var context = this.GetCurrentContext())
            {
                return context.Dealerships
                    .Where(x => !x.Deleted)
                    .Select(x => x.Province)
                    .Where(x => lastSync == null && !x.Deleted)
                    .Distinct()
                    .ToList<object>()
                    .ToDataList<SyncProvinceData>();
            }
        }

        public List<string> SyncCampaigns()
        {
            List<string> campaignUrls = new List<string>();
            if (Directory.Exists(AppSettings.CampaignsFolder))
            {
                campaignUrls = new DirectoryInfo(AppSettings.CampaignsFolder)
                  .GetFiles()
                  .Where(x => x.Extension == ".json")
                  .Select(x => AppSettings.BaseUrlToImages + AppSettings.CampaignsFolder + "/" + x.Name)
                  .ToList();
            }

            return campaignUrls;
        }

        public SyncConfiguration SyncConfigurations()
        {
            using (var context = this.GetCurrentContext())
            {
                List<Configuration> configurations = context.Configurations
                    .Where(x =>
                        !x.Deleted
                    )
                    .ToList();

                return new SyncConfiguration()
                {
                    TestDriveDemarcationOwnerUrl = configurations.FirstOrDefault(x => x.Key == "test_drive_demarcation_owner_url")?.Value,
                    TestDriveDemarcationOwnerInCaravanUrl = configurations.FirstOrDefault(x => x.Key == "test_drive_demarcation_owner_in_caravan_url")?.Value,
                    TestDriveDemarcationFordUrl = configurations.FirstOrDefault(x => x.Key == "test_drive_demarcation_ford_url")?.Value,
                    TestDriveTermsUrl = configurations.FirstOrDefault(x => x.Key == "test_drive_terms_url")?.Value,
                    NewsletterUrl = configurations.FirstOrDefault(x => x.Key == "newsletter_terms_url")?.Value,
                    QuoteUrl = configurations.FirstOrDefault(x => x.Key == "quote_terms_url")?.Value,
                    ContactData = configurations.FirstOrDefault(x => x.Key == "contact_data")?.Value
                };
            }
        }

        public List<SyncGuestDeepData> SaveGuests(SyncSaveGuestsData data)
        {
            this._logger.LogInformation(JsonConvert.SerializeObject(data));

            using (var context = this.GetCurrentContext())
            {
                if (data == null || data.Guests == null)
                    throw new BusinessLogicException(ExceptionCodeEnum.GUEST_ARE_REQUIRED);

                foreach (var guest in data.Guests.Where(x => x != null))
                {
                    SubEvent _subevent = context.GetSubEventByIdOrDefault(guest.SubeventId);
                    if (_subevent != null)
                    {
                        if (guest.Id == null)
                            _subevent.CreateGuest(CastHelper.CastGuestData(guest), true);
                        else
                            _subevent.EditGuest(CastHelper.CastGuestData(guest), false, true);
                    }
                }
                context.SaveChanges();

                List<long?> subEventIdList = data.Guests.Select(x => x.SubeventId).Distinct().ToList();
                return context.SubEvents
                    .Where(x =>
                        subEventIdList.Contains(x.Id)
                    )
                    .SelectMany(x =>
                        x.Guests.Where(g => g.Deleted == false)
                    )
                    .ToList<object>()
                    .ToDataList<SyncGuestDeepData>();
            }
        }

        public void SaveCampaignSearches(SyncSaveCampaignSearchesData data)
        {
            using (var context = this.GetCurrentContext())
            {
                if (data == null || data.Searches == null)
                    throw new BusinessLogicException(ExceptionCodeEnum.CAMPAIGN_SEARCH_ARE_REQUIRED);

                foreach (var campaignSearchItem in data.Searches)
                {
                    CampaignSearch _campaignSearch = new CampaignSearch();
                    _campaignSearch.EventId = campaignSearchItem.EventId;
                    _campaignSearch.SearchText = campaignSearchItem.SearchText;
                    _campaignSearch.SearchDate = campaignSearchItem.SearchDate;
                    _campaignSearch.CampaignId = campaignSearchItem.Campaign.Id;
                    _campaignSearch.Vin = campaignSearchItem.Campaign?.Vin;
                    _campaignSearch.Cc = campaignSearchItem.Campaign?.Cc;
                    _campaignSearch.Pat = campaignSearchItem.Campaign?.Pat;
                    _campaignSearch.Serv = campaignSearchItem.Campaign?.Serv;
                    _campaignSearch.ServDate = campaignSearchItem.Campaign?.Fecha_serv;
                    _campaignSearch.Manten = campaignSearchItem.Campaign?.Manten;
                    _campaignSearch.SyncDate = DateTime.UtcNow;
                    context.CampaignSearches.Add(_campaignSearch);
                }

                context.SaveChanges();
            }
        }

        public void SaveFormsCount(List<SyncSaveFormsCountData> list)
        {
            using (var context = this.GetCurrentContext())
            {
                if (list != null && list.Count > 0)
                {
                    foreach (var item in list)
                    {
                        Event _event = context.GetEventByIdOrDefault(item.EventId);
                        if (_event != null)
                        {
                            _event.AddFormsCount(item.TestDriveCount, item.TestDriveQRCount);
                        }
                    }
                }
                context.SaveChanges();
            }
        }

        public void SaveDeviceErrors(List<SyncDeviceErrorData> errors)
        {
            using (var context = this.GetCurrentContext())
            {
                if (errors != null && errors.Count > 0)
                {
                    foreach (var error in errors)
                    {
                        DeviceError _deviceError = new DeviceError();
                        _deviceError.Device = context.GetDeviceByUniqueIdOrDefault(error.DeviceUniqueId);
                        _deviceError.Description = error.Description;
                        _deviceError.Date = error.Date;
                        _deviceError.Type = error.Type;
                        _deviceError.DeviceUniqueId = error.DeviceUniqueId;
                        _deviceError.DeviceName = error.DeviceName;
                        _deviceError.OperativeSystem = error.OperativeSystem;
                        _deviceError.OperativeSystemVersion = error.OperativeSystemVersion;
                        _deviceError.Brand = error.Brand;
                        _deviceError.Model = error.Model;
                        _deviceError.AppVersion = error.AppVersion;
                        _deviceError.ConnectionType = error.ConnectionType;

                        context.DeviceErrors.Add(_deviceError);
                    }
                }

                context.SaveChanges();
            }
        }

        public List<NotificationData> GetNotificationListToDelivery(string uniqueId)
        {
            using (var context = this.GetCurrentContext())
            {
                Device device = context.GetDeviceByUniqueIdOrDefault(uniqueId);

                IQueryable<Notification> query = context.Notifications
                    .Where(x =>
                        !x.Deleted
                        &&
                        x.DeviceId == device.Id
                        &&
                        x.DeliveredDate == null
                    )
                    .OrderByDescending(x => x.CreatedOnDate);

                return query.ToList<object>().ToDataList<NotificationData>();
            }
        }

        public void MarkNotificationAsDelivered(long? notificationId)
        {
            using (var context = this.GetCurrentContext())
            {
                context.GetNotificationById(notificationId).MarkAsDelivered();
                context.SaveChanges();
            }
        }
    }
}
