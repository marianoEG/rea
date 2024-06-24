using FordEvents.Common.Data;
using FordEvents.Common.Data.Campaign;
using FordEvents.Model.FordEventsDB;
using FordEvents.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("Campaign/v2")]
    public class CampaignV2Controller
    {
        private CampaignServices _campaignServices;

        public CampaignV2Controller(CampaignServices campaignServices)
        {
            _campaignServices = campaignServices;
        }

        [HttpGet, Route("list")]
        public PagedList<CampaignData> GetCampaignList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _campaignServices.GetCampaignList(pageNumber, pageSize, searchText);
        }

        [HttpGet, Route("{campaignId}")]
        public CampaignData GetCampaignById(long campaignId)
        {
            return _campaignServices.GetCampaign(campaignId);
        }

        [HttpPost, Route("")]
        public CampaignData CreateCampaign([FromBody] CampaignData data)
        {
            return _campaignServices.CreateCampaign(data);
        }

        [HttpPut, Route("")]
        public CampaignData EditCampaign([FromBody] CampaignData data)
        {
            return _campaignServices.EditCampaign(data);
        }

        [HttpDelete, Route("{campaignId}")]
        public void DeleteCampaign(long? campaignId)
        {
            _campaignServices.DeleteCampaign(campaignId);
        }
    }
}
