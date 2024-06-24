using FordEvents.Common.Data;
using FordEvents.Common.Data.Event;
using FordEvents.Common.Enums;
using FordEvents.Common.Exceptions;
using FordEvents.Common.Services;
using FordEvents.Model.FordEventsDB;
using System.Collections.Generic;
using System.Linq;

namespace FordEvents.Services
{
    public class EventServices : BaseServices
    {
        public EventServices(CurrentUserService currentUserService) : base(currentUserService) { }

        public PagedList<EventData> GetEventsList(int? pageNumber, int? pageSize, string searchText)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                string filter = string.IsNullOrWhiteSpace(searchText) ? "" : searchText.Trim().ToLower();
                IQueryable<Event> query = context.Events
                    .Where(x =>
                        !x.Deleted
                        &&
                        (x.Name.ToLower().Contains(filter))
                    )
                    .OrderBy(x => x.Name);

                PagedList<EventData> result = new PagedList<EventData>();
                result.ListOfEntities = query.Paginate(pageNumber, pageSize).ToList<object>().ToDataList<EventData>();
                result.CurrentPage = pageNumber;
                result.PageSize = pageSize;
                result.TotalItems = query.Count();
                return result;
            }
        }

        public EventData GetEvent(long eventId)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin() && !_currentUserService.IsReadOnly())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                return context.GetEventById(eventId)
                    .ToData<EventData>();
            }
        }

        public EventData CreateEvent(EventData eventData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = new Event();
                _event.Code = eventData.Code;
                _event.Name = eventData.Name;
                _event.DateFrom = eventData.DateFrom;
                _event.DateTo = eventData.DateTo;
                _event.Image = eventData.Image;
                _event.Enable = eventData.Enable;
                _event.TestDriveDemarcationOwnerEnabled = eventData.TestDriveDemarcationOwnerEnabled;
                _event.TestDriveDemarcationOwnerInCaravanEnabled = eventData.TestDriveDemarcationOwnerInCaravanEnabled;
                _event.TestDriveDemarcationFordEnabled = eventData.TestDriveDemarcationFordEnabled;
                _event.Validate();
                context.Events.Add(_event);
                context.SaveChanges();

                return _event.ToData<EventData>();
            }
        }

        public EventData EditEvent(EventData eventData)
        {
            using (var context = this.GetCurrentContext())
            {
                if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                Event _event = context.GetEventById(eventData.Id);
                _event.Code = eventData.Code;
                _event.Name = eventData.Name;
                _event.DateFrom = eventData.DateFrom;
                _event.DateTo = eventData.DateTo;
                _event.Image = eventData.Image;
                _event.Enable = eventData.Enable;
                _event.TestDriveDemarcationOwnerEnabled = eventData.TestDriveDemarcationOwnerEnabled;
                _event.TestDriveDemarcationOwnerInCaravanEnabled = eventData.TestDriveDemarcationOwnerInCaravanEnabled;
                _event.TestDriveDemarcationFordEnabled = eventData.TestDriveDemarcationFordEnabled;
                _event.Validate();
                context.SaveChanges();

                return _event.ToData<EventData>();
            }
        }

        public void DeleteEvent(long eventId)
        {
            using (var context = this.GetCurrentContext())
            {
               if (!_currentUserService.IsAdmin())
                    throw new BusinessLogicException(ExceptionCodeEnum.ACCESS_DENIED);

                context.GetEventById(eventId).Destroy();
                context.SaveChanges();
            }
        }
    }
}

