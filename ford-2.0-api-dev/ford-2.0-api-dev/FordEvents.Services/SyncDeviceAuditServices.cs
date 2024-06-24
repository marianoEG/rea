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
using FordEvents.Common.Data.SyncDeviceData;

namespace FordEvents.Services
{
    public class SyncDeviceAuditServices : BaseServices
    {

        private readonly ILogger<SyncServices> _logger;

        public SyncDeviceAuditServices(CurrentUserService currentUserService, CampaignApiInvoker campaignApiInvoker, ILogger<SyncServices> logger) : base(currentUserService)
        {
            _logger = logger;
        }

        public void Log(SyncActionTypeEnum syncActionType, SyncDeviceData data)
        {
            using (var context = this.GetCurrentContext())
            {
                Device device = context.GetDeviceByUniqueIdOrDefault(data.UniqueId);
                if (device == null)
                {
                    device = new Device();
                    device.UniqueId = data.UniqueId;
                    context.Devices.Add(device);
                }

                device.AddTracking(syncActionType, data);
                context.SaveChanges();
            }
        }
    }
}
