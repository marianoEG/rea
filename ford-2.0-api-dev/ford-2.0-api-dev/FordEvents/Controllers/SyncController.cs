using System;
using System.Collections.Generic;
using System.IO;
using FordEvents.API.ActionFilters;
using FordEvents.API.Controllers;
using FordEvents.Common;
using FordEvents.Common.Data;
using FordEvents.Common.Data.CampaignSearches;
using FordEvents.Common.Data.Notification;
using FordEvents.Common.Data.Sync;
using FordEvents.Common.Data.SyncDeviceError;
using FordEvents.Common.Enums;
using FordEvents.Model.FordEventsDB;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.IO;

namespace FordEvents.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [ServiceFilter(typeof(SyncDeviceAuditFilter))]
    [Route("[controller]")]
    public class SyncController : BaseController
    {
        private SyncServices _syncServices;

        public SyncController(SyncServices syncServices)
        {
            this._syncServices = syncServices;
        }

        [HttpGet, Route("events")]
        [EndpointNameAttribute(SyncActionTypeEnum.DOWNLOAD_EVENTS)]
        public List<SyncEventData> SyncEvents([FromQuery] DateTime? lastSync = null)
        {
            return _syncServices.SyncEvents(lastSync);
        }

        [HttpGet, Route("vehicles")]
        [EndpointNameAttribute(SyncActionTypeEnum.DOWNLOAD_VEHICLES)]
        public List<SyncVehicleData> SyncVehicles([FromQuery] DateTime? lastSync = null)
        {
            return _syncServices.SyncVehicles(lastSync);
        }

        [HttpGet, Route("dealerships")]
        [EndpointNameAttribute(SyncActionTypeEnum.DOWNLOAD_DEALERSHIPS)]
        public List<SyncDealershipData> SyncDealerships([FromQuery] DateTime? lastSync = null)
        {
            return _syncServices.SyncDealerShips(lastSync);
        }

        [HttpGet, Route("provinces")]
        [EndpointNameAttribute(SyncActionTypeEnum.DOWNLOAD_PROVINCES)]
        public List<SyncProvinceData> SyncProvinces([FromQuery] DateTime? lastSync = null)
        {
            return _syncServices.SyncProvinces(lastSync);
        }

        [HttpGet, Route("configurations")]
        [EndpointNameAttribute(SyncActionTypeEnum.DOWNLOAD_CONFIGURATIONS)]
        public SyncConfiguration SyncConfigurations()
        {
            return _syncServices.SyncConfigurations();
        }

        [HttpGet, Route("campaigns")]
        [EndpointNameAttribute(SyncActionTypeEnum.DOWNLOAD_CAMPAIGNS)]
        public List<string> SyncCampaigns()
        {
            return _syncServices.SyncCampaigns();
        }

        [HttpPost, Route("guests")]
        [EndpointNameAttribute(SyncActionTypeEnum.UPLOAD_GUESTS)]
        public List<SyncGuestDeepData> SaveGuests([FromBody] SyncSaveGuestsData data)
        {
            return _syncServices.SaveGuests(data);
        }

        [HttpPost, Route("campaignSearches")]
        [EndpointNameAttribute(SyncActionTypeEnum.UPLOAD_CAMPAIGN_SEARCHES)]
        public void SaveCampaignSearches([FromBody] SyncSaveCampaignSearchesData data)
        {
            _syncServices.SaveCampaignSearches(data);
        }

        /// <summary>
        /// ¡¡¡¡IMPORTANTE NO BORRAR!!!!
        /// Como no se pueden guardar datos de formularios dada la sensibilidad, solo se guarda la fecha de la sincro de formularios.
        /// No es necesario llamar a ningún Service ya que la acción la realiza el ActionFilter SyncDeviceAuditFilter
        /// </summary>
        [HttpPost, Route("forms")]
        [EndpointNameAttribute(SyncActionTypeEnum.UPLOAD_FORMS)]
        public void SaveFormsCount([FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Allow)] List<SyncSaveFormsCountData> list = null)
        {
            _syncServices.SaveFormsCount(list);
        }

        [HttpPost, Route("device-errors")]
        [EndpointNameAttribute(SyncActionTypeEnum.UPLOAD_DEVICE_ERRORS)]
        public void SaveDeviceErrors([FromBody] List<SyncDeviceErrorData> errors)
        {
            _syncServices.SaveDeviceErrors(errors);
        }

        [HttpGet, Route("unread-notifications/{uniqueId}")]
        [EndpointNameAttribute(SyncActionTypeEnum.GET_NOTIFICATIONS)]
        public List<NotificationData> GetNotificationListToDelivery(string uniqueId)
        {
            return _syncServices.GetNotificationListToDelivery(uniqueId);
        }

        [HttpPost, Route("mark-notification-as-read/{notificationId}")]
        [EndpointNameAttribute(SyncActionTypeEnum.GET_NOTIFICATIONS)]
        public void MarkNotificationAsDelivered(long? notificationId)
        {
            _syncServices.MarkNotificationAsDelivered(notificationId);
        }

        [HttpGet, Route("connection-test")]
        [EndpointNameAttribute(SyncActionTypeEnum.CONNECTION_TEST)]
        public IActionResult DownloadConnectionTest()
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), AppSettings.AssetsFolder, AppSettings.ConnectionTestFile);
            if (System.IO.File.Exists(filePath))
            {
                var archivoBytes = System.IO.File.ReadAllBytes(filePath);
                return File(archivoBytes, "application/octet-stream", AppSettings.ConnectionTestFile);
            }

            return null;
        }
    }
}
