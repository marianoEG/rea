using FordEvents.API.Controllers;
using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FordEvents.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventController: BaseController
    {
        private EventServices _eventServices;

        public EventController(EventServices eventServices)
        {
            _eventServices = eventServices;
        }
        
        [HttpPost, Route("")]
        public EventData CreateEvent([FromBody] EventData eventData)
        {
            return _eventServices.CreateEvent(eventData);
        }
        
        [HttpGet, Route("list")]
        public PagedList<EventData> GetEventsList([FromQuery] int? pageNumber, [FromQuery] int? pageSize, [FromQuery] string searchText)
        {
            return _eventServices.GetEventsList(pageNumber, pageSize, searchText);
        }
      
        [HttpGet, Route("{eventId}")]
        public EventData GetEventById(long eventId)
        {
            return _eventServices.GetEvent(eventId);
        }
     
        [HttpPut, Route("")]
        public EventData EditEvent([FromBody] EventData eventData)
        {
            return _eventServices.EditEvent(eventData);
        }

      
        [HttpDelete, Route("{eventId}")]
        public void DeleteEvent(long eventId)
        {
            _eventServices.DeleteEvent(eventId);
        }
    }
}
