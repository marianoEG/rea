using System;
using System.Collections.Generic;
using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Device;
using FordEvents.Common.Data.Sync;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DeviceController : BaseController
    {
        private DeviceServices _deviceServices;

        public DeviceController(DeviceServices deviceServices)
        {
            this._deviceServices = deviceServices;
        }

        [HttpGet, Route("list")]
        public PagedList<DeviceData> GetDevices([FromQuery] int? pageNumber, [FromQuery] int? pageSize)
        {
            return _deviceServices.GetDevices(pageNumber, pageSize);
        }

        [HttpGet, Route("{uniqueId}")]
        public DeviceDeepData GetDevice(string uniqueId)
        {
            return _deviceServices.GetDevice(uniqueId);
        }

        [HttpDelete, Route("logs/{uniqueId}")]
        public void DeleteLogs(string uniqueId)
        {
            _deviceServices.deleteLogs(uniqueId);
        }

        [HttpDelete, Route("errors/{uniqueId}")]
        public void DeleteErrors(string uniqueId)
        {
            _deviceServices.deleteErrors(uniqueId);
        }
    }
}
