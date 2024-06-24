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
using FordEvents.Common.Data.CampaignSearches;
using System;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CampaignSearchController : BaseController
    {
        private CampaignSearchServices _campaignSearchServices;

        public CampaignSearchController(CampaignSearchServices campaignSearchServices)
        {
            _campaignSearchServices = campaignSearchServices;
        }

        [HttpGet, Route("list")]
        public PagedList<CampaignSearchData> GetCampaignSearchList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText, [FromQuery] long? eventId, [FromQuery] DateTime? searchDateFrom, [FromQuery] DateTime? searchDateTo)
        {
            return _campaignSearchServices.GetCampaignSearchList(pageNumber, pageSize, searchText, eventId, searchDateFrom, searchDateTo);
        }
    }
}
