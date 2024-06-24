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
    public class VersionController : BaseController
    {
        private VersionServices _versionServices;

        public VersionController(VersionServices versionServices)
        {
            _versionServices = versionServices;
        }

     
        [HttpPost, Route("")]
        public VersionDeepData CreateVersion([FromBody] VersionDeepData versionData)
        {
            return _versionServices.CreateVersion(versionData);
        }

        [HttpPost, Route("set-pre-launch/{versionId}")]
        public void SetPreLaunch(long versionId, [FromBody] VersionPreLaunchData preLaunchData)
        {
            _versionServices.SetPreLaunch(versionId, preLaunchData);
        }

        [HttpPost, Route("change-price/{versionId}")]
        public void ChangePrice(long versionId, [FromBody] VersionPriceData data)
        {
            _versionServices.ChangePrice(versionId, data);
        }


        [HttpGet, Route("list")]
        public PagedList<VersionData> GetVersionList([FromQuery] long vehicleId, [FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _versionServices.GetVersionList(vehicleId, pageNumber, pageSize, searchText);
        }

    
        [HttpGet, Route("{versionId}")]
        public VersionDeepData GetVersionById(long versionId)
        {
            return _versionServices.GetVersion(versionId);
        }

    
        [HttpPut, Route("")]
        public VersionDeepData EditVersion([FromBody] VersionDeepData versionData)
        {
            return _versionServices.EditVersion(versionData);
        }

        [HttpDelete, Route("{versionId}")]
        public void DeleteVersion(long versionId)
        {
            _versionServices.DeleteVersion(versionId);
        }
    }
}
