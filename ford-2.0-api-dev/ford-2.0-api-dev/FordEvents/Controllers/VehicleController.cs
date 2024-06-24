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
    public class VehicleController : BaseController
    {
        private VehicleServices _vehicleServices;

        public VehicleController(VehicleServices vehicleServices)
        {
            _vehicleServices = vehicleServices;
        }

        [HttpPost, Route("")]
        public VehicleDeepData CreateVehicle([FromBody] VehicleDeepData vehicleData)
        {
            return _vehicleServices.CreateVehicle(vehicleData);
        }

        [HttpGet, Route("list")]
        public PagedList<VehicleData> GetVehiclesList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _vehicleServices.GetVehiclesList(pageNumber, pageSize, searchText);
        }

        [HttpGet, Route("{vehicleId}")]
        public VehicleDeepData GetVehicletById(long vehicleId)
        {
            return _vehicleServices.GetVehicle(vehicleId);
        }

        [HttpPut, Route("")]
        public VehicleDeepData EditVehicle([FromBody] VehicleDeepData vehicleData)
        {
            return _vehicleServices.EditVehicle(vehicleData);
        }

        [HttpDelete, Route("{vehicleId}")]
        public void DeleteVehicle(long vehicleId)
        {
            _vehicleServices.DeleteVehicle(vehicleId);
        }

        [HttpGet, Route("types")]
        public string[] GetVehicleTypes()
        {
            return _vehicleServices.GetVehicleTypes();
        }

        [HttpGet, Route("features")]
        public PagedList<FeatureData> GetVehicleFeaturesList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _vehicleServices.GetVehicleFeaturesList(pageNumber, pageSize, searchText);
        }

        
        [HttpGet, Route("featureGroups")]
        public PagedList<FeaturesGroupDeepData> GetVehicleFeatureGroupsList([FromQuery] long vehicleId, [FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _vehicleServices.GetVehicleFeatureGroupsList(vehicleId, pageNumber, pageSize, searchText);
        }

    }
}
