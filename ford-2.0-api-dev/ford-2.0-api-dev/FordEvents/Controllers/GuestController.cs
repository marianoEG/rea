using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Data.Guest;
using FordEvents.Common.Data.SaleForce;
using FordEvents.Common.Data.Sync;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GuestController : BaseController
    {
        private GuestServices _guestServices;

        public GuestController(GuestServices guestServices)
        {
            this._guestServices = guestServices;
        }

        [HttpGet, Route("{eventId}/{subeventId}/{guestId}")]
        public GuestData GetGuest(long eventId, long subeventId, long guestId)
        {
            return _guestServices.GetGuest(eventId, subeventId, guestId);
        }

        [HttpGet, Route("list")]
        public PagedList<GuestData> GetGuestsList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] long eventId, [FromQuery] long subeventId, [FromQuery] string searchText, [FromQuery] bool? changedByQrscanner)
        {
            return _guestServices.GetGuestsList(pageNumber, pageSize, eventId, subeventId, searchText, changedByQrscanner);
        }

        [HttpPost, Route("{eventId}")]
        public GuestData CreateGuest(long eventId, [FromBody] GuestData data)
        {
            return _guestServices.CreateGuest(eventId, data);
        }

        [HttpPut, Route("{eventId}")]
        public GuestData EditGuest(long eventId, [FromBody] GuestData data)
        {
            return _guestServices.EditGuest(eventId, data);
        }

        [HttpDelete, Route("{eventId}/{subeventId}/{guestId}")]
        public void DeleteGuest(long eventId, long subeventId, long guestId)
        {
            _guestServices.DeleteGuest(eventId, subeventId, guestId);
        }

        [HttpDelete, Route("{eventId}/{subeventId}")]
        public void DeleteGuests(long eventId, long subeventId)
        {
            _guestServices.DeleteGuests(eventId, subeventId);
        }

        [HttpPost, Route("import")]
        public void ImportGuest(IFormCollection data)
        {
            _guestServices.ImportGuestList(data);
        }

        [HttpPost, Route("sync-to-sale-force/{eventId}/{subeventId}")]
        public void SyncToSaleForce(long? eventId, long? subeventId, [FromBody] SyncToSaleForceData data)
        {
            _guestServices.syncToSaleForce(eventId, subeventId, data);
        }
    }
}
