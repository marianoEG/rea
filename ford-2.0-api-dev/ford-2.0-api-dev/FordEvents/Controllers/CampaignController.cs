using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Dealership;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.City;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using FordEvents.Common.Data.Campaign;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CampaignController : BaseController
    {
        private CampaignServices _campaignServices;

        public CampaignController(CampaignServices campaignServices)
        {
            _campaignServices = campaignServices;
        }

        [HttpGet, Route("list")]
        public List<string> GetCampaignFileList()
        {
            return _campaignServices.GetCampaignFileList();
        }

        [HttpDelete, Route("{fileName}")]
        public void DeleteCampaign(string fileName)
        { 
            _campaignServices.DeleteCampaign(fileName);
        }
    }
}
