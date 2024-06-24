
using FordEvents.Common.Data.SyncDeviceData;
using FordEvents.Common.Services;
using FordEvents.Services;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Text;

namespace FordEvents.API.ActionFilters
{
    public class SyncDeviceAuditFilter : IActionFilter
    {

        private ILogger<LogActionFilter> _logger;
        private SyncDeviceAuditServices _syncDeviceAuditServices;

        public SyncDeviceAuditFilter(ILogger<LogActionFilter> logger, SyncDeviceAuditServices syncDeviceAuditServices)
        {
            _logger = logger;
            _syncDeviceAuditServices = syncDeviceAuditServices;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            try
            {
                if (context.Exception == null)
                {
                    EndpointNameAttribute attr = context.ActionDescriptor.EndpointMetadata.OfType<EndpointNameAttribute>().FirstOrDefault();
                    var headers = context.HttpContext.Request.Headers;
                    if (headers.ContainsKey("device-info") && headers.TryGetValue("device-info", out StringValues deviceInfoHeader))
                    {
                        SyncDeviceData data = JsonConvert.DeserializeObject<SyncDeviceData>(deviceInfoHeader);
                        if (data != null)
                            _syncDeviceAuditServices.Log(attr.syncActionType, data);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error to create sync auditory", ex);
            }
        }
    }
}
