using System;
using System.Collections.Generic;
using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.Sync;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SubEventController : BaseController
    {
        private SubEventServices _subEventServices;

        public SubEventController(SubEventServices subEventServices)
        {
            this._subEventServices = subEventServices;
        }

        [HttpGet, Route("{eventId}/{subeventId}")]
        public SubEventData GetSubEventById(long? eventId, long? subeventId)
        {
            return _subEventServices.GetSubEvent(eventId, subeventId);
        }

        [HttpGet, Route("list")]
        public PagedList<SubEventData> GetSubEventsList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] long? eventId, [FromQuery] string searchText)
        {
            return _subEventServices.GetSubEventsList(pageNumber, pageSize, eventId, searchText);
        }

        [HttpPost, Route("")]
        public SubEventData CreateSubEvent([FromBody] SubEventData data)
        {
            return _subEventServices.CreateSubEvent(data);
        }

        [HttpPut, Route("")]
        public SubEventData EditSubEvent([FromBody] SubEventData data)
        {
            return _subEventServices.EditSubEvent(data);
        }

        [HttpDelete, Route("{eventId}/{subeventId}")]
        public void DeleteSubEvent(long? eventId, long? subeventId)
        {
            _subEventServices.DeleteSubEvent(eventId, subeventId);
        }
    }
}
