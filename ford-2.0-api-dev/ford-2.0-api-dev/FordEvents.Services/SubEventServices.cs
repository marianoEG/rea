using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FordEvents.Services
{
    public class SubEventServices : BaseServices
    {
        public SubEventServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public PagedList<SubEventData> GetSubEventsList(int? pageNumber, int? pageSize, long? eventId, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventId);
                PagedList<SubEvent> subEventPage = _event.GetSubEvents(pageNumber, pageSize, searchText);

                PagedList<SubEventData> result = new PagedList<SubEventData>();
                result.ListOfEntities = subEventPage.ListOfEntities.ToList<object>().ToDataList<SubEventData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = subEventPage.TotalItems;
                return result;
            }
        }

        public SubEventData GetSubEvent(long? eventId, long? subeventId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventId);
                return _event.GetSubEvent(subeventId).ToData<SubEventData>();
            }
        }

        public SubEventData CreateSubEvent(SubEventData data)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(data.EventID);
                SubEvent subEvent = _event.CreateSubEvent(data);
                context.SaveChanges();
                return subEvent.ToData<SubEventData>();
            }
        }

        public SubEventData EditSubEvent(SubEventData data)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(data.EventID);
                SubEvent subEvent = _event.EditSubEvent(data);
                context.SaveChanges();
                return subEvent.ToData<SubEventData>();
            }
        }

        public void DeleteSubEvent(long? eventId, long? subeventId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventId);
                _event.DeleteSubEvent(subeventId);
                context.SaveChanges();
            }
        }
    }
}
