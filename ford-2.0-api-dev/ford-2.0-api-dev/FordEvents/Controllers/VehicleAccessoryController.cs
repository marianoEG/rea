using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Vehicle;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VehicleAccessoryController : BaseController
    {
        private VehicleAccessoryServices _vehicleAccessoryServices;

        public VehicleAccessoryController(VehicleAccessoryServices vehicleAccessoryServices)
        {
            _vehicleAccessoryServices = vehicleAccessoryServices;
        }

        [HttpPost, Route("")]
        public VehicleAccessoryData CreateVehicleAccessory([FromBody] VehicleAccessoryData accessoryData)
        {
            return _vehicleAccessoryServices.CreateVehicleAccessory(accessoryData);
        }

        [HttpGet, Route("list")]
        public PagedList<VehicleAccessoryData> GetVehicleAccessoryList([FromQuery] long vehicleId, [FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _vehicleAccessoryServices.GetVehicleAccessoryList(vehicleId, pageNumber, pageSize, searchText);
        }

        [HttpGet, Route("{vehicleId}/{vehicleAccessoryId}")]
        public VehicleAccessoryData GetVehicleAccessoryById(long vehicleId, long vehicleAccessoryId)
        {
            return _vehicleAccessoryServices.GetVehicleAccessory(vehicleId, vehicleAccessoryId);
        }

        [HttpPut, Route("")]
        public VehicleAccessoryData EditVersion([FromBody] VehicleAccessoryData vehicleAccessoryData)
        {
            return _vehicleAccessoryServices.EditVehicleAccessory(vehicleAccessoryData);
        }

        [HttpDelete, Route("{vehicleId}/{vehicleAccessoryId}")]
        public void DeleteVehicleAccessory(long vehicleId, long vehicleAccessoryId)
        {
            _vehicleAccessoryServices.DeleteVehicleAccessory(vehicleId, vehicleAccessoryId);
        }
    }
}
